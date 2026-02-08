import mongoose from 'mongoose';

const competitionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Competition name is required'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Competition date is required']
    },
    type: {
        type: String,
        enum: ['past', 'upcoming'],
        required: true
    },
    division: {
        type: String,
        default: ''
    },
    weightClass: {
        type: String,
        default: ''
    },
    result: {
        type: String,
        enum: ['gold', 'silver', 'bronze', 'participation', 'pending', ''],
        default: 'pending'
    },
    opponents: [String],
    gamePlan: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Index for queries
competitionSchema.index({ userId: 1, date: -1 });

const Competition = mongoose.model('Competition', competitionSchema);

export default Competition;
