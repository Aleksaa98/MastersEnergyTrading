import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, resetStatus } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'reactstrap'; 

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setPasswordMismatch(true);
            return;
        }
        dispatch(register({ fullName, username, password, type: 'customer' }));
    };

    useEffect(() => {
        if (status === 'registered') {
            dispatch(resetStatus());
            navigate('/login');
        }
    }, [status, navigate,dispatch]);

    return (
        <div>
            <h2>Register</h2>
            {passwordMismatch === true && (
                <Alert color="danger">
                    Passwords didnt match
                </Alert>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Full Name:</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>
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
                        style={{
                            border: passwordMismatch ? '1px solid red' : '1px solid #ccc',
                        }}
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{
                            border: passwordMismatch ? '1px solid red' : '1px solid #ccc',
                        }}
                    />
                </div>
                <button type="submit" disabled={status === 'loading'}>
                    Register
                </button>
                {error && <p>{error.message}</p>}
            </form>
        </div>
    );
};

export default Register;
