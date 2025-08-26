const cron = require('node-cron');
const axios = require('axios');

const DATA_SERVICE_URL = 'http://localhost:3001/api'; // Use environment variable in production

const updateBatteryCharge = async () => {
    try {
        console.log('Cron job started: Processing batteries...');

        const [batteriesResponse, priceResponse, strategiesResponse] = await Promise.all([
            axios.get(`${DATA_SERVICE_URL}/batteries`),
            axios.get(`${DATA_SERVICE_URL}/price/current`),
            axios.get(`${DATA_SERVICE_URL}/tradingStrategies`)
        ]);

        let batteries = batteriesResponse.data;
        const currentPriceInCents = priceResponse.data.price;
        const currentPrice = currentPriceInCents / 100;
        const strategies = strategiesResponse.data;

        const buyLowSellHighStrategy = strategies.find(s => s.name === 'Buy Low, Sell High');
        const peakHoursStrategy = strategies.find(s => s.name === 'Charge on Off-Peak, Discharge on-Peak');
        const socProtectionStrategy = strategies.find(s => s.name === 'State-of-Charge Protection');


        // First, apply strategy-based state changes
        if (buyLowSellHighStrategy) {
            for (const battery of batteries) {
                if (battery.tradingStrat === buyLowSellHighStrategy._id) {
                    const { _id, state, stateOfCharge, capacity } = battery;
                    const tenPercentCapacity = Math.round(capacity * 0.10);
                    const maxCapacity = Math.round(capacity * 0.90);
                    const priceThreshold = 0.05;

                    let newState = state;

                    if (currentPrice <= priceThreshold) {
                        if (stateOfCharge < maxCapacity && state !== 'charging') {
                            newState = 'charging';
                        } else if (stateOfCharge >= maxCapacity) {
                            newState = 'idle';
                        }
                    } else { // currentPrice > priceThreshold
                        if (stateOfCharge > tenPercentCapacity && state !== 'discharging') {
                            newState = 'discharging';
                        } else if (stateOfCharge <= tenPercentCapacity) {
                            newState = 'idle';
                        }
                    }

                    if (newState !== state) {
                        await axios.patch(`${DATA_SERVICE_URL}/batteries/${_id}`, { state: newState });
                        console.log(`Strategy updated battery ${_id} state to ${newState}.`);
                        // Update the battery state in our local array to reflect the change for the next step
                        battery.state = newState;
                    }
                }
            }
        }
        if (peakHoursStrategy) {
            for (const battery of batteries) {
                if (battery.tradingStrat === peakHoursStrategy._id) {
                    const { _id, state, stateOfCharge, capacity } = battery;
                    const tenPercentCapacity = Math.round(capacity * 0.10);
                    const maxCapacity = Math.round(capacity * 0.90);
                    const { offPeakStart, offPeakEnd, peakStart, peakEnd } = peakHoursStrategy.parameters;
                    const currentHour = new Date().getHours();

                    let newState = state;

                    if (currentHour >= offPeakStart && currentHour < offPeakEnd) {
                        if (stateOfCharge < maxCapacity && buyLowSellHighStrategy) {
                            newState = 'charging';
                        } else if (stateOfCharge >= maxCapacity) {
                            newState = 'idle';
                        }
                    } else if (currentHour >= peakStart && currentHour < peakEnd) {
                        if (stateOfCharge > tenPercentCapacity && buyLowSellHighStrategy) {
                            newState = 'discharging';
                        } else if (stateOfCharge <= tenPercentCapacity) {
                            newState = 'idle';
                        }
                    } else {
                        newState = 'idle';
                    }

                    if (newState !== state) {
                        await axios.patch(`${DATA_SERVICE_URL}/batteries/${_id}`, { state: newState });
                        console.log(`Strategy updated battery ${_id} state to ${newState}.`);
                        // Update the battery state in our local array to reflect the change for the next step
                        battery.state = newState;
                    }
                }
            }
        }
        if (socProtectionStrategy) {
            for (const battery of batteries) {
                if (battery.tradingStrat === socProtectionStrategy._id) {
                    const { _id, state, traderId } = battery;
                    const userResponse = await axios.get(`${DATA_SERVICE_URL}/users/id/${traderId}`);
                    const user = userResponse.data.data;

                    let newState = state;
                    
                    if (newState == 'idle') {
                        newState = 'charging';
                    }

                    if (newState !== state) {
                        await axios.patch(`${DATA_SERVICE_URL}/batteries/${_id}`, { state: newState });
                        console.log(`SoC Protection updated battery ${_id} from user ${user.username} state to ${newState}.`);
                        // Update the battery state in our local array to reflect the change for the next step
                        battery.state = newState;
                    }
                }
            }
        }

        // Second, process actions based on the current state of all batteries
        for (const battery of batteries) {
            const { _id, state, stateOfCharge, capacity, traderId } = battery;

            if (state !== 'charging' && state !== 'discharging') {
                continue; // Skip batteries that are not in an active state
            }

            const tenPercentCapacity = Math.round(capacity * 0.10);
            const maxCapacity = Math.round(capacity * 0.90);

            try {
                const userResponse = await axios.get(`${DATA_SERVICE_URL}/users/id/${traderId}`);
                const user = userResponse.data.data;

                if (user.wallet.state === 'closed' || user.wallet.balance < currentPrice * 10) {
                    if (state !== 'blocked') {
                        await axios.patch(`${DATA_SERVICE_URL}/batteries/${_id}`, { state: 'blocked' });
                        console.log(`Battery ${_id} : User ${user.username} blocked due to insufficient funds or inactive wallet.`);
                    }
                    continue;
                }

                let newState = state;
                let newStateOfCharge = stateOfCharge;
                let cost = 0;
                let transactionType = '';

                if (state === 'charging') {
                    newStateOfCharge += 10;
                    cost = 10 * currentPrice;
                    transactionType = 'buy';
                    if (newStateOfCharge >= maxCapacity) {
                        newStateOfCharge = maxCapacity;
                        if(socProtectionStrategy) {
                            newState = 'discharging';
                        } else {
                            newState = 'idle';
                        }
                    }
                } else if (state === 'discharging') {
                    newStateOfCharge -= 10;
                    cost = -10 * currentPrice;
                    transactionType = 'sell';
                    if (newStateOfCharge <= tenPercentCapacity) {
                        newStateOfCharge = tenPercentCapacity;
                         if(socProtectionStrategy) {
                            newState = 'charging';
                        } else {
                            newState = 'idle';
                        }
                    }
                }

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
