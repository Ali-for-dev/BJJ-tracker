import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TechniqueCard from '../components/TechniqueCard';
import FilterBar from '../components/FilterBar';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import { Plus, X, BookOpen } from 'lucide-react';
import { techniqueAPI } from '../services/api';
import '../styles/TechniqueLibrary.css';

const TechniqueLibrary = () => {
    const [techniques, setTechniques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTechnique, setEditingTechnique] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'guard',
        subcategory: '',
        masteryLevel: 1,
        notes: '',
        tags: '',
        successCount: 0,
        attemptCount: 0,
        videoLinks: ''
    });

    const categories = [
        { value: 'guard', label: 'Garde' },
        { value: 'pass', label: 'Passage' },
        { value: 'mount', label: 'Mont' },
        { value: 'back', label: 'Dos' },
        { value: 'side-control', label: 'Contrôle Latéral' },
        { value: 'submission', label: 'Soumission' },
        { value: 'transition', label: 'Transition' },
        { value: 'sweep', label: 'Balayage' },
        { value: 'takedown', label: 'Projection' },
        { value: 'escape', label: 'Échappement' }
    ];

    useEffect(() => {
        fetchTechniques();
    }, [searchTerm, selectedCategory]);

    const fetchTechniques = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (selectedCategory) params.category = selectedCategory;

            const response = await techniqueAPI.getAll(params);
            setTechniques(response.data);
        } catch (error) {
            console.error('Error fetching techniques:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (technique = null) => {
        if (technique) {
            setEditingTechnique(technique);
            setFormData({
                name: technique.name,
                category: technique.category,
                subcategory: technique.subcategory || '',
                masteryLevel: technique.masteryLevel,
                notes: technique.notes || '',
                tags: technique.tags?.join(', ') || '',
                successCount: technique.successCount || 0,
                attemptCount: technique.attemptCount || 0,
                videoLinks: technique.videoLinks?.join(', ') || ''
            });
        } else {
            setEditingTechnique(null);
            setFormData({
                name: '',
                category: 'guard',
                subcategory: '',
                masteryLevel: 1,
                notes: '',
                tags: '',
                successCount: 0,
                attemptCount: 0,
                videoLinks: ''
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTechnique(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const techniqueData = {
            ...formData,
            tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            videoLinks: formData.videoLinks ? formData.videoLinks.split(',').map(v => v.trim()).filter(Boolean) : [],
            successCount: parseInt(formData.successCount) || 0,
            attemptCount: parseInt(formData.attemptCount) || 0,
            masteryLevel: parseInt(formData.masteryLevel)
        };

        try {
            if (editingTechnique) {
                await techniqueAPI.update(editingTechnique._id, techniqueData);
            } else {
                await techniqueAPI.create(techniqueData);
            }
            fetchTechniques();
            closeModal();
        } catch (error) {
            console.error('Error saving technique:', error);
            alert('Erreur lors de la sauvegarde de la technique');
        }
    };

    const handleDelete = async () => {
        try {
            await techniqueAPI.delete(deleteConfirm._id);
            fetchTechniques();
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting technique:', error);
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

    return (
        <>
            <Navbar />
            <div className="dashboard">
                <div className="dashboard-container">
                    <div className="page-header">
                        <div className="header-content">
                            <BookOpen size={32} />
                            <div>
                                <h1>Bibliothèque de Techniques</h1>
                                <p>Gérez et suivez la maîtrise de vos techniques de BJJ</p>
                            </div>
                        </div>
                        <button className="btn-primary" onClick={() => openModal()}>
                            <Plus size={20} />
                            Nouvelle Technique
                        </button>
                    </div>

                    <FilterBar
                        searchValue={searchTerm}
                        onSearchChange={setSearchTerm}
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                        placeholder="Rechercher une technique..."
                    />

                    {loading ? (
                        <LoadingSpinner />
                    ) : techniques.length === 0 ? (
                        <div className="empty-state">
                            <BookOpen size={64} />
                            <h2>Aucune technique trouvée</h2>
                            <p>Commencez par ajouter vos premières techniques de BJJ</p>
                            <button className="btn-primary" onClick={() => openModal()}>
                                <Plus size={20} />
                                Ajouter une technique
                            </button>
                        </div>
                    ) : (
                        <div className="techniques-grid">
                            {techniques.map(technique => (
                                <TechniqueCard
                                    key={technique._id}
                                    technique={technique}
                                    onEdit={openModal}
                                    onDelete={(tech) => setDeleteConfirm(tech)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for Add/Edit Technique */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content technique-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingTechnique ? 'Éditer la technique' : 'Nouvelle technique'}</h2>
                            <button className="close-btn" onClick={closeModal}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label htmlFor="name">Nom de la technique *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ex: Triangle depuis la garde fermée"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="category">Catégorie *</label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subcategory">Sous-catégorie</label>
                                    <input
                                        type="text"
                                        id="subcategory"
                                        name="subcategory"
                                        value={formData.subcategory}
                                        onChange={handleChange}
                                        placeholder="Ex: Garde fermée"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="masteryLevel">Niveau de maîtrise</label>
                                    <select
                                        id="masteryLevel"
                                        name="masteryLevel"
                                        value={formData.masteryLevel}
                                        onChange={handleChange}
                                    >
                                        <option value="1">1 - Débutant</option>
                                        <option value="2">2 - Intermédiaire</option>
                                        <option value="3">3 - Compétent</option>
                                        <option value="4">4 - Avancé</option>
                                        <option value="5">5 - Expert</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="successCount">Réussites</label>
                                    <input
                                        type="number"
                                        id="successCount"
                                        name="successCount"
                                        value={formData.successCount}
                                        onChange={handleChange}
                                        min="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="attemptCount">Tentatives</label>
                                    <input
                                        type="number"
                                        id="attemptCount"
                                        name="attemptCount"
                                        value={formData.attemptCount}
                                        onChange={handleChange}
                                        min="0"
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
                                        placeholder="Points clés, conseils, détails importants..."
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label htmlFor="tags">Tags (séparés par des virgules)</label>
                                    <input
                                        type="text"
                                        id="tags"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        placeholder="gi, nogi, competition, drilling"
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label htmlFor="videoLinks">Liens vidéo (séparés par des virgules)</label>
                                    <input
                                        type="text"
                                        id="videoLinks"
                                        name="videoLinks"
                                        value={formData.videoLinks}
                                        onChange={handleChange}
                                        placeholder="https://youtube.com/..."
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={closeModal}>
                                    Annuler
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingTechnique ? 'Mettre à jour' : 'Créer'}
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
                title="Supprimer cette technique ?"
                message={`Êtes-vous sûr de vouloir supprimer "${deleteConfirm?.name}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
            />
        </>
    );
};

export default TechniqueLibrary;
