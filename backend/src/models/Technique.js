import mongoose from 'mongoose';

const techniqueSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Technique name is required'],
        trim: true
    },
    category: {
        type: String,
        enum: ['guard', 'pass', 'mount', 'back', 'side-control', 'submission', 'transition', 'sweep', 'takedown', 'escape'],
        required: [true, 'Category is required']
    },
    subcategory: {
        type: String,
        default: ''
    },
    masteryLevel: {
        type: Number,
        min: 1,
        max: 5,
        default: 1
    },
    notes: {
        type: String,
        default: ''
    },
    videoLinks: [String],
    tags: [String],
    successCount: {
        type: Number,
        min: 0,
        default: 0
    },
    attemptCount: {
        type: Number,
        min: 0,
        default: 0
    }
}, {
    timestamps: true
});

// Index for searching
techniqueSchema.index({ userId: 1, category: 1, name: 'text' });

// Virtual for success rate
techniqueSchema.virtual('successRate').get(function () {
    if (this.attemptCount === 0) return 0;
    return Math.round((this.successCount / this.attemptCount) * 100);
});

// Ensure virtuals are included in JSON
techniqueSchema.set('toJSON', { virtuals: true });
techniqueSchema.set('toObject', { virtuals: true });

const Technique = mongoose.model('Technique', techniqueSchema);

export default Technique;
