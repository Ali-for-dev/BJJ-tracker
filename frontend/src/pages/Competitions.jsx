import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CompetitionCard from '../components/CompetitionCard';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, X, Trophy, Calendar as CalendarIcon } from 'lucide-react';
import { competitionAPI } from '../services/api';
import '../styles/Competitions.css';

const Competitions = () => {
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompetition, setEditingCompetition] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        division: '',
        weightClass: '',
        result: 'pending',
        opponents: '',
        gamePlan: '',
        notes: ''
    });

    useEffect(() => {
        fetchCompetitions();
    }, []);

    const fetchCompetitions = async () => {
        try {
            setLoading(true);
            const response = await competitionAPI.getAll();
            setCompetitions(response.data);
        } catch (error) {
            console.error('Error fetching competitions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredCompetitions = () => {
        const now = new Date();
        return competitions.filter(comp => {
            const compDate = new Date(comp.date);
            return activeTab === 'upcoming' ? compDate >= now : compDate < now;
        }).sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return activeTab === 'upcoming' ? dateA - dateB : dateB - dateA;
        });
    };

    const openModal = (competition = null) => {
        if (competition) {
            setEditingCompetition(competition);
            setFormData({
                name: competition.name,
                date: new Date(competition.date).toISOString().split('T')[0],
                division: competition.division || '',
                weightClass: competition.weightClass || '',
                result: competition.result || 'pending',
                opponents: competition.opponents?.join(', ') || '',
                gamePlan: competition.gamePlan || '',
                notes: competition.notes || ''
            });
        } else {
            setEditingCompetition(null);
            setFormData({
                name: '',
                date: '',
                division: '',
                weightClass: '',
                result: 'pending',
                opponents: '',
                gamePlan: '',
                notes: ''
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCompetition(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const competitionData = {
            ...formData,
            opponents: formData.opponents ? formData.opponents.split(',').map(o => o.trim()).filter(Boolean) : [],
            type: new Date(formData.date) >= new Date() ? 'upcoming' : 'past'
        };

        try {
            if (editingCompetition) {
                await competitionAPI.update(editingCompetition._id, competitionData);
            } else {
                await competitionAPI.create(competitionData);
            }
            fetchCompetitions();
            closeModal();
        } catch (error) {
            console.error('Error saving competition:', error);
            alert('Erreur lors de l\'enregistrement de la compétition');
        }
    };

    const handleDelete = async () => {
        try {
            await competitionAPI.delete(deleteConfirm._id);
            fetchCompetitions();
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting competition:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredCompetitions = getFilteredCompetitions();
    const upcomingCount = competitions.filter(c => new Date(c.date) >= new Date()).length;
    const pastCount = competitions.filter(c => new Date(c.date) < new Date()).length;

    return (
        <>
            <Navbar />
            <div className="dashboard">
                <div className="dashboard-container">
                    <div className="page-header">
                        <div className="header-content">
                            <Trophy size={32} />
                            <div>
                                <h1>Gestion des Compétitions</h1>
                                <p>Planifiez et suivez vos performances en compétition</p>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={() => openModal()}>
                            <Plus size={20} />
                            Nouvelle Compétition
                        </button>
                    </div>

                    <div className="tabs-container">
                        <button
                            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setActiveTab('upcoming')}
                        >
                            <CalendarIcon size={18} />
                            À venir
                            <span className="tab-badge">{upcomingCount}</span>
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
                            onClick={() => setActiveTab('past')}
                        >
                            <Trophy size={18} />
                            Passées
                            <span className="tab-badge">{pastCount}</span>
                        </button>
                    </div>

                    {loading ? (
                        <LoadingSpinner />
                    ) : filteredCompetitions.length === 0 ? (
                        <div className="empty-state">
                            <Trophy size={64} />
                            <h2>Aucune compétition {activeTab === 'upcoming' ? 'à venir' : 'passée'}</h2>
                            <p>
                                {activeTab === 'upcoming'
                                    ? 'Ajoutez vos prochaines compétitions pour mieux vous préparer'
                                    : 'Vos compétitions passées apparaîtront ici'}
                            </p>
                            <button className="btn-primary" onClick={() => openModal()}>
                                <Plus size={20} />
                                Ajouter une compétition
                            </button>
                        </div>
                    ) : (
                        <div className="competitions-grid">
                            {filteredCompetitions.map(competition => (
                                <CompetitionCard
                                    key={competition._id}
                                    competition={competition}
                                    onEdit={openModal}
                                    onDelete={(comp) => setDeleteConfirm(comp)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for Add/Edit Competition */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content competition-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingCompetition ? 'Éditer la compétition' : 'Nouvelle compétition'}</h2>
                            <button className="close-btn" onClick={closeModal}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label htmlFor="name">Nom de la compétition *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ex: Championnat National BJJ"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="date">Date *</label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="result">Résultat</label>
                                    <select
                                        id="result"
                                        name="result"
                                        value={formData.result}
                                        onChange={handleChange}
                                    >
                                        <option value="pending">En attente</option>
                                        <option value="gold">Or 🥇</option>
                                        <option value="silver">Argent 🥈</option>
                                        <option value="bronze">Bronze 🥉</option>
                                        <option value="participation">Participation</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="division">Division</label>
                                    <input
                                        type="text"
                                        id="division"
                                        name="division"
                                        value={formData.division}
                                        onChange={handleChange}
                                        placeholder="Ex: Adulte, Master, etc."
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="weightClass">Catégorie de poids</label>
                                    <input
                                        type="text"
                                        id="weightClass"
                                        name="weightClass"
                                        value={formData.weightClass}
                                        onChange={handleChange}
                                        placeholder="Ex: -70kg, -76kg, etc."
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label htmlFor="opponents">Adversaires (séparés par des virgules)</label>
                                    <input
                                        type="text"
                                        id="opponents"
                                        name="opponents"
                                        value={formData.opponents}
                                        onChange={handleChange}
                                        placeholder="Nom des adversaires rencontrés"
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label htmlFor="gamePlan">Plan de match</label>
                                    <textarea
                                        id="gamePlan"
                                        name="gamePlan"
                                        value={formData.gamePlan}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Votre stratégie pour cette compétition..."
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label htmlFor="notes">Notes</label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Observations, leçons apprises, points à améliorer..."
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={closeModal}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingCompetition ? 'Mettre à jour' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={handleDelete}
                title="Supprimer cette compétition ?"
                message={`Êtes-vous sûr de vouloir supprimer "${deleteConfirm?.name}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
            />
        </>
    );
};

export default Competitions;
