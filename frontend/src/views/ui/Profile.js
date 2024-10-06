import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../../store/authSlice';
import { getUserTransactions } from '../../store/userTransactionSlice';
import Cookies from 'js-cookie';
import "../../assets/scss/customStyle.css";
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  CardTitle,
  CardBody,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Table
} from 'reactstrap';

const ProfilePage = () => {
    const token = Cookies.get('token');
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const user = useSelector((state) => state.auth.user);
    const userTransactions= useSelector((state) => state.transactions.userTransactions);
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        wallet: {
            balance: 0,
            state: 'closed'
        }
    });

    useEffect(() => {
        if (user) {
        setFormData({
            username: user.username,
            fullName: user.fullName,
            wallet: {
                balance: user.wallet.balance,
                state: user.wallet.state
            }
        });
        }
        let userId = user ? user._id : '';
        dispatch(getUserTransactions({ userId, token }));
    }, [user,dispatch,token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log('value: ' + value)
        console.log('name: ' + name)

        setFormData((prevState) => ({
            ...prevState,
            [name]: value, 
        }));
        
        
        console.log(formData)
    };

    const handleDropdownChange = (e) => {
        const { value } = e.target;
    
        setFormData((prevState) => ({
            ...prevState,
            wallet: {
                ...prevState.wallet,
                state: value,
            },
        }));
    };

    const handleBuyNowClick = () => {
        navigate('/payment'); 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProfile({ username: formData.username, userData: formData, token: token }));
    };

    if (!user) {
        return <div>Loading...</div>; 
      }
    return (

        <Row>
          <Col md="8">
              <Card>
              <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                  <i className="bi bi-person me-2"></i>
                  Profile
              </CardTitle>
              <CardBody>
                  <Form className='customForm' onSubmit={handleSubmit}>
                  <FormGroup>
                      <Label for="username">Username</Label>
                      <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      />
                  </FormGroup>
                  <FormGroup>
                      <Label for="fullName">Full Name</Label>
                      <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      />
                  </FormGroup>
                  <FormGroup>
                        <Label for="state">Wallet State</Label>
                        <Input
                            disabled={user.wallet.state === 'suspended'}
                            id="state"
                            name="state"
                            type="select"
                            value={formData.wallet.state}
                            onChange={handleDropdownChange}
                        >
                            <option value="closed">Closed</option>
                            <option value="active">Active</option>
                            {user.wallet.state === 'suspended' && (
                            <option value="suspended">Suspended</option>
                            )}
                        </Input>
                    </FormGroup>
                  <FormGroup>
                      <Label for="userType">User Type</Label>
                      <Input
                      id="userType"
                      name="userType"
                      type="text"
                      value={user.type === 'customer' ? 'Customer' : 'Admin'}
                      readOnly
                      />
                  </FormGroup>
                  <Button  type="submit" color="primary">Save Changes</Button>
                  </Form>
              </CardBody>
              </Card>
          </Col>

          <Col className='' md="4">
                  <div className="customCard" >
                      <div className="content">
                          <div className="title" >Wallet ballance</div>
                          <div className="price" >{user.wallet.balance}€</div>
                          <div className="description" >
                              These funds are used for your online transactions.
                          </div>
                      </div>
                      <Button className='customButton' color="success" disabled={user.wallet.state !== 'active'} onClick={handleBuyNowClick}>Buy now</Button>
                      {user.wallet.state !== 'active' && (
                        <div className="error-message">
                              Wallet is not active
                        </div>
                      )}
                  </div>
          </Col>
          <Col>
            <Card>
                <CardTitle tag="h6" className="border-bottom p-3 mb-0"><i className="bi bi-card-text me-2"> </i>
                    Transaction History
                </CardTitle>
                <CardBody>
                {
                    <Table bordered>
                    <thead>
                    <tr>
                    <th>Date</th>
                    <th>Strategy Name</th>
                    <th>Type</th>
                    <th>Amount (€)</th>
                    </tr>
                    </thead>
                    <tbody>
                        {userTransactions.length > 0 ? (
                        userTransactions
                        .slice(0, 10)
                        .map((transaction) => (
                            <tr key={transaction._id}>
                            <td>{new Date(transaction.timestamp).toLocaleDateString()}</td>
                            <td>{transaction.stratName}</td>
                            <td>{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</td>
                            <td>{transaction.amount}</td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan="4" className="text-center">
                            No transactions found
                            </td>
                        </tr>
                        )}
                    </tbody>
                    </Table>
                }
                </CardBody>
            </Card>
          </Col>
        </Row>
    );
};

export default ProfilePage;
