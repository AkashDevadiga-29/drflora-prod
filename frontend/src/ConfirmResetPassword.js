import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './endpoints/api';
import Logo from './Images/DrFlora.png';

export function ConfirmResetPassword() {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            await api.patch('password-reset-complete/', {
                password: password,
                token: token,
                uidb64: uid
            });
            alert("Password reset successful! Please login.");
            navigate('/login');
        } catch (error) {
            setMessage("Invalid link or link expired.");
        }
    };

    return (
        <div className="ForgotPwd-Container" style={{ backgroundColor: 'rgb(212, 252, 212)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav className="navbar px-4 shadow-sm" style={{ backgroundColor: 'rgb(0, 54, 0)' }}>
                <img src={Logo} alt="Logo" style={{ height: '40px' }} />
            </nav>

            <div className="d-flex flex-grow-1 align-items-center justify-content-center p-3">
                <div className="shadow rounded-3 p-4 p-md-5" style={{ maxWidth: '400px', backgroundColor: 'rgb(0, 54, 0)' }}>
                    <h2 className="text-white text-center mb-4">Set New Password</h2>
                    
                    {message && <div className="alert alert-danger p-2" style={{fontSize: '0.8rem'}}>{message}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input 
                                type="password" 
                                className="form-control" 
                                placeholder="New Password" 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <input 
                                type="password" 
                                className="form-control" 
                                placeholder="Confirm New Password" 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit" className="btn btn-light w-100 fw-bold">Update Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
}