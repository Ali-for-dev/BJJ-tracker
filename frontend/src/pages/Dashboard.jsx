import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { trainingAPI } from '../services/api';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Activity, Trophy, Target, TrendingUp, Calendar, Zap } from 'lucide-react';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentTrainings, setRecentTrainings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, trainingsRes] = await Promise.all([
                trainingAPI.getStats(),
                trainingAPI.getAll()
            ]);

            setStats(statsRes.data);
            setRecentTrainings(trainingsRes.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h${mins > 0 ? mins : ''}`;
        }
        return `${mins}min`;
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <LoadingSpinner fullScreen />
            </>
        );
    }

    const submissionRate = stats && stats.totalSubmissionsReceived > 0
        ? ((stats.totalSubmissionsGiven / (stats.totalSubmissionsGiven + stats.totalSubmissionsReceived)) * 100).toFixed(0)
        : 0;

    return (
        <>
            <Navbar />
            <div className="dashboard">
                <div className="dashboard-container">
                    {/* Welcome Header */}
                    <div className="dashboard-header">
                        <div>
                            <h1 className="dashboard-title">
                                Salut, {user?.profile?.name} 👋
                            </h1>
                            <p className="dashboard-subtitle">
                                Voici un aperçu de votre progression en BJJ
                            </p>
                        </div>
                        <div className="belt-badge">
                            <span className="belt-badge-label">Ceinture actuelle</span>
                            <span className="belt-badge-value" style={{
                                color: `var(--belt-${user?.profile?.belt})`
                            }}>
                                {user?.profile?.belt?.toUpperCase()}
                                {user?.profile?.stripes > 0 && ` • ${user.profile.stripes} barrette${user.profile.stripes > 1 ? 's' : ''}`}
                            </span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="dashboard-stats">
                        <StatCard
                            icon={Activity}
                            title="Séances totales"
                            value={stats?.totalSessions || 0}
                            subtitle="+12% ce mois"
                            color="#6366f1"
                        />
                        <StatCard
                            icon={Calendar}
                            title="Heures d'entraînement"
                            value={stats ? formatDuration(stats.totalDuration) : '0'}
                            subtitle="+8% ce mois"
                            color="#10b981"
                        />
                        <StatCard
                            icon={Zap}
                            title="Soumissions données"
                            value={stats?.totalSubmissionsGiven || 0}
                            subtitle="+5 cette semaine"
                            color="#f59e0b"
                        />
                        <StatCard
                            icon={Target}
                            title="Taux de réussite"
                            value={`${submissionRate}%`}
                            color="#8b5cf6"
                        />
                    </div>

                    {/* Recent Activity */}
                    <div className="dashboard-section">
                        <div className="section-header">
                            <div>
                                <h2 className="section-title">Séances récentes</h2>
                                <p className="section-subtitle">Vos 5 derniers entraînements</p>
                            </div>
                            <a href="/training" className="section-link">
                                Voir tout →
                            </a>
                        </div>

                        {recentTrainings.length > 0 ? (
                            <div className="training-list">
                                {recentTrainings.map((training) => (
                                    <div key={training._id} className="training-item">
                                        <div className="training-item-date">
                                            <div className="training-item-day">
                                                {formatDate(training.date)}
                                            </div>
                                            <div className={`training-item-type training-type-${training.type}`}>
                                                {training.type}
                                            </div>
                                        </div>

                                        <div className="training-item-content">
                                            <div className="training-item-details">
                                                <div className="training-item-stat">
                                                    <Calendar size={16} />
                                                    <span>{formatDuration(training.duration)}</span>
                                                </div>
                                                <div className="training-item-stat">
                                                    <TrendingUp size={16} />
                                                    <span>Mental: {training.mentalFeeling}/10</span>
                                                </div>
                                                <div className="training-item-stat">
                                                    <Trophy size={16} />
                                                    <span>{training.submissionsGiven} soumissions</span>
                                                </div>
                                            </div>
                                            {training.notes && (
                                                <p className="training-item-notes">{training.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <Activity size={48} />
                                <h3>Aucune séance enregistrée</h3>
                                <p>Commencez à tracker vos entraînements !</p>
                                <a href="/training" className="btn btn-primary">
                                    Ajouter une séance
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="dashboard-quick-stats">
                        <div className="quick-stat-card">
                            <h3>Ressenti moyen</h3>
                            <div className="quick-stat-row">
                                <div className="quick-stat-item">
                                    <span className="quick-stat-label">Physique</span>
                                    <div className="quick-stat-bar">
                                        <div
                                            className="quick-stat-fill quick-stat-fill-primary"
                                            style={{ width: `${(stats?.averagePhysicalFeeling || 0) * 10}%` }}
                                        ></div>
                                    </div>
                                    <span className="quick-stat-value">{stats?.averagePhysicalFeeling || 0}/10</span>
                                </div>
                                <div className="quick-stat-item">
                                    <span className="quick-stat-label">Mental</span>
                                    <div className="quick-stat-bar">
                                        <div
                                            className="quick-stat-fill quick-stat-fill-accent"
                                            style={{ width: `${(stats?.averageMentalFeeling || 0) * 10}%` }}
                                        ></div>
                                    </div>
                                    <span className="quick-stat-value">{stats?.averageMentalFeeling || 0}/10</span>
                                </div>
                            </div>
                        </div>

                        <div className="quick-stat-card">
                            <h3>Types d'entraînement</h3>
                            <div className="type-distribution">
                                {stats?.typeDistribution && Object.keys(stats.typeDistribution).length > 0 ? (
                                    Object.entries(stats.typeDistribution).map(([type, count]) => (
                                        <div key={type} className="type-distribution-item">
                                            <span className="type-distribution-label">{type}</span>
                                            <div className="type-distribution-bar">
                                                <div
                                                    className="type-distribution-fill"
                                                    style={{
                                                        width: `${(count / stats.totalSessions) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <span className="type-distribution-count">{count}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-secondary">Pas encore de données</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
