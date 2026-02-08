import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Save } from 'lucide-react';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.profile?.name || '',
        belt: user?.profile?.belt || 'white',
        stripes: user?.profile?.stripes || 0,
        academy: user?.profile?.academy || '',
        shortTermGoals: user?.profile?.shortTermGoals?.join(', ') || '',
        longTermGoals: user?.profile?.longTermGoals?.join(', ') || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            const data = {
                profile: {
                    name: formData.name,
                    belt: formData.belt,
                    stripes: parseInt(formData.stripes),
                    academy: formData.academy,
                    shortTermGoals: formData.shortTermGoals.split(',').map(g => g.trim()).filter(Boolean),
                    longTermGoals: formData.longTermGoals.split(',').map(g => g.trim()).filter(Boolean)
                }
            };

            const response = await userAPI.updateProfile(data);
            updateUser(response.data);
            setSuccess(true);

            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Erreur lors de la mise à jour du profil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="dashboard">
                <div className="dashboard-container">
                    <div className="dashboard-header">
                        <div>
                            <h1 className="dashboard-title">Mon Profil</h1>
                            <p className="dashboard-subtitle">Gérez vos informations personnelles</p>
                        </div>
                    </div>

                    <div className="dashboard-section">
                        {success && (
                            <div style={{
                                padding: '1rem',
                                background: 'var(--success-light)',
                                color: 'var(--success)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '1.5rem'
                            }}>
                                ✓ Profil mis à jour avec succès !
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Nom complet</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={user?.email || ''}
                                        disabled
                                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Ceinture</label>
                                    <select
                                        className="form-select"
                                        value={formData.belt}
                                        onChange={(e) => setFormData({ ...formData, belt: e.target.value })}
                                    >
                                        <option value="white">Blanche</option>
                                        <option value="blue">Bleue</option>
                                        <option value="purple">Violette</option>
                                        <option value="brown">Marron</option>
                                        <option value="black">Noire</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Barrettes (0-4)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        min="0"
                                        max="4"
                                        value={formData.stripes}
                                        onChange={(e) => setFormData({ ...formData, stripes: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Académie</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.academy}
                                    onChange={(e) => setFormData({ ...formData, academy: e.target.value })}
                                    placeholder="Nom de votre académie"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Objectifs court terme (séparés par virgule)</label>
                                <textarea
                                    className="form-textarea"
                                    rows="3"
                                    value={formData.shortTermGoals}
                                    onChange={(e) => setFormData({ ...formData, shortTermGoals: e.target.value })}
                                    placeholder="Ex: Maîtriser le triangle, Améliorer ma garde"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Objectifs long terme (séparés par virgule)</label>
                                <textarea
                                    className="form-textarea"
                                    rows="3"
                                    value={formData.longTermGoals}
                                    onChange={(e) => setFormData({ ...formData, longTermGoals: e.target.value })}
                                    placeholder="Ex: Obtenir la ceinture bleue, Participer à une compétition"
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? <LoadingSpinner size="sm" /> : (
                                        <>
                                            <Save size={18} />
                                            Enregistrer les modifications
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
