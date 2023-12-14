import { Container } from 'inversify';
import BooksRepository from '../modules-ts/booksRepository';
import UserModule from '../modules-ts/userModule';

const container = new Container();
container.bind(BooksRepository).toSelf();
container.bind(UserModule).toSelf();

export default container;