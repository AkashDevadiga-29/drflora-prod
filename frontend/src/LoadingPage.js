import React from 'react';

export const LoadingPage = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      {/* Bootstrap Spinner */}
      <div className="spinner-border" role="status" style={{color: 'rgb(0, 54, 0)', width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      
      {/* Optional Text */}
      <h5 className="mt-3 text-secondary fw-light">
        Loading, please wait...
      </h5>
    </div>
  );
};