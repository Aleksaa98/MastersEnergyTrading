const cron = require('node-cron');
const axios = require('axios');

const DATA_SERVICE_URL = 'http://localhost:3001/api'; // http://microservice-data:3001/api

const updateBatteryCharge = async () => {
    try {
        console.log('Cron job started: Checking battery states...');
        const [batteriesResponse, priceResponse] = await Promise.all([
            axios.get(`${DATA_SERVICE_URL}/batteries`),
            axios.get(`${DATA_SERVICE_URL}/price/current`)
        ]);

        const batteries = batteriesResponse.data;
        const currentPriceInCents = priceResponse.data.price;
        const currentPrice = currentPriceInCents / 100; // Convert cents to dollars
        console.log("CENA:::::" + currentPriceInCents)
        for (const battery of batteries) {
            const { _id, state, stateOfCharge, capacity, traderId } = battery;
            const tenPercentCapacity = Math.round(capacity * 0.10);
            const ninetyFivePercentCapacity = Math.round(capacity * 0.95);

            try {
                const userResponse = await axios.get(`${DATA_SERVICE_URL}/users/id/${traderId}`);
                const user = userResponse.data.data;

                if (user.wallet.state === 'closed' || user.wallet.balance < currentPrice * 10) {
                    await axios.patch(`${DATA_SERVICE_URL}/batteries/${_id}`, { state: 'blocked' });
                    console.log(`Battery ${_id} blocked due to insufficient funds or inactive wallet.`);
                    continue;
               }

                let updated = false;
                let newState = state;
                let newStateOfCharge = stateOfCharge;
                let cost = 0;
                let transactionType = '';

                if (state === 'charging') {
                    newStateOfCharge += 10;
                    cost = 10 * currentPrice;
                    transactionType = 'buy';
                    if (newStateOfCharge >= ninetyFivePercentCapacity) {
                        newStateOfCharge = ninetyFivePercentCapacity;
                        newState = 'idle';
                    }
                    updated = true;
                } else if (state === 'discharging') {
                    newStateOfCharge -= 10;
                    cost = -10 * currentPrice;
                    transactionType = 'sell';
                    if (newStateOfCharge <= tenPercentCapacity) {
                        newStateOfCharge = tenPercentCapacity;
                        newState = 'idle';
                    }
                    updated = true;
                }

                if (updated) {
                    const finalStateOfCharge = Math.round(newStateOfCharge);
                    await axios.patch(`${DATA_SERVICE_URL}/batteries/${_id}`, {
                        state: newState,
                        stateOfCharge: finalStateOfCharge
                    });

                    const newBalance = Number((user.wallet.balance - cost).toFixed(2));
                    await axios.patch(`${DATA_SERVICE_URL}/users/${user.username}`, {
                        wallet: { ...user.wallet, balance: newBalance, state: "active" }
                    });

                    await axios.post(`${DATA_SERVICE_URL}/transaction`, {
                        userId: traderId,
                        type: transactionType,
                        amount: Math.abs(cost),
                        stratName: 'Automatic Charge/Discharge'
                    });

                    console.log(`Updating battery ${_id}: state=${newState}, stateOfCharge=${finalStateOfCharge}. User ${user.username} new balance: ${newBalance}`);
                }
            } catch (error) {
                console.error(`Error processing battery ${_id}:`, error.message);
            }
        }
        console.log('Cron job finished.');
    } catch (error) {
        console.error('Error in cron job:', error.message);
    }
};

const startBatteryChargeCronJob = () => {
    cron.schedule('*/15 * * * * *', updateBatteryCharge);
};

module.exports = { startBatteryChargeCronJob };
