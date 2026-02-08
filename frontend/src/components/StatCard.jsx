import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import '../styles/StatCard.css';

const StatCard = ({ icon, title, value, subtitle, color = '#6366f1' }) => {
    // Defensive checks to prevent crashes
    const displayValue = value !== undefined && value !== null ? value : '0';

    // Handle icon as either JSX element or component
    const renderIcon = () => {
        if (!icon) return null;
        // If icon is already a JSX element (React element), render it directly
        if (React.isValidElement(icon)) {
            return icon;
        }
        // If icon is a component, render it
        const IconComponent = icon;
        return <IconComponent />;
    };

    return (
        <div className="stat-card" style={{ '--card-color': color }}>
            <div className="stat-card-icon">
                {renderIcon()}
            </div>
            <div className="stat-card-content">
                <div className="stat-card-value">{displayValue}</div>
                <div className="stat-card-title">{title || 'N/A'}</div>
                {subtitle && <div className="stat-card-subtitle">{subtitle}</div>}
            </div>
        </div>
    );
};

export default StatCard;
