import { Schema, model } from "mongoose";

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
    this.emails.value = `${this.emails.value || this.username}@gmail.com`;
    next();
});

userSchema.methods.verifyPassword = function(password) {
    return password === this.password;
}

const userModel = model('User', userSchema);

export default userModel;
