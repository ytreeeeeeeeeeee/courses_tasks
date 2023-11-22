import User from '../models/user.js';

const create = async ({email, passwordHash, name, contactPhone}) => {
    try{
        const newUser = new User({
            email,
            passwordHash,
            name,
            contactPhone,
        });
        
        await newUser.save();

        const newUserWithoutPassword = newUser.toJSON();
        delete newUserWithoutPassword.passwordHash;

        return newUserWithoutPassword;
    } catch (e) {
        throw e;
    }
};

const findByEmail = async (email) => {
    try {
        const user = await User.findOne({email}).select('-__v');

        return user || null;
    } catch (e) {
        throw e;
    }
};

const UserModule = {create, findByEmail};

export default UserModule;