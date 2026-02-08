import React from 'react';
import '../styles/CategoryBadge.css';

const CategoryBadge = ({ category }) => {
    const categoryConfig = {
        guard: { label: 'Garde', color: '#3b82f6' },
        pass: { label: 'Passage', color: '#10b981' },
        mount: { label: 'Mont', color: '#f59e0b' },
        back: { label: 'Dos', color: '#ef4444' },
        'side-control': { label: 'Contrôle Latéral', color: '#8b5cf6' },
        submission: { label: 'Soumission', color: '#ec4899' },
        transition: { label: 'Transition', color: '#06b6d4' },
        sweep: { label: 'Balayage', color: '#6366f1' },
        takedown: { label: 'Projection', color: '#f97316' },
        escape: { label: 'Échappement', color: '#14b8a6' }
    };

    const config = categoryConfig[category] || { label: category, color: '#6b7280' };

    return (
        <span
            className="category-badge"
            style={{ '--badge-color': config.color }}
        >
            {config.label}
        </span>
    );
};

export default CategoryBadge;
