import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    belt: 'white',
    academy: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let result;
    if (isLogin) {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData);
    }

    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-gradient login-gradient-1"></div>
        <div className="login-gradient login-gradient-2"></div>
        <div className="login-gradient login-gradient-3"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">🥋</div>
            <h1 className="login-title">BJJ Tracker</h1>
            <p className="login-subtitle">
              {isLogin ? 'Bienvenue ! Connectez-vous à votre compte' : 'Créez votre compte et commencez à tracker'}
            </p>
          </div>

          {error && (
            <div className="login-error">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="form-group">
                <label className="form-label" htmlFor="name">Nom complet</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder="Votre nom"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="vous@exemple.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            {!isLogin && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="belt">Ceinture actuelle</label>
                  <select
                    id="belt"
                    name="belt"
                    className="form-select"
                    value={formData.belt}
                    onChange={handleChange}
                  >
                    <option value="white">Blanche</option>
                    <option value="blue">Bleue</option>
                    <option value="purple">Violette</option>
                    <option value="brown">Marron</option>
                    <option value="black">Noire</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="academy">Académie (optionnel)</label>
                  <input
                    type="text"
                    id="academy"
                    name="academy"
                    className="form-input"
                    placeholder="Nom de votre académie"
                    value={formData.academy}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg login-submit"
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                isLogin ? 'Se connecter' : 'Créer un compte'
              )}
            </button>
          </form>

          <div className="login-footer">
            <button
              type="button"
              className="login-toggle"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              {isLogin
                ? "Pas encore de compte ? S'inscrire"
                : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>

        <div className="login-features">
          <div className="login-feature">
            <div className="login-feature-icon">📊</div>
            <h3>Suivez votre progression</h3>
            <p>Visualisez votre évolution technique et vos statistiques</p>
          </div>
          <div className="login-feature">
            <div className="login-feature-icon">📚</div>
            <h3>Bibliothèque technique</h3>
            <p>Organisez et maîtrisez vos techniques BJJ</p>
          </div>
          <div className="login-feature">
            <div className="login-feature-icon">🏆</div>
            <h3>Compétitions</h3>
            <p>Préparez et suivez vos compétitions</p>
          </div>
        </div>
      </div >
    </div >
  );
};

export default Login;
