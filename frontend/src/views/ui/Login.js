import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, Card, CardBody, FormGroup, Label, Input, Button } from 'reactstrap';
import logo from '../../assets/images/logos/websitelogo.svg';
import ParticleBackground from '../../components/dashboard/ParticleBackground'; 

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ username, password }));
    };

    useEffect(() => {
        if (status === 'succeeded') {
            navigate('/starter');
        }
    }, [status, navigate]);

    return (
        <div className="auth-wrapper">
            <Card className="auth-card">
                {/* <ParticleBackground />  */}
                <CardBody>
                    <div className="auth-logo">
                        <img src={logo} alt="Logo" />
                    </div>
                    <h2>Welcome Back</h2>

                    {status === 'failed' && (
                        <Alert color="danger" className="text-center">
                            Incorrect username or password.
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <Input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Enter your username"
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
                                placeholder="Enter your password"
                            />
                        </FormGroup>
                        <Button type="submit" color="primary" block disabled={status === 'loading'}>
                            {status === 'loading' ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                    <div className="text-center mt-3">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register" className="auth-link">
                                Register here
                            </Link>
                        </p>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default Login;
