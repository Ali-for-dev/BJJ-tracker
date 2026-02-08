import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import { trainingAPI } from '../services/api';
import { Plus, Calendar, Clock, Trophy, X, Edit2, Activity, Shirt, Target, Zap, Users, CalendarDays, Timer, Brain, Dumbbell } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/TrainingJournal.css';

const TrainingJournal = () => {
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        duration: '',
        type: 'gi',
        techniquesPracticed: '',
        partners: '',
        physicalFeeling: 5,
        mentalFeeling: 5,
        notes: '',
        submissionsGiven: 0,
        submissionsReceived: 0
    });

    // Mémoisation de fetchTrainings
    const fetchTrainings = useCallback(async () => {
        try {
            const response = await trainingAPI.getAll();
            setTrainings(response.data);
        } catch (error) {
            console.error('Error fetching trainings:', error);
            toast.error('Erreur lors du chargement des séances');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTrainings();
    }, [fetchTrainings]);

    // Fermeture modale centralisée
    const closeModal = useCallback(() => {
        setShowModal(false);
        setEditingId(null);
        resetForm();
    }, []);

    // Gestion de la touche Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && showModal) {
                closeModal();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [showModal, closeModal]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = {
                ...formData,
                duration: parseInt(formData.duration),
                techniquesPracticed: formData.techniquesPracticed.split(',').map(t => t.trim()).filter(Boolean),
                partners: formData.partners.split(',').map(p => p.trim()).filter(Boolean),
                submissionsGiven: parseInt(formData.submissionsGiven) || 0,
                submissionsReceived: parseInt(formData.submissionsReceived) || 0
            };

            if (editingId) {
                await trainingAPI.update(editingId, data);
                toast.success('✅ Séance modifiée avec succès!');
            } else {
                await trainingAPI.create(data);
                toast.success('🎉 Nouvelle séance enregistrée!');
            }

            closeModal();
            fetchTrainings();
        } catch (error) {
            console.error('Error saving training:', error);
            toast.error(editingId ? '❌ Erreur lors de la modification de la séance' : '❌ Erreur lors de la création de la séance');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            date: new Date().toISOString().split('T')[0],
            duration: '',
            type: 'gi',
            techniquesPracticed: '',
            partners: '',
            physicalFeeling: 5,
            mentalFeeling: 5,
            notes: '',
            submissionsGiven: 0,
            submissionsReceived: 0
        });
    };

    const handleEdit = (training) => {
        setEditingId(training._id);
        setFormData({
            date: new Date(training.date).toISOString().split('T')[0],
            duration: training.duration.toString(),
            type: training.type,
            techniquesPracticed: training.techniquesPracticed.join(', '),
            partners: training.partners.join(', '),
            physicalFeeling: training.physicalFeeling,
            mentalFeeling: training.mentalFeeling,
            notes: training.notes || '',
            submissionsGiven: training.submissionsGiven,
            submissionsReceived: training.submissionsReceived
        });
        setShowModal(true);
    };

    const handleDeleteRequest = (id) => {
        setDeleteConfirm({ open: true, id });
    };

    const handleDeleteConfirm = async () => {
        try {
            await trainingAPI.delete(deleteConfirm.id);
            toast.success('🗑️ Séance supprimée avec succès');
            fetchTrainings();
        } catch (error) {
            console.error('Error deleting training:', error);
            toast.error('❌ Erreur lors de la suppression');
        } finally {
            setDeleteConfirm({ open: false, id: null });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Mémorisation des statistiques mensuelles
    const monthlyStats = useMemo(() => {
        if (trainings.length === 0) return null;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const thisMonthTrainings = trainings.filter(t => {
            const trainingDate = new Date(t.date);
            return trainingDate.getMonth() === currentMonth
                && trainingDate.getFullYear() === currentYear;
        });

        const totalDuration = thisMonthTrainings.reduce((sum, t) => sum + t.duration, 0);
        const avgPhysical = thisMonthTrainings.length > 0
            ? (thisMonthTrainings.reduce((sum, t) => sum + t.physicalFeeling, 0) / thisMonthTrainings.length).toFixed(1)
            : 0;
        const avgMental = thisMonthTrainings.length > 0
            ? (thisMonthTrainings.reduce((sum, t) => sum + t.mentalFeeling, 0) / thisMonthTrainings.length).toFixed(1)
            : 0;
        const totalSubmissionsGiven = thisMonthTrainings.reduce((sum, t) => sum + t.submissionsGiven, 0);
        const totalSubmissionsReceived = thisMonthTrainings.reduce((sum, t) => sum + t.submissionsReceived, 0);

        return {
            count: thisMonthTrainings.length,
            totalDuration,
            avgPhysical,
            avgMental,
            totalSubmissionsGiven,
            totalSubmissionsReceived
        };
    }, [trainings]);

    // Mémorisation des compteurs de filtres
    const filterCounts = useMemo(() => ({
        all: trainings.length,
        gi: trainings.filter(t => t.type === 'gi').length,
        'no-gi': trainings.filter(t => t.type === 'no-gi').length,
        drilling: trainings.filter(t => t.type === 'drilling').length,
        sparring: trainings.filter(t => t.type === 'sparring').length,
    }), [trainings]);

    if (loading) {
        return (
            <>
                <Navbar />
                <LoadingSpinner fullScreen />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <div className="dashboard">
                <div className="dashboard-container">
                    <div className="dashboard-header">
                        <div>
                            <h1 className="dashboard-title">Journal d'entraînement</h1>
                            <p className="dashboard-subtitle">Suivez toutes vos séances</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => { setEditingId(null); resetForm(); setShowModal(true); }}>
                            <Plus size={20} />
                            Nouvelle séance
                        </button>
                    </div>

                    {/* Statistics Summary */}
                    {monthlyStats && (
                        <div className="stats-summary">
                            <div className="stat-card">
                                <div className="stat-icon"><CalendarDays size={28} strokeWidth={2} color='black' /></div>
                                <div className="stat-content">
                                    <div className="stat-value">{monthlyStats.count}</div>
                                    <div className="stat-label">Séances ce mois</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon"><Timer size={28} strokeWidth={2} color='black' /></div>
                                <div className="stat-content">
                                    <div className="stat-value">{(monthlyStats.totalDuration / 60).toFixed(1)}h</div>
                                    <div className="stat-label">Temps total</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon"><Dumbbell size={28} strokeWidth={2} color='black' /></div>
                                <div className="stat-content">
                                    <div className="stat-value">{monthlyStats.avgPhysical}/10</div>
                                    <div className="stat-label">Ressenti physique</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon"><Brain size={28} strokeWidth={2} color='black' /></div>
                                <div className="stat-content">
                                    <div className="stat-value">{monthlyStats.avgMental}/10</div>
                                    <div className="stat-label">Ressenti mental</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon"><Trophy size={28} strokeWidth={2} color='black' /></div>
                                <div className="stat-content">
                                    <div className="stat-value">{monthlyStats.totalSubmissionsGiven}/{monthlyStats.totalSubmissionsReceived}</div>
                                    <div className="stat-label">Ratio soumissions</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filter Bar */}
                    <div className="filter-bar">
                        <button
                            className={`filter-chip ${filterType === 'all' ? 'active' : ''}`}
                            onClick={() => setFilterType('all')}
                        >
                            <span className="filter-icon"><Activity size={16} /></span>
                            <span className="filter-label">Tous</span>
                            {filterType === 'all' && filterCounts.all > 0 && (
                                <span className="filter-count">{filterCounts.all}</span>
                            )}
                        </button>
                        <button
                            className={`filter-chip ${filterType === 'gi' ? 'active' : ''}`}
                            onClick={() => setFilterType('gi')}
                        >
                            <span className="filter-icon"><Users size={16} /></span>
                            <span className="filter-label">Gi</span>
                            {filterType === 'gi' && (
                                <span className="filter-count">{filterCounts.gi}</span>
                            )}
                        </button>
                        <button
                            className={`filter-chip ${filterType === 'no-gi' ? 'active' : ''}`}
                            onClick={() => setFilterType('no-gi')}
                        >
                            <span className="filter-icon"><Shirt size={16} /></span>
                            <span className="filter-label">No-Gi</span>
                            {filterType === 'no-gi' && (
                                <span className="filter-count">{filterCounts['no-gi']}</span>
                            )}
                        </button>
                        <button
                            className={`filter-chip ${filterType === 'drilling' ? 'active' : ''}`}
                            onClick={() => setFilterType('drilling')}
                        >
                            <span className="filter-icon"><Target size={16} /></span>
                            <span className="filter-label">Drilling</span>
                            {filterType === 'drilling' && (
                                <span className="filter-count">{filterCounts.drilling}</span>
                            )}
                        </button>
                        <button
                            className={`filter-chip ${filterType === 'sparring' ? 'active' : ''}`}
                            onClick={() => setFilterType('sparring')}
                        >
                            <span className="filter-icon"><Zap size={16} /></span>
                            <span className="filter-label">Sparring</span>
                            {filterType === 'sparring' && (
                                <span className="filter-count">{filterCounts.sparring}</span>
                            )}
                        </button>
                    </div>

                    <div className="training-list">
                        {trainings
                            .filter(t => filterType === 'all' || t.type === filterType)
                            .map((training) => (
                                <div key={training._id} className="card training-card">
                                    <div className="training-card-header">
                                        <div>
                                            <h3>{formatDate(training.date)}</h3>
                                            <span className={`training-item-type training-type-${training.type}`}>
                                                {training.type}
                                            </span>
                                        </div>
                                        <div className="training-card-actions">
                                            <button
                                                className="btn-icon-edit"
                                                onClick={() => handleEdit(training)}
                                                title="Modifier"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                className="btn-icon-danger"
                                                onClick={() => handleDeleteRequest(training._id)}
                                                title="Supprimer"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="training-card-stats">
                                        <div className="training-card-stat">
                                            <Clock size={18} />
                                            <span>{training.duration} min</span>
                                        </div>
                                        <div className="training-card-stat">
                                            <Trophy size={18} />
                                            <span>✅ {training.submissionsGiven} | ❌ {training.submissionsReceived}</span>
                                        </div>
                                        <div className="training-card-stat">
                                            <span>💪 Physique: {training.physicalFeeling}/10</span>
                                        </div>
                                        <div className="training-card-stat">
                                            <span>🧠 Mental: {training.mentalFeeling}/10</span>
                                        </div>
                                    </div>

                                    {training.techniquesPracticed && training.techniquesPracticed.length > 0 && (
                                        <div className="training-card-techniques">
                                            <strong>Techniques:</strong>
                                            <div className="techniques-list">
                                                {training.techniquesPracticed.map((tech, idx) => (
                                                    <span key={idx} className="technique-badge">{tech}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {training.partners && training.partners.length > 0 && (
                                        <div className="training-card-partners">
                                            <strong>Partenaires:</strong> {training.partners.join(', ')}
                                        </div>
                                    )}

                                    {training.notes && (
                                        <p className="training-card-notes">{training.notes}</p>
                                    )}
                                </div>
                            ))}
                    </div>

                    {trainings.length === 0 && (
                        <div className="empty-state">
                            <Calendar size={48} />
                            <h3>Aucune séance enregistrée</h3>
                            <p>Commencez à tracker vos entraînements !</p>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingId ? 'Modifier la séance' : 'Nouvelle séance d\'entraînement'}</h2>
                            <button className="modal-close" onClick={closeModal}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Durée (minutes)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        required
                                        min="1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Type</label>
                                    <select
                                        className="form-select"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="gi">Gi</option>
                                        <option value="no-gi">No-Gi</option>
                                        <option value="drilling">Drilling</option>
                                        <option value="sparring">Sparring</option>
                                        <option value="open-mat">Open Mat</option>
                                        <option value="competition-prep">Préparation compétition</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Ressenti physique (1-10)</label>
                                    <input
                                        type="range"
                                        className="form-range"
                                        min="1"
                                        max="10"
                                        value={formData.physicalFeeling}
                                        onChange={(e) => setFormData({ ...formData, physicalFeeling: parseInt(e.target.value) })}
                                    />
                                    <span className="form-range-value">{formData.physicalFeeling}</span>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Ressenti mental (1-10)</label>
                                    <input
                                        type="range"
                                        className="form-range"
                                        min="1"
                                        max="10"
                                        value={formData.mentalFeeling}
                                        onChange={(e) => setFormData({ ...formData, mentalFeeling: parseInt(e.target.value) })}
                                    />
                                    <span className="form-range-value">{formData.mentalFeeling}</span>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Soumissions données</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.submissionsGiven}
                                        onChange={(e) => setFormData({ ...formData, submissionsGiven: e.target.value })}
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Soumissions reçues</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.submissionsReceived}
                                        onChange={(e) => setFormData({ ...formData, submissionsReceived: e.target.value })}
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Techniques pratiquées (séparées par virgule)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Triangle, Kimura, Armbar"
                                    value={formData.techniquesPracticed}
                                    onChange={(e) => setFormData({ ...formData, techniquesPracticed: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Partenaires (séparés par virgule)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Jean, Marie, Paul"
                                    value={formData.partners}
                                    onChange={(e) => setFormData({ ...formData, partners: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Notes</label>
                                <textarea
                                    className="form-textarea"
                                    rows="4"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Notes sur la séance..."
                                />
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Enregistrement...' : (editingId ? 'Modifier' : 'Enregistrer')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={deleteConfirm.open}
                onClose={() => setDeleteConfirm({ open: false, id: null })}
                onConfirm={handleDeleteConfirm}
                title="Supprimer la séance"
                message="Êtes-vous sûr de vouloir supprimer cette séance d'entraînement ? Cette action est irréversible."
                confirmText="Supprimer"
            />
        </>
    );
};

export default TrainingJournal;