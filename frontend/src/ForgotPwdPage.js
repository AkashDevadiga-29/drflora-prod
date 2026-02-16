import './App.css';
import Logo from './Images/DrFlora.png';
import { Link } from "react-router-dom";
import { useState } from 'react';
import api from './endpoints/api';

export function ForgotPwdPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await api.post('request-reset-email/', {
                email: email
            });
            if (response.status === 200){
                alert("Your Reset Link: " + response.data.resetLink);
            }
            setMessage("Check your email (or terminal console) for the link! Or access it directly from the alert.");
        } catch (err) {
            setMessage("Error: Account not found or server issue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ForgotPwd-Container" style={{ backgroundColor: 'rgb(212, 252, 212)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav className="navbar px-4 shadow-sm" style={{ backgroundColor: 'rgb(0, 54, 0)', height: 'auto' }}>
                <div className="container-fluid d-flex justify-content-between align-items-center p-0">
                    <div className="d-flex align-items-center">
                        <img src={Logo} alt="Dr. Flora Logo" id="Logo" />
                    </div>
                </div>
            </nav>

            <div className="Browser-Page d-flex flex-grow-1 align-items-center justify-content-center p-3">
                <div className="ForgotPwd-Page shadow rounded-3 p-4 p-md-5" style={{ maxWidth: '400px', backgroundColor: 'rgb(0, 54, 0)' }}>
                    <h1 className="Header-1 text-center mb-4" style={{ color: 'white' }}>Forgot Password</h1>
                    
                    {/* Status Message */}
                    {message && <div className="alert alert-info py-2" style={{ fontSize: '0.8rem' }}>{message}</div>}

                    <form className="Register-Form" onSubmit={handleSubmit}>
                        <div className="input-group mb-3">
                            <span className="input-group-text text-white" style={{ backgroundColor: 'rgb(0, 54, 0)', border: '1px solid white', minWidth: '80px' }}>Email:</span>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <p className="Text-group1 text-white mb-4" style={{ fontSize: '0.85rem' }}>
                            This will send an email to reset your password.
                        </p>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="btn w-50 text-white fw-bold mb-3" 
                            style={{ backgroundColor: 'rgb(0, 54, 0)', border: '1px solid white', borderRadius: '8px', padding: '10px' }}
                        >
                            {loading ? 'Sending...' : 'Submit'}
                        </button>
                    </form>

                    <div className="mt-2">
                        <p className="Text-group1 text-white" style={{ fontSize: '0.9rem' }}>
                            Want to go back? <Link className="Redirect" to="/login" style={{ color: 'rgb(255, 255, 255)', textDecoration: 'underline' }}>Login Here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}