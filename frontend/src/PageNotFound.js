import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="container">
      <div className="row vh-100 align-items-center justify-content-center">
        <div className="col-md-6 text-center">
          {/* Large 404 Text */}
          <h1 className="display-1 fw-bold" style={{color:'rgb(0, 54, 0)'}}>404</h1>
          
          {/* Subheading */}
          <h2 className="mb-3">Oops! Page Not Found</h2>
          
          {/* Description */}
          <p className="lead text-muted mb-4">
            The page you are looking for doesn't exist or has been moved. 
            Don't worry, it happens to the best of us.
          </p>

          {/* Action Button */}
          <Link to="/" className="btn btn-lg px-5 shadow-sm" style={{ backgroundColor: 'rgb(0, 54, 0)', color: 'white' }}>
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};