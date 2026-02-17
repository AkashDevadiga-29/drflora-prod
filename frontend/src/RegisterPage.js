import './App.css';
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import Logo from './Images/DrFlora.png';
import axios from 'axios';

export function RegisterPage(){
    const apiUrl = process.env.REACT_APP_API_URL;
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [uname, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [reEnterPwd, setReEnterPwd] = useState("");

    const navigate = useNavigate();


    async function formSubmit(e){
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;

        if(password !== reEnterPwd){
            alert("Passwords do not match!");
            return;
        }
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        if (!phoneRegex.test(phone)) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }

        const registerData = {
            email: email,
            phone: phone,
            uname: uname,
            password: password
        };
        try {

            const response = await axios.post(`${apiUrl}register/`, registerData);

            if (response.status === 201) {
                alert("Registration Successful!");
                navigate("/login");
            }
        } catch (error) {
            console.error("Registration error:", error.response?.data || error.message);
            if (error.response && error.response.status === 400){
                const errorData = error.response.data;
                let errorMessage = "";
                for (const key in errorData) {
                    errorMessage += `${errorData[key]}\n`;
                }
                alert(errorMessage);
                } else {
                    alert("An unexpected error occurred. Please try again.");
                }
        }
    }

    return(
        <div className="Register-Container" style={{ backgroundColor: 'rgb(212, 252, 212)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    
    {/* 1. Navbar: Preserved structure and responsive */}
    <nav className="navbar px-4 shadow-sm" style={{ backgroundColor: 'rgb(0, 54, 0)' }}>
        <div className="container-fluid d-flex justify-content-between align-items-center p-0">
            <div className="d-flex align-items-center">
                <img src={Logo} alt="Dr. Flora Logo" id="Logo" />
            </div>
        </div>
    </nav>

    {/* 2. Main Page: Flexbox to center the card */}
    <div className="Browser-Page d-flex flex-grow-1 align-items-center justify-content-center p-3">
        
        {/* Register-Page Card: Matching LoginPage style */}
        <div className="Register-Page shadow rounded-3 p-4 p-md-5" 
             style={{ 
                 maxWidth: '450px' 
             }}>
            
            <h1 className="Header-1 text-center mb-4" style={{ color: 'white' }}>Register</h1>
            
            <form className="Register-Form" onSubmit={formSubmit}>
                
                <div className="input-group mb-3">
                    <span className="input-group-text text-white" style={{ backgroundColor: 'rgb(0, 54, 0)', border: '1px solid white', minWidth: '100px' }}>Email:</span>
                    <input onChange={(e) => setEmail(e.target.value)} type="text" className="form-control" id="regEmail" />
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text text-white" style={{ backgroundColor: 'rgb(0, 54, 0)', border: '1px solid white', minWidth: '100px' }}>Phone No:</span>
                    <input onChange={(e) => setPhone(e.target.value)} type="text" className="form-control" id="regPhone" />
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text text-white" style={{ backgroundColor: 'rgb(0, 54, 0)', border: '1px solid white', minWidth: '100px' }}>Username:</span>
                    <input onChange={(e) => setUsername(e.target.value)} type="text" className="form-control" id="regUname" />
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text text-white" style={{ backgroundColor: 'rgb(0, 54, 0)', border: '1px solid white', minWidth: '100px' }}>Password:</span>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" id="regPwd" />
                </div>

                <div className="input-group mb-3">
                    <span className="input-group-text text-white" style={{ backgroundColor: 'rgb(0, 54, 0)', border: '1px solid white', minWidth: '100px' }}>Re-enter:</span>
                    <input onChange={(e) => setReEnterPwd(e.target.value)} placeholder='Confirm password' type="password" className="form-control" id="reEnterPwd" />
                </div>

                {/* Submit Button */}
                <input 
                    type="submit" 
                    className="btn w-50 text-white mt-2" 
                    style={{ backgroundColor: 'rgb(0, 54, 0)', border: '1px solid white', borderRadius: '8px', padding: '10px' }} 
                    id="reg-lgn-btn" 
                    value="Register"
                />
            </form>

            {/* Login Link */}
            <div className="mt-4">
                <p className="Text-group1" style={{ fontSize: '0.9rem' }}>
                    Already have an Account? <Link className="Redirect" to="/login" style={{ color: 'rgb(255, 255, 255)', textDecoration: 'underline' }}>Login Here</Link>
                </p>
            </div>
        </div>
    </div>
</div>
    );
}