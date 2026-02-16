import React, { useState } from 'react';
import api from './endpoints/api';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './Images/DrFlora.png';
import { logout } from './endpoints/api'

export function ChangePassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [message, setMessage] = useState({ text: '', isError: false });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.new_password !== formData.confirm_password) {
            setMessage({ text: "New passwords do not match!", isError: true });
            return;
        }

        try {
            const changepwdresponse = await api.put('change-password/', {
                withCredentials: true
            });

            if(changepwdresponse.status === 200){
                setMessage({ text: "Password updated successfully!", isError: false });
                alert(changepwdresponse.data.message);
                await logout();
                setTimeout(() => {
                    navigate('/login');
                }, 500);
            }

        } catch (err) {
            setMessage({ 
                text: err.response?.data?.old_password || "Error updating password.", 
                isError: true 
            });
        }
    };

    return (
        <div className="ChangePwd-Container" style={{ backgroundColor: 'rgb(212, 252, 212)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav className="navbar px-4 shadow-sm" style={{ backgroundColor: 'rgb(0, 54, 0)' }}>
                <Link to="/"><img src={Logo} alt="Logo" style={{ height: '40px' }} /></Link>
            </nav>

            <div className="d-flex flex-grow-1 align-items-center justify-content-center p-3">
                <div className="shadow rounded-3 p-4 p-md-5" style={{ maxWidth: '450px', width: '100%', backgroundColor: 'rgb(0, 54, 0)' }}>
                    <h2 className="text-center mb-4 text-white">Change Password</h2>

                    {message.text && (
                        <div className={`alert ${message.isError ? 'alert-danger' : 'alert-success'} py-2`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="text-white mb-1">Current Password</label>
                            <input type="password" name="old_password" className="form-control" onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="text-white mb-1">New Password</label>
                            <input type="password" name="new_password" className="form-control" onChange={handleChange} required />
                        </div>
                        <div className="mb-4">
                            <label className="text-white mb-1">Confirm New Password</label>
                            <input type="password" name="confirm_password" className="form-control" onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn btn-light w-100 fw-bold">Update Password</button>
                    </form>
                </div>
            </div>
        </div>
    );
}