import React from 'react';
import { Calendar, Trophy, Edit, Trash2, MapPin, Users } from 'lucide-react';
import '../styles/CompetitionCard.css';

const CompetitionCard = ({ competition, onEdit, onDelete }) => {
    const isUpcoming = new Date(competition.date) > new Date();

    const getResultBadge = (result) => {
        const badges = {
            gold: { label: 'Or', color: '#fbbf24', icon: '🥇' },
            silver: { label: 'Argent', color: '#d1d5db', icon: '🥈' },
            bronze: { label: 'Bronze', color: '#cd7f32', icon: '🥉' },
            participation: { label: 'Participation', color: '#6b7280', icon: '🎖️' },
            pending: { label: 'À venir', color: '#6366f1', icon: '⏳' }
        };
        return badges[result] || badges.pending;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const resultBadge = getResultBadge(competition.result);

    return (
        <div className={`competition-card ${isUpcoming ? 'upcoming' : 'past'}`}>
            <div className="competition-header">
                <div className="competition-title-section">
                    <h3>{competition.name}</h3>
                    <div className="competition-date">
                        <Calendar size={16} />
                        {formatDate(competition.date)}
                    </div>
                </div>
                <div className="competition-actions">
                    <button
                        className="icon-btn"
                        onClick={() => onEdit(competition)}
                        title="Éditer"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        className="icon-btn danger"
                        onClick={() => onDelete(competition)}
                        title="Supprimer"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <div className="competition-badge-container">
                <span
                    className="result-badge"
                    style={{ '--result-color': resultBadge.color }}
                >
                    <span className="badge-icon">{resultBadge.icon}</span>
                    {resultBadge.label}
                </span>
            </div>

            <div className="competition-details">
                {competition.division && (
                    <div className="detail-item">
                        <Trophy size={16} />
                        <span>Division:</span>
                        <strong>{competition.division}</strong>
                    </div>
                )}
                {competition.weightClass && (
                    <div className="detail-item">
                        <MapPin size={16} />
                        <span>Catégorie:</span>
                        <strong>{competition.weightClass}</strong>
                    </div>
                )}
                {competition.opponents && competition.opponents.length > 0 && (
                    <div className="detail-item">
                        <Users size={16} />
                        <span>Adversaires:</span>
                        <strong>{competition.opponents.length}</strong>
                    </div>
                )}
            </div>

            {competition.gamePlan && (
                <div className="competition-section">
                    <h4>Plan de match</h4>
                    <p>{competition.gamePlan}</p>
                </div>
            )}

            {competition.notes && (
                <div className="competition-section">
                    <h4>Notes</h4>
                    <p>{competition.notes}</p>
                </div>
            )}
        </div>
    );
};

export default CompetitionCard;
