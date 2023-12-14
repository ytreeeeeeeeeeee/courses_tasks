import { Document, Schema, model } from "mongoose";
import { IUser } from "../interfaces/user";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
    },
    emails: [
        {
            value: {
                type: String,
            }
        }
    ],
});

userSchema.pre('save', function(next) {
    this.displayName = this.displayName || this.username;
    next();
});

userSchema.methods.verifyPassword = function(password: string): boolean {
    return password === this.password;
}

const userModel = model<IUser & Document>('User', userSchema);

export default userModel;
