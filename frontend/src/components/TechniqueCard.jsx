import React from 'react';
import { Edit, Trash2, Target, TrendingUp } from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import '../styles/TechniqueCard.css';

const TechniqueCard = ({ technique, onEdit, onDelete }) => {
    const getMasteryLabel = (level) => {
        const labels = {
            1: 'Débutant',
            2: 'Intermédiaire',
            3: 'Compétent',
            4: 'Avancé',
            5: 'Expert'
        };
        return labels[level] || 'Débutant';
    };

    const getMasteryColor = (level) => {
        const colors = {
            1: '#ef4444',
            2: '#f59e0b',
            3: '#eab308',
            4: '#10b981',
            5: '#6366f1'
        };
        return colors[level] || '#6b7280';
    };

    return (
        <div className="technique-card">
            <div className="technique-header">
                <div className="technique-title-section">
                    <h3>{technique.name}</h3>
                    <CategoryBadge category={technique.category} />
                </div>
                <div className="technique-actions">
                    <button
                        className="icon-btn"
                        onClick={() => onEdit(technique)}
                        title="Éditer"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        className="icon-btn danger"
                        onClick={() => onDelete(technique)}
                        title="Supprimer"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {technique.subcategory && (
                <p className="subcategory">{technique.subcategory}</p>
            )}

            <div className="technique-mastery">
                <div className="mastery-header">
                    <span className="mastery-label">
                        <Target size={16} />
                        Maîtrise
                    </span>
                    <span
                        className="mastery-level"
                        style={{ color: getMasteryColor(technique.masteryLevel) }}
                    >
                        {getMasteryLabel(technique.masteryLevel)}
                    </span>
                </div>
                <div className="mastery-bar">
                    {[1, 2, 3, 4, 5].map((level) => (
                        <div
                            key={level}
                            className={`mastery-dot ${level <= technique.masteryLevel ? 'active' : ''}`}
                            style={{
                                '--mastery-color': getMasteryColor(technique.masteryLevel)
                            }}
                        />
                    ))}
                </div>
            </div>

            {(technique.successCount > 0 || technique.attemptCount > 0) && (
                <div className="technique-stats">
                    <div className="stat-item">
                        <TrendingUp size={16} />
                        <span>Taux de réussite</span>
                        <strong>{technique.successRate || 0}%</strong>
                    </div>
                    <div className="stat-detail">
                        {technique.successCount}/{technique.attemptCount} réussies
                    </div>
                </div>
            )}

            {technique.notes && (
                <p className="technique-notes">{technique.notes}</p>
            )}

            {technique.tags && technique.tags.length > 0 && (
                <div className="technique-tags">
                    {technique.tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TechniqueCard;
