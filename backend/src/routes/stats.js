import express from 'express';
import Training from '../models/Training.js';
import Technique from '../models/Technique.js';
import Competition from '../models/Competition.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/stats/overview
// @desc    Get overview statistics
// @access  Private
router.get('/overview', protect, async (req, res) => {
    try {
        const userId = req.user._id;

        // Training stats
        const trainings = await Training.find({ userId });
        const totalTrainings = trainings.length;
        const totalHours = trainings.reduce((sum, t) => sum + (t.duration || 0), 0);

        // Technique stats
        const techniques = await Technique.find({ userId });
        const totalTechniques = techniques.length;
        const avgMastery = techniques.length > 0
            ? techniques.reduce((sum, t) => sum + t.masteryLevel, 0) / techniques.length
            : 0;

        // Competition stats
        const competitions = await Competition.find({ userId });
        const totalCompetitions = competitions.length;
        const medals = {
            gold: competitions.filter(c => c.result === 'gold').length,
            silver: competitions.filter(c => c.result === 'silver').length,
            bronze: competitions.filter(c => c.result === 'bronze').length
        };

        res.json({
            trainings: {
                total: totalTrainings,
                totalHours: Math.round(totalHours / 60) // Convert to hours
            },
            techniques: {
                total: totalTechniques,
                avgMastery: Math.round(avgMastery * 10) / 10
            },
            competitions: {
                total: totalCompetitions,
                medals
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/stats/training-frequency
// @desc    Get training frequency over time
// @access  Private
router.get('/training-frequency', protect, async (req, res) => {
    try {
        const { period = '30' } = req.query;
        const days = parseInt(period);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const trainings = await Training.find({
            userId: req.user._id,
            date: { $gte: startDate }
        }).sort({ date: 1 });

        // Group by date
        const frequencyMap = {};
        trainings.forEach(training => {
            const dateKey = new Date(training.date).toLocaleDateString('fr-FR');
            frequencyMap[dateKey] = (frequencyMap[dateKey] || 0) + 1;
        });

        const labels = Object.keys(frequencyMap);
        const data = Object.values(frequencyMap);

        res.json({ labels, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/stats/techniques-mastery
// @desc    Get technique mastery distribution
// @access  Private
router.get('/techniques-mastery', protect, async (req, res) => {
    try {
        const techniques = await Technique.find({ userId: req.user._id });

        const masteryDist = {
            1: 0, // Débutant
            2: 0, // Intermédiaire
            3: 0, // Compétent
            4: 0, // Avancé
            5: 0  // Expert
        };

        techniques.forEach(tech => {
            masteryDist[tech.masteryLevel] = (masteryDist[tech.masteryLevel] || 0) + 1;
        });

        res.json({
            labels: ['Débutant', 'Intermédiaire', 'Compétent', 'Avancé', 'Expert'],
            data: [
                masteryDist[1],
                masteryDist[2],
                masteryDist[3],
                masteryDist[4],
                masteryDist[5]
            ]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/stats/competition-performance
// @desc    Get competition performance stats
// @access  Private
router.get('/competition-performance', protect, async (req, res) => {
    try {
        const competitions = await Competition.find({ userId: req.user._id }).sort({ date: 1 });

        const performance = {
            gold: 0,
            silver: 0,
            bronze: 0,
            participation: 0
        };

        competitions.forEach(comp => {
            if (performance.hasOwnProperty(comp.result)) {
                performance[comp.result]++;
            }
        });

        res.json({
            labels: ['Or', 'Argent', 'Bronze', 'Participation'],
            data: [
                performance.gold,
                performance.silver,
                performance.bronze,
                performance.participation
            ]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/stats/technique-categories
// @desc    Get technique count by category
// @access  Private
router.get('/technique-categories', protect, async (req, res) => {
    try {
        const techniques = await Technique.find({ userId: req.user._id });

        const categoryMap = {
            'guard': 'Garde',
            'pass': 'Passage',
            'mount': 'Mont',
            'back': 'Dos',
            'side-control': 'Contrôle Latéral',
            'submission': 'Soumission',
            'transition': 'Transition',
            'sweep': 'Balayage',
            'takedown': 'Projection',
            'escape': 'Échappement'
        };

        const categoryCounts = {};
        Object.keys(categoryMap).forEach(key => {
            categoryCounts[key] = 0;
        });

        techniques.forEach(tech => {
            if (categoryCounts.hasOwnProperty(tech.category)) {
                categoryCounts[tech.category]++;
            }
        });

        const labels = [];
        const data = [];
        Object.entries(categoryCounts).forEach(([key, count]) => {
            if (count > 0) {
                labels.push(categoryMap[key]);
                data.push(count);
            }
        });

        res.json({ labels, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/stats/belt-progression
// @desc    Get belt progression timeline
// @access  Private
router.get('/belt-progression', protect, async (req, res) => {
    try {
        const user = await req.user;

        // For now, return current belt info
        // In future, can add beltHistory field to User model
        const beltOrder = ['white', 'blue', 'purple', 'brown', 'black'];
        const beltIndex = beltOrder.indexOf(user.profile.belt);

        const progression = beltOrder.slice(0, beltIndex + 1).map((belt, idx) => ({
            belt: belt.charAt(0).toUpperCase() + belt.slice(1),
            achieved: idx <= beltIndex
        }));

        res.json({
            currentBelt: user.profile.belt,
            stripes: user.profile.stripes,
            progression
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
