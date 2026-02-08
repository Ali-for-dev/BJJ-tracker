import mongoose from 'mongoose';

const trainingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Training date is required'],
        default: Date.now
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required'],
        min: [1, 'Duration must be at least 1 minute']
    },
    type: {
        type: String,
        enum: ['gi', 'no-gi', 'drilling', 'sparring', 'open-mat', 'competition-prep'],
        required: [true, 'Training type is required']
    },
    techniquesPracticed: [String],
    partners: [String],
    physicalFeeling: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
    },
    mentalFeeling: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
    },
    notes: {
        type: String,
        default: ''
    },
    submissionsGiven: {
        type: Number,
        min: 0,
        default: 0
    },
    submissionsReceived: {
        type: Number,
        min: 0,
        default: 0
    }
}, {
    timestamps: true
});

// Index for faster queries
trainingSchema.index({ userId: 1, date: -1 });

const Training = mongoose.model('Training', trainingSchema);

export default Training;
