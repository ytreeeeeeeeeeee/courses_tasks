import { Container } from 'inversify';
import BooksRepository from './modules-ts/booksRepository';

const container = new Container();
container.bind(BooksRepository).toSelf();

export default container;