import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, resetStatus } from '../../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, Card, CardBody, FormGroup, Label, Input, Button } from 'reactstrap';
import logo from '../../assets/images/logos/websitelogo.svg';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setPasswordMismatch(true);
            return;
        }
        setPasswordMismatch(false);
        dispatch(register({ fullName, username, password, type: 'customer' }));
    };

    useEffect(() => {
        if (status === 'registered') {
            dispatch(resetStatus());
            navigate('/login');
        }
    }, [status, navigate, dispatch]);

    return (
        <div className="auth-wrapper">
            <Card className="auth-card">
                <CardBody>
                    <div className="auth-logo">
                        <img src={logo} alt="Logo" />
                    </div>
                    <h2>Create an Account</h2>

                    {passwordMismatch && (
                        <Alert color="danger" className="text-center">
                            Passwords do not match.
                        </Alert>
                    )}
                    {status === 'failed' && (
                        <Alert color="danger" className="text-center">
                            {error || 'Registration failed. Please try again.'}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="fullName">Full Name</Label>
                            <Input
                                type="text"
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                placeholder="Enter your full name"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <Input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Choose a username"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Create a password"
                                invalid={passwordMismatch}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="confirmPassword">Confirm Password</Label>
                            <Input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirm your password"
                                invalid={passwordMismatch}
                            />
                        </FormGroup>
                        <Button type="submit" color="primary" block disabled={status === 'loading'}>
                            {status === 'loading' ? 'Registering...' : 'Register'}
                        </Button>
                    </form>
                    <div className="text-center mt-3">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="auth-link">
                                Login here
                            </Link>
                        </p>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default Register;
