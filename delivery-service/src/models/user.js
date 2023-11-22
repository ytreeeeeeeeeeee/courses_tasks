import { model, Schema } from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
        select: false,
    },
    name: {
        type: String,
        required: true,
    },
    contactPhone: {
        type: String,
        required: true,
    },
}, {versionKey: false});

userSchema.methods.verifyPassword = async function(password) {
    const user = await model('User').findById(this._id).select('passwordHash');
    const result = await bcrypt.compare(password, user.passwordHash);
    return result;
}

const userModel = model('User', userSchema);

export default userModel;