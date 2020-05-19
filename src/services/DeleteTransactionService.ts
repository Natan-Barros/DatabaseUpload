import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    try {
      const response = await transactionRepository.delete(id);
    } catch (error) {
      throw new AppError('It is not possible to delete this transfer', 400);
    }
  }
}

export default DeleteTransactionService;
