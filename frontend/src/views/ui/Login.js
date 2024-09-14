import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'reactstrap'; 

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
        <div>
            <h2>Login</h2>

            {status === 'failed' && (
                <Alert color="danger">
                    Incorrect username or password. Please try again.
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                <button type="submit" disabled={status === 'loading'}>
                    Login
                </button>
                {error && <p>{error.message}</p>}
            </form>
            
        </div>
    );
};

export default Login;
