import 'reflect-metadata';
import { injectable } from 'inversify';
import { IUser } from '../interfaces/user';
import User from '../models/user';

interface CreateUserDto {
    userName: IUser['username'];
    password: IUser['password'];
    displayName?: IUser['displayName'];
    emails: IUser['emails'];
}

@injectable()
class UserModule {
    async createUser(user: CreateUserDto): Promise<IUser> {
        const newUser = new User(user);
    
        await newUser.save();

        return newUser;
    }
}

export default UserModule;