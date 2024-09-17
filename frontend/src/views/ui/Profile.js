import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../../store/authSlice';
import Cookies from 'js-cookie';
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
} from 'reactstrap';

const ProfilePage = () => {
    const token = Cookies.get('token');
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        walletBalance: 0,
        walletState: 'closed',
    });

    useEffect(() => {
        if (user) {
        setFormData({
            username: user.username,
            fullName: user.fullName,
            walletBalance: user.wallet.balance,
            walletState: user.wallet.state,
        });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
        ...prevState,
        [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProfile({ username: formData.username, userData: formData, token: token }));
    };
    if (!user) {
        return <div>Loading...</div>; // You can replace this with any loading indicator you prefer
      }
    return (

        <Row>
        <Col>
            <Card>
            <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                <i className="bi bi-person me-2"></i>
                Profile
            </CardTitle>
            <CardBody>
                <Form onSubmit={handleSubmit}>
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
                    <Label for="walletBalance">Wallet Balance</Label>
                    <Input
                    id="walletBalance"
                    name="walletBalance"
                    type="number"
                    value={formData.walletBalance}
                    onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="walletState">Wallet State</Label>
                    <Input
                    id="walletState"
                    name="walletState"
                    type="select"
                    value={formData.walletState}
                    onChange={handleChange}
                    >
                    <option value="closed">Closed</option>
                    <option value="open">Open</option>
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
                <Button type="submit" color="primary">Save Changes</Button>
                </Form>
            </CardBody>
            </Card>
        </Col>
        </Row>
    );
};

export default ProfilePage;
