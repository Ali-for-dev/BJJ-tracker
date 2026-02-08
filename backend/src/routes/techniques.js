import express from 'express';
import Technique from '../models/Technique.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/techniques
// @desc    Get all techniques for user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { category, search } = req.query;

        let query = { userId: req.user._id };

        if (category) {
            query.category = category;
        }

        let techniques;
        if (search) {
            techniques = await Technique.find({
                ...query,
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { tags: { $in: [new RegExp(search, 'i')] } }
                ]
            }).sort({ masteryLevel: -1, name: 1 });
        } else {
            techniques = await Technique.find(query).sort({ category: 1, name: 1 });
        }

        res.json(techniques);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/techniques/:id
// @desc    Get single technique
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const technique = await Technique.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (technique) {
            res.json(technique);
        } else {
            res.status(404).json({ message: 'Technique not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/techniques
// @desc    Create new technique
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const technique = await Technique.create({
            userId: req.user._id,
            ...req.body
        });

        res.status(201).json(technique);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/techniques/:id
// @desc    Update technique
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const technique = await Technique.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (technique) {
            Object.assign(technique, req.body);
            const updatedTechnique = await technique.save();
            res.json(updatedTechnique);
        } else {
            res.status(404).json({ message: 'Technique not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/techniques/:id
// @desc    Delete technique
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const technique = await Technique.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (technique) {
            await technique.deleteOne();
            res.json({ message: 'Technique removed' });
        } else {
            res.status(404).json({ message: 'Technique not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
