import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ChartExport from '../components/ChartExport';
import { BarChart, TrendingUp, Award, Clock } from 'lucide-react';
import { statsAPI } from '../services/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import '../styles/ProgressStats.css';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const ProgressStats = () => {
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState(null);
    const [period, setPeriod] = useState('30');
    const [trainingFrequency, setTrainingFrequency] = useState(null);
    const [techniquesMastery, setTechniquesMastery] = useState(null);
    const [competitionPerformance, setCompetitionPerformance] = useState(null);
    const [techniqueCategories, setTechniqueCategories] = useState(null);
    const [beltProgression, setBeltProgression] = useState(null);

    // Detect theme
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    const tickColor = isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
    const legendColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';

    // Refs for chart export
    const trainingChartRef = React.useRef();
    const masteryChartRef = React.useRef();
    const competitionChartRef = React.useRef();
    const categoryChartRef = React.useRef();

    useEffect(() => {
        fetchAllStats();
    }, [period]);

    const fetchAllStats = async () => {
        try {
            setLoading(true);
            const [
                overviewRes,
                frequencyRes,
                masteryRes,
                performanceRes,
                categoriesRes,
                beltRes
            ] = await Promise.all([
                statsAPI.getOverview(),
                statsAPI.getTrainingFrequency(period),
                statsAPI.getTechniquesMastery(),
                statsAPI.getCompetitionPerformance(),
                statsAPI.getTechniqueCategories(),
                statsAPI.getBeltProgression()
            ]);

            setOverview(overviewRes.data);
            setTrainingFrequency(frequencyRes.data);
            setTechniquesMastery(masteryRes.data);
            setCompetitionPerformance(performanceRes.data);
            setTechniqueCategories(categoriesRes.data);
            setBeltProgression(beltRes.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const trainingChartData = {
        labels: trainingFrequency?.labels || [],
        datasets: [
            {
                label: 'Entraînements',
                data: trainingFrequency?.data || [],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }
        ]
    };

    const masteryChartData = {
        labels: techniquesMastery?.labels || [],
        datasets: [
            {
                data: techniquesMastery?.data || [],
                backgroundColor: [
                    '#ef4444',
                    '#f59e0b',
                    '#eab308',
                    '#10b981',
                    '#6366f1'
                ],
                borderWidth: 0
            }
        ]
    };

    const competitionChartData = {
        labels: competitionPerformance?.labels || [],
        datasets: [
            {
                label: 'Résultats',
                data: competitionPerformance?.data || [],
                backgroundColor: [
                    '#fbbf24',
                    '#d1d5db',
                    '#cd7f32',
                    '#6b7280'
                ],
                borderWidth: 0,
                borderRadius: 8
            }
        ]
    };

    const categoryChartData = {
        labels: techniqueCategories?.labels || [],
        datasets: [
            {
                label: 'Nombre de techniques',
                data: techniqueCategories?.data || [],
                backgroundColor: [
                    '#6366f1',
                    '#8b5cf6',
                    '#ec4899',
                    '#ef4444',
                    '#f59e0b',
                    '#10b981',
                    '#06b6d4',
                    '#3b82f6',
                    '#6366f1',
                    '#a855f7'
                ],
                borderWidth: 0,
                borderRadius: 8
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 750,
            easing: 'easeInOutQuart'
        },
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                padding: 16,
                borderRadius: 12,
                titleFont: {
                    size: 15,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 14
                },
                bodySpacing: 6,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                    title: (context) => {
                        return context[0].label;
                    },
                    label: (context) => {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y || context.parsed;
                        return `${label}: ${value}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: gridColor,
                    drawBorder: false
                },
                ticks: {
                    color: tickColor,
                    font: {
                        size: 12
                    },
                    precision: 0
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: tickColor,
                    font: {
                        size: 12
                    }
                }
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        },
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: legendColor,
                    padding: 18,
                    font: {
                        size: 13,
                        weight: '500'
                    },
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                padding: 16,
                borderRadius: 12,
                bodyFont: {
                    size: 14
                },
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    };

    const barOptions = {
        ...chartOptions,
        indexAxis: 'y',
        plugins: {
            ...chartOptions.plugins,
            legend: {
                display: false
            },
            tooltip: {
                ...chartOptions.plugins.tooltip,
                callbacks: {
                    title: (context) => context[0].label,
                    label: (context) => {
                        return `Techniques: ${context.parsed.x}`;
                    }
                }
            }
        },
        scales: {
            y: {
                ...chartOptions.scales.y,
                beginAtZero: true
            },
            x: {
                ...chartOptions.scales.x,
                beginAtZero: true,
                grid: {
                    color: gridColor
                },
                ticks: {
                    color: tickColor,
                    precision: 0
                }
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className="dashboard">
                <div className="dashboard-container">
                    <div className="page-header">
                        <div className="header-content">
                            <BarChart size={32} />
                            <div>
                                <h1>Statistiques de Progression</h1>
                                <p>Visualisez vos progrès et performances</p>
                            </div>
                        </div>
                        <div className="period-filter">
                            <button
                                className={`filter-btn ${period === '7' ? 'active' : ''}`}
                                onClick={() => setPeriod('7')}
                            >
                                7 jours
                            </button>
                            <button
                                className={`filter-btn ${period === '30' ? 'active' : ''}`}
                                onClick={() => setPeriod('30')}
                            >
                                30 jours
                            </button>
                            <button
                                className={`filter-btn ${period === '90' ? 'active' : ''}`}
                                onClick={() => setPeriod('90')}
                            >
                                3 mois
                            </button>
                            <button
                                className={`filter-btn ${period === '365' ? 'active' : ''}`}
                                onClick={() => setPeriod('365')}
                            >
                                1 an
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            {/* Overview Cards */}
                            <div className="stats-overview">
                                <StatCard
                                    icon={<Clock size={24} />}
                                    title="Total Entraînements"
                                    value={overview?.trainings?.total || 0}
                                    subtitle={`${overview?.trainings?.totalHours || 0} heures`}
                                    color="#6366f1"
                                />
                                <StatCard
                                    icon={<TrendingUp size={24} />}
                                    title="Techniques Maîtrisées"
                                    value={overview?.techniques?.total || 0}
                                    subtitle={`Moyenne: ${overview?.techniques?.avgMastery || 0}/5`}
                                    color="#10b981"
                                />
                                <StatCard
                                    icon={<Award size={24} />}
                                    title="Compétitions"
                                    value={overview?.competitions?.total || 0}
                                    subtitle={`${overview?.competitions?.medals?.gold || 0} médailles d'or`}
                                    color="#fbbf24"
                                />
                            </div>

                            {/* Charts Grid */}
                            <div className="charts-grid">
                                {/* Training Frequency Chart */}
                                <div className="chart-card">
                                    <div className="chart-card-header">
                                        <h3>Fréquence d'Entraînement</h3>
                                        {trainingFrequency?.data?.length > 0 && (
                                            <ChartExport chartRef={trainingChartRef} chartTitle="Frequence_Entrainement" />
                                        )}
                                    </div>
                                    <div className="chart-container">
                                        {trainingFrequency?.data?.length > 0 ? (
                                            <Line ref={trainingChartRef} data={trainingChartData} options={chartOptions} />
                                        ) : (
                                            <div className="no-data">
                                                <TrendingUp size={48} />
                                                <p>Aucune donnée d'entraînement pour cette période</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Technique Mastery Chart */}
                                <div className="chart-card">
                                    <div className="chart-card-header">
                                        <h3>Distribution de Maîtrise</h3>
                                        {techniquesMastery?.data?.some(val => val > 0) && (
                                            <ChartExport chartRef={masteryChartRef} chartTitle="Distribution_Maitrise" />
                                        )}
                                    </div>
                                    <div className="chart-container">
                                        {techniquesMastery?.data?.some(val => val > 0) ? (
                                            <Doughnut ref={masteryChartRef} data={masteryChartData} options={doughnutOptions} />
                                        ) : (
                                            <div className="no-data">
                                                <BarChart size={48} />
                                                <p>Ajoutez des techniques pour voir la distribution</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Technique Categories Chart */}
                                <div className="chart-card full-width">
                                    <div className="chart-card-header">
                                        <h3>Techniques par Catégorie</h3>
                                        {techniqueCategories?.data?.length > 0 && (
                                            <ChartExport chartRef={categoryChartRef} chartTitle="Techniques_Categories" />
                                        )}
                                    </div>
                                    <div className="chart-container">
                                        {techniqueCategories?.data?.length > 0 ? (
                                            <Bar ref={categoryChartRef} data={categoryChartData} options={barOptions} />
                                        ) : (
                                            <div className="no-data">
                                                <BarChart size={48} />
                                                <p>Ajoutez des techniques pour voir la répartition par catégorie</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Competition Performance Chart */}
                                <div className="chart-card full-width">
                                    <div className="chart-card-header">
                                        <h3>Performance en Compétition</h3>
                                        {competitionPerformance?.data?.some(val => val > 0) && (
                                            <ChartExport chartRef={competitionChartRef} chartTitle="Performance_Competition" />
                                        )}
                                    </div>
                                    <div className="chart-container">
                                        {competitionPerformance?.data?.some(val => val > 0) ? (
                                            <Bar ref={competitionChartRef} data={competitionChartData} options={barOptions} />
                                        ) : (
                                            <div className="no-data">
                                                <Award size={48} />
                                                <p>Ajoutez des compétitions pour voir vos performances</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProgressStats;
