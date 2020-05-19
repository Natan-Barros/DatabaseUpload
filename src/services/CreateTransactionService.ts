import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);
    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && value > total)
      throw new AppError('You dont have enough balance', 400);

    let categoryEntity = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryEntity) {
      categoryEntity = categoryRepository.create({ title: category });
      await categoryRepository.save(categoryEntity);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: categoryEntity,
    });

    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
