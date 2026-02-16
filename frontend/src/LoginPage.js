import './App.css';
import { Link} from "react-router-dom";
import Logo from './Images/DrFlora.png';
import { useState } from 'react';
import useAuth from './context/useAuth';

export function LoginPage(){
    const [uname, setUname] = useState("");
    const [password, setPassword] = useState("");
    const {login_user} = useAuth();
    function formSubmit(e){
        e.preventDefault();
        login_user(uname,password);
    }

    return(<div className="Login-Container" style={{ backgroundColor: 'rgb(212, 252, 212)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    
    {/* 1. Navbar: Preserved structure with responsive spacing */}
    <nav className="navbar px-4 shadow-sm" style={{ backgroundColor: 'rgb(0, 54, 0)'}}>
        <div className="container-fluid d-flex justify-content-between align-items-center p-0">
            <div className="d-flex align-items-center">
                <img src={Logo} alt="Dr. Flora Logo" id="Logo" />
            </div>
        </div>
    </nav>

    {/* 2. Main Page: Flexbox added to center the card on mobile/desktop */}
    <div className="Browser-Page d-flex flex-grow-1 align-items-center justify-content-center p-3">
        
        {/* Login-Page: Added width constraints for mobile responsiveness */}
        <div className="Login-Page shadow rounded-3 p-4 p-md-5" 
             style={{
                 maxWidth: '400px' // Ensures it looks like your screenshot on desktop
             }}>
            
            <h1 className="Header-1 text-center mb-4" style={{ color: 'white'}}>Login</h1>
            
            <form className="Login-Form" onSubmit={formSubmit}>
                {/* Username Group */}
                <div className="input-group mb-3">
                    <span className="input-group-text text-white" style={{ backgroundColor: 'rgb(0, 54, 0)', border: '1px solid white' }}>Username:</span>
                    <input 
                        type="text" 
                        className="form-control" 
                        onChange={(e) => setUname(e.target.value)} 
                        id="username"
                    />
                </div>

                {/* Password Group */}
                <div className="input-group mb-3">
                    <span className="input-group-text text-white" style={{ backgroundColor: 'rgb(0, 54, 0)', border: '1px solid white' }}>Password:</span>
                    <input 
                        type="password" 
                        className="form-control" 
                        onChange={(e) => setPassword(e.target.value)} 
                        id="password"
                    />
                </div>

                {/* Login Button: Matches your screenshot style */}
                <input 
                    type="submit" 
                    className="btn w-50 text-white mt-2" 
                    style={{ backgroundColor: 'rgb(0, 54, 0)', border: '1px solid white', borderRadius: '8px', padding: '10px' }} 
                    id="reg-lgn-btn" 
                    value="Login"
                />
            </form>

            {/* Links: Preserved structure */}
            <div className="mt-4">
                <p className="Text-group1 mb-1" style={{ fontSize: '0.9rem' }}>
                    Forgot Password? <Link className="Redirect" to="/forgot-password" style={{ color: 'rgb(255, 255, 255)', textDecoration: 'underline' }}>Click Here</Link>
                </p>
                <p className="Text-group1" style={{ fontSize: '0.9rem' }}>
                    Don't have an Account? <Link className="Redirect" to="/register" style={{ color: 'rgb(255, 255, 255)', textDecoration: 'underline' }}>Register Here</Link>
                </p>
            </div>
        </div>
    </div>
</div>
    );
}