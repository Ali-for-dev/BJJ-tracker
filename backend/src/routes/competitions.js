import express from 'express';
import Competition from '../models/Competition.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/competitions
// @desc    Get all competitions for user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { type } = req.query;

        let query = { userId: req.user._id };

        if (type) {
            query.type = type;
        }

        const competitions = await Competition.find(query).sort({ date: -1 });

        res.json(competitions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/competitions/:id
// @desc    Get single competition
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const competition = await Competition.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (competition) {
            res.json(competition);
        } else {
            res.status(404).json({ message: 'Competition not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/competitions
// @desc    Create new competition
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const competition = await Competition.create({
            userId: req.user._id,
            ...req.body
        });

        res.status(201).json(competition);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/competitions/:id
// @desc    Update competition
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const competition = await Competition.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (competition) {
            Object.assign(competition, req.body);
            const updatedCompetition = await competition.save();
            res.json(updatedCompetition);
        } else {
            res.status(404).json({ message: 'Competition not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/competitions/:id
// @desc    Delete competition
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const competition = await Competition.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (competition) {
            await competition.deleteOne();
            res.json({ message: 'Competition removed' });
        } else {
            res.status(404).json({ message: 'Competition not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
