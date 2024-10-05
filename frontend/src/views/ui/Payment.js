import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Card, CardBody, CardTitle } from 'reactstrap';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/authSlice'; 
import { createTransaction } from '../../store/userTransactionSlice'; 
import Cookies from 'js-cookie';

const PaymentPage = () => {
    const token = Cookies.get('token');
    const [amount, setAmount] = useState(0);
    const [captchaValue, setCaptchaValue] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user  = useSelector((state) => state.auth.user); 

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!captchaValue) {
            alert("Please complete the CAPTCHA verification.");
            return;
        }

        let money = user.wallet.balance + parseFloat(amount);
        const updatedUserData = {
            wallet: {  
                balance: money,
                state: 'active'
            }
        };

        try {
            dispatch(updateProfile({ username: user.username, userData: updatedUserData, token: token }));
            console.log(`Updated wallet with amount: ${amount}`);

            const transactionData = {
                userId: user._id,  
                type: 'buy', 
                amount: parseFloat(amount),
                timestamp: new Date().toISOString(),
                stratName: 'User Transaction',
            };

            dispatch(createTransaction({transactionData:transactionData, token:token}));
            console.log('Transaction created successfully');


            navigate('/profile');
        } catch (error) {
            console.error("Error processing payment:", error);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Card style={{ width: '27.5%' }}>
                <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                    <i className="bi bi-credit-card me-2"></i>
                    Payment
                </CardTitle>
                <CardBody>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="amount">Amount (€)</Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="number"
                                value={amount}
                                onChange={handleAmountChange}
                                required
                            />
                        </FormGroup>
                        <div className="captcha-container">
                        <ReCAPTCHA
                            sitekey="6LcURUcqAAAAAJlouD2twXw6QswUWaKFil3n_9rz"
                            onChange={handleCaptchaChange}
                        />
                        </div>
                        
                        <br />

                        <Button disabled={!captchaValue} type="submit" color="primary">Pay Now</Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
};

export default PaymentPage;
