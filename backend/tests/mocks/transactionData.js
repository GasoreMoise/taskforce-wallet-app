const mongoose = require('mongoose');

module.exports = {
  validTransaction: {
    amount: 100.50,
    type: 'expense',
    category: new mongoose.Types.ObjectId(),
    account: 'bank',
    description: 'Test transaction'
  },
  
  invalidTransaction: {
    amount: -100,
    type: 'invalid',
    category: 'invalid-id',
    account: 'invalid-account'
  },
  
  updateData: {
    amount: 200.75,
    description: 'Updated transaction'
  },
  
  bulkTransactions: [
    {
      amount: 100,
      type: 'expense',
      category: new mongoose.Types.ObjectId(),
      account: 'bank',
      description: 'Transaction 1'
    },
    {
      amount: 200,
      type: 'income',
      category: new mongoose.Types.ObjectId(),
      account: 'cash',
      description: 'Transaction 2'
    }
  ],
  
  filters: {
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'),
    type: 'expense',
    account: 'bank'
  }
}; 