import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';

// Import routes
import authRoutes from './src/routes/auth.js';
import userRoutes from './src/routes/users.js';
import trainingRoutes from './src/routes/trainings.js';
import techniqueRoutes from './src/routes/techniques.js';
import competitionRoutes from './src/routes/competitions.js';
import statsRoutes from './src/routes/stats.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/api/techniques', techniqueRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api/stats', statsRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: '🥋 BJJ Tracker API is running...' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Local: http://localhost:${PORT}`);
    console.log(`📱 Network: http://192.168.1.51:${PORT}`);
});
