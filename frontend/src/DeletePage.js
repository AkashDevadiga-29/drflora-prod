import './App.css';
import { Link, useNavigate } from "react-router-dom";
import Logo from './Images/DrFlora.png';
import { useState } from 'react';
import api from './endpoints/api';

export function DeleteAccount() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function formSubmit(e) {
        e.preventDefault();
        setError(""); 

        const confirmPermanent = window.confirm("Are you sure? This will permanently erase your Dr. Flora account data.");

        if (confirmPermanent) {
            try {
                const response = await api.delete('delete-account/', {
                    withCredentials: true,
                    data: {
                        password: password 
                    }
                });

                if (response.data.success || response.status === 200 || response.status === 204) {
                    alert("Account deleted successfully.");
                    navigate("/register"); 
                }
            } catch (err) {

                if (err.response && err.response.data) {                    
                    const serverError = err.response.data.password || err.response.data.non_field_errors || "Failed to delete account.";
                    setError(Array.isArray(serverError) ? serverError[0] : serverError);
                } else {
                    setError("An unexpected error occurred. Is the server running?");
                }
                console.error("Delete Error:", err.response);
            }
        }
    }

    return (
        <div className="Login-Container" style={{ backgroundColor: 'rgb(212, 252, 212)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav className="navbar px-4 shadow-sm" style={{ backgroundColor: 'rgb(0, 54, 0)' }}>
                <div className="container-fluid d-flex justify-content-between align-items-center p-0">
                    <div className="d-flex align-items-center">
                        <Link to="/"><img src={Logo} alt="Dr. Flora Logo" id="Logo" /></Link>
                    </div>
                </div>
            </nav>

            <div className="Browser-Page d-flex flex-grow-1 align-items-center justify-content-center p-3">
                <div className="Login-Page shadow rounded-3 p-4 p-md-5 text-center" 
                     style={{ maxWidth: '400px', backgroundColor: 'rgb(0, 54, 0)' }}>
                    
                    <h1 className="Header-1 text-center mb-4" style={{ color: 'white' }}>Delete Account</h1>
                    
                    <p className="text-white-50 mb-4" style={{ fontSize: '0.85rem' }}>
                        For your security, please confirm your password to permanently delete your account.
                    </p>

                    {/* This now displays the 400 error message (e.g., "Incorrect password") */}
                    {error && <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '0.85rem' }}>{error}</div>}

                    <form className="Login-Form" onSubmit={formSubmit}>
                        <div className="input-group mb-4">
                            <span className="input-group-text text-white" 
                                  style={{ backgroundColor: 'rgb(0, 54, 0)', border: '1px solid white' }}>
                                Password:
                            </span>
                            <input 
                                type="password" 
                                className="form-control" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required
                            />
                        </div>

                        <input 
                            type="submit" 
                            className="btn w-100 text-white mt-2" 
                            style={{ backgroundColor: '#dc3545', border: '1px solid white', borderRadius: '8px', padding: '10px', fontWeight: 'bold' }} 
                            value="Permanently Delete Account"
                        />
                    </form>

                    <div className="mt-4">
                        <Link className="Redirect" to="/" style={{ color: 'rgb(255, 255, 255)', fontSize: '0.9rem' }}>
                            Cancel and go back
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}