import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Home,
    BookOpen,
    Library,
    TrendingUp,
    Trophy,
    User,
    Menu,
    X,
    LogOut,
    Moon,
    Sun
} from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: Home },
        { path: '/training', label: 'Entraînements', icon: BookOpen },
        { path: '/techniques', label: 'Techniques', icon: Library },
        { path: '/progress', label: 'Progression', icon: TrendingUp },
        { path: '/competitions', label: 'Compétitions', icon: Trophy },
    ];

    const getBeltColor = (belt) => {
        const colors = {
            white: 'var(--belt-white)',
            blue: 'var(--belt-blue)',
            purple: 'var(--belt-purple)',
            brown: 'var(--belt-brown)',
            black: 'var(--belt-black)'
        };
        return colors[belt] || colors.white;
    };

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-brand">
                    <div className="navbar-logo">🥋</div>
                    <span className="navbar-title">BJJ Flow-Tracker</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-links">
                    {navLinks.map(({ path, label, icon: Icon }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`navbar-link ${location.pathname === path ? 'navbar-link-active' : ''}`}
                        >
                            <Icon size={18} />
                            <span>{label}</span>
                        </Link>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="navbar-actions">
                    <button onClick={toggleTheme} className="navbar-icon-btn" aria-label="Toggle theme">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    <Link to="/profile" className="navbar-profile">
                        <div
                            className="navbar-profile-avatar"
                            style={{ borderColor: getBeltColor(user?.profile?.belt) }}
                        >
                            <User size={18} />
                        </div>
                        <div className="navbar-profile-info">
                            <span className="navbar-profile-name">{user?.profile?.name}</span>
                            <span className="navbar-profile-belt">
                                {user?.profile?.belt} belt
                                {user?.profile?.stripes > 0 && ` (${user.profile.stripes} stripe${user.profile.stripes > 1 ? 's' : ''})`}
                            </span>
                        </div>
                    </Link>

                    <button onClick={handleLogout} className="navbar-icon-btn" aria-label="Logout">
                        <LogOut size={20} />
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="navbar-mobile-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="navbar-mobile-menu">
                    <div className="navbar-mobile-profile">
                        <div
                            className="navbar-profile-avatar"
                            style={{ borderColor: getBeltColor(user?.profile?.belt) }}
                        >
                            <User size={20} />
                        </div>
                        <div className="navbar-profile-info">
                            <span className="navbar-profile-name">{user?.profile?.name}</span>
                            <span className="navbar-profile-belt">
                                {user?.profile?.belt} belt
                                {user?.profile?.stripes > 0 && ` (${user.profile.stripes})`}
                            </span>
                        </div>
                    </div>

                    {navLinks.map(({ path, label, icon: Icon }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`navbar-mobile-link ${location.pathname === path ? 'navbar-link-active' : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <Icon size={20} />
                            <span>{label}</span>
                        </Link>
                    ))}

                    <Link
                        to="/profile"
                        className="navbar-mobile-link"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <User size={20} />
                        <span>Profil</span>
                    </Link>

                    <div className="navbar-mobile-actions">
                        <button onClick={toggleTheme} className="btn btn-secondary">
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                            <span>Thème {theme === 'light' ? 'Sombre' : 'Clair'}</span>
                        </button>

                        <button onClick={handleLogout} className="btn btn-secondary">
                            <LogOut size={18} />
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
