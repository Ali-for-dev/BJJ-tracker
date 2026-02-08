import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
    const sizeClass = `spinner-${size}`;

    if (fullScreen) {
        return (
            <div className="spinner-fullscreen">
                <div className={`spinner ${sizeClass}`}>
                    <div className="spinner-circle"></div>
                    <div className="spinner-circle"></div>
                    <div className="spinner-circle"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`spinner ${sizeClass}`}>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
        </div>
    );
};

export default LoadingSpinner;
