import {Schema, model} from 'mongoose';

const advertismentSchema = new Schema({
    shortTitle: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    images: {
        type: [String],
    },
    userId: {
        type: Schema.ObjectId,
        required: true,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
    tags: {
        type: [String],
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    }
}, {versionKey: false});

const advertismentModel = model('Advertisment', advertismentSchema);

export default advertismentModel;