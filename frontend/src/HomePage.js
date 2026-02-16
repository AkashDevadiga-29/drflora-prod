import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getuserdata, logout } from './endpoints/api';
import logo from './Images/DrFlora.png';
import menuIcon from './Icons/menu.svg'; 

export function HomePage() {
    const [user, setUser] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getuserdata();
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };
        fetchUser();
    }, []);

    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            alert("Logged out successfully!");
            navigate('/login');
        }
    };

    const uname = Array.isArray(user) ? user[0]?.username : user?.username;

    return (
        <div className="vh-100 d-flex flex-column" style={{ backgroundColor: '#f4faf4' }}>
            
            {/* 1. BRANDED NAVBAR */}
            <nav className="navbar px-3 shadow-sm" style={{ backgroundColor: 'rgb(0, 54, 0)', height: '70px', zIndex: 1050 }}>
                <div className="container-fluid d-flex justify-content-between align-items-center p-0">
                    <div className="d-flex align-items-center">
                        <img src={logo} alt="Dr. Flora Logo" id="Logo" style={{ height: '45px', width: 'auto' }}/>
                    </div>
                    <button className="btn d-flex align-items-center border-0 shadow-none" onClick={toggleDrawer}>
                        <img src={menuIcon} alt="Menu Icon" style={{ height: "28px", width: "28px" }} />
                    </button>
                </div>
            </nav>

            {/* 2. NAVIGATION DRAWER */}
            <div className={`offcanvas offcanvas-end ${isDrawerOpen ? 'show' : ''}`} 
                 style={{ visibility: isDrawerOpen ? 'visible' : 'hidden', transition: '0.3s ease-in-out' }}>
                <div className="offcanvas-header border-bottom" style={{ backgroundColor: 'rgb(0, 54, 0)', color: 'white' ,fontFamily:"fredoka, sans-serif"}}>
                    <h5 className="offcanvas-title">Navigation</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={toggleDrawer}></button>
                </div>
                <div className="offcanvas-body p-0">
                    <div className="list-group list-group-flush">
                        <Link to="/" className="list-group-item list-group-item-action py-3 px-4 border-0" style={{ color: 'rgb(0, 54, 0)' , fontFamily:"fredoka, sans-serif"}} onClick={toggleDrawer}>
                            <h5>Home</h5>
                        </Link>
                        <Link to="/chatbot" className="list-group-item list-group-item-action py-3 px-4 border-0" style={{ color: 'rgb(0, 54, 0)', fontFamily:"fredoka, sans-serif" }} onClick={toggleDrawer}>
                            <h5>Chatbot</h5>
                        </Link>
                        <Link to="/change-password" className="list-group-item list-group-item-action py-3 px-4 border-0" style={{ color: 'rgb(0, 54, 0)', fontFamily:"fredoka, sans-serif" }} onClick={toggleDrawer}>
                            <h5>Change Password</h5>
                        </Link>
                        <button onClick={handleLogout} className="list-group-item list-group-item-action py-3 px-4 border-0" style={{ backgroundColor: '#ff4d4d', color: 'white' ,fontFamily:"fredoka, sans-serif"}}>
                            <h5>Logout</h5>
                        </button>
                        <Link to="/delete-account" className="list-group-item list-group-item-action py-3 px-4 border-0" style={{ backgroundColor: '#331010', color: 'white', fontFamily:"fredoka, sans-serif" }} onClick={toggleDrawer}>
                            <h5>Delete Account</h5>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 3. MAIN CONTENT */}
            <main className="flex-grow-1 overflow-auto pb-5">
                {/* Hero Section */}
                <div className="py-5 text-center px-3" style={{ backgroundColor: 'rgb(212, 252, 212)' }}>
                    <h1 className="fw-bold" style={{ color: 'rgb(0, 54, 0)', fontFamily: "fredoka, sans-serif" }}>
                        Welcome back, {uname}!
                    </h1>
                    <p className="lead mx-auto mb-4" style={{ maxWidth: '700px', color: '#1a3310' }}>
                        Your personal AI botanical expert is ready to help you nurture your green space. 
                    </p>
                    <Link to="/chatbot" className="btn btn-lg px-5 py-3 shadow-sm" 
                          style={{ backgroundColor: 'rgb(0, 54, 0)', color: 'white', borderRadius: '30px', fontWeight: 'bold' }}>
                        Ask Dr. Flora
                    </Link>
                </div>

                {/* Benefits Section */}
                <div className="container mt-5">
                    <div className="row g-4 mb-5">
                        <div className="col-md-6 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm p-3 text-center" style={{ borderRadius: '20px' }}>
                                <div className="display-4 text-success mb-2">⚡</div>
                                <h6 className="fw-bold">Instant Diagnosis</h6>
                                <p className="small text-muted mb-0">Identify pests and diseases in seconds.</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm p-3 text-center" style={{ borderRadius: '20px' }}>
                                <div className="display-4 text-success mb-2">📅</div>
                                <h6 className="fw-bold">Tailored Advice</h6>
                                <p className="small text-muted mb-0">Care tips specific to your plant species.</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm p-3 text-center" style={{ borderRadius: '20px' }}>
                                <div className="display-4 text-success mb-2">🌍</div>
                                <h6 className="fw-bold">Eco-Friendly</h6>
                                <p className="small text-muted mb-0">Natural pest control and organic methods.</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm p-3 text-center" style={{ borderRadius: '20px' }}>
                                <div className="display-4 text-success mb-2">🛡️</div>
                                <h6 className="fw-bold">Expert Shield</h6>
                                <p className="small text-muted mb-0">Prevent diseases before they spread.</p>
                            </div>
                        </div>
                    </div>

                    <hr className="my-5" />

                    {/* Plant List / Diagnostic Capability Section */}
                    <div className="text-center mb-4">
                        <h2 style={{ color: 'rgb(0, 54, 0)', fontFamily: "fredoka, sans-serif" }}>Diagnostic Library</h2>
                        <p className="text-muted">Dr. Flora is currently specialized in identifying conditions for these crops:</p>
                    </div>

                    <div className="row g-3">
                        {/* Tomato Card */}
                        <div className="col-6 col-md-4 col-lg-2">
                            <div className="card h-100 border-0 shadow-sm text-center py-3" style={{ borderRadius: '15px', backgroundColor: '#fff5f5' }}>
                                <div style={{ fontSize: '2rem' }}>🍅</div>
                                <h6 className="fw-bold mb-1">Tomato</h6>
                                <div className="px-2"><span className="badge rounded-pill bg-danger w-100" style={{ fontSize: '0.7rem' }}>10 Conditions</span></div>
                            </div>
                        </div>
                        {/* Potato Card */}
                        <div className="col-6 col-md-4 col-lg-2">
                            <div className="card h-100 border-0 shadow-sm text-center py-3" style={{ borderRadius: '15px', backgroundColor: '#fdf8f4' }}>
                                <div style={{ fontSize: '2rem' }}>🥔</div>
                                <h6 className="fw-bold mb-1">Potato</h6>
                                <div className="px-2"><span className="badge rounded-pill bg-warning text-dark w-100" style={{ fontSize: '0.7rem' }}>3 Conditions</span></div>
                            </div>
                        </div>
                        {/* Maize Card */}
                        <div className="col-6 col-md-4 col-lg-2">
                            <div className="card h-100 border-0 shadow-sm text-center py-3" style={{ borderRadius: '15px', backgroundColor: '#fffdf0' }}>
                                <div style={{ fontSize: '2rem' }}>🌽</div>
                                <h6 className="fw-bold mb-1">Maize</h6>
                                <div className="px-2"><span className="badge rounded-pill bg-warning text-dark w-100" style={{ fontSize: '0.7rem' }}>4 Conditions</span></div>
                            </div>
                        </div>
                        {/* Rice Card */}
                        <div className="col-6 col-md-4 col-lg-2">
                            <div className="card h-100 border-0 shadow-sm text-center py-3" style={{ borderRadius: '15px', backgroundColor: '#f0f9ff' }}>
                                <div style={{ fontSize: '2rem' }}>🌾</div>
                                <h6 className="fw-bold mb-1">Rice</h6>
                                <div className="px-2"><span className="badge rounded-pill bg-info text-dark w-100" style={{ fontSize: '0.7rem' }}>Healthy Support</span></div>
                            </div>
                        </div>
                        {/* Grape Card */}
                        <div className="col-6 col-md-4 col-lg-2">
                            <div className="card h-100 border-0 shadow-sm text-center py-3" style={{ borderRadius: '15px', backgroundColor: '#f8f0ff' }}>
                                <div style={{ fontSize: '2rem' }}>🍇</div>
                                <h6 className="fw-bold mb-1">Grape</h6>
                                <div className="px-2"><span className="badge rounded-pill bg-primary w-100" style={{ fontSize: '0.7rem' }}>4 Conditions</span></div>
                            </div>
                        </div>
                        {/* Apple Card */}
                        <div className="col-6 col-md-4 col-lg-2">
                            <div className="card h-100 border-0 shadow-sm text-center py-3" style={{ borderRadius: '15px', backgroundColor: '#fff0f0' }}>
                                <div style={{ fontSize: '2rem' }}>🍎</div>
                                <h6 className="fw-bold mb-1">Apple</h6>
                                <div className="px-2"><span className="badge rounded-pill bg-danger w-100" style={{ fontSize: '0.7rem' }}>4 Conditions</span></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                        <small className="text-muted">Plus support for Blueberry, Cherry, Peach, Pepper, Raspberry, Soybean, Squash, and Strawberry.</small>
                    </div>
                </div>
            </main>

            {/* 4. BACKDROP */}
            {isDrawerOpen && <div className="offcanvas-backdrop fade show" style={{ zIndex: 1040 }} onClick={toggleDrawer}></div>}
        </div>
    );
}