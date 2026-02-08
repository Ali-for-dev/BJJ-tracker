import express from 'express';
import Training from '../models/Training.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/trainings
// @desc    Get all trainings for user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const trainings = await Training.find({ userId: req.user._id })
            .sort({ date: -1 });

        res.json(trainings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/trainings/stats
// @desc    Get training statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const trainings = await Training.find({ userId: req.user._id });

        const stats = {
            totalSessions: trainings.length,
            totalDuration: trainings.reduce((sum, t) => sum + t.duration, 0),
            totalSubmissionsGiven: trainings.reduce((sum, t) => sum + t.submissionsGiven, 0),
            totalSubmissionsReceived: trainings.reduce((sum, t) => sum + t.submissionsReceived, 0),
            averagePhysicalFeeling: trainings.length > 0
                ? (trainings.reduce((sum, t) => sum + t.physicalFeeling, 0) / trainings.length).toFixed(1)
                : 0,
            averageMentalFeeling: trainings.length > 0
                ? (trainings.reduce((sum, t) => sum + t.mentalFeeling, 0) / trainings.length).toFixed(1)
                : 0,
            typeDistribution: trainings.reduce((acc, t) => {
                acc[t.type] = (acc[t.type] || 0) + 1;
                return acc;
            }, {})
        };

        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/trainings/:id
// @desc    Get single training
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const training = await Training.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (training) {
            res.json(training);
        } else {
            res.status(404).json({ message: 'Training not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/trainings
// @desc    Create new training
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const training = await Training.create({
            userId: req.user._id,
            ...req.body
        });

        res.status(201).json(training);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/trainings/:id
// @desc    Update training
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const training = await Training.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (training) {
            Object.assign(training, req.body);
            const updatedTraining = await training.save();
            res.json(updatedTraining);
        } else {
            res.status(404).json({ message: 'Training not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/trainings/:id
// @desc    Delete training
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const training = await Training.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (training) {
            await training.deleteOne();
            res.json({ message: 'Training removed' });
        } else {
            res.status(404).json({ message: 'Training not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
