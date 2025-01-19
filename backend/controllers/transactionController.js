const Transaction = require('../models/Transaction');
const Budget = require('../models/Budgets');
const { sendBudgetAlert } = require('../services/emailService');

exports.createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      user: req.user.id
    });

    // Check budget limits
    if (transaction.type === 'expense') {
      const budget = await Budget.findOne({
        user: req.user.id,
        category: transaction.category,
        startDate: { $lte: transaction.date },
        endDate: { $gte: transaction.date }
      });

      if (budget) {
        const totalExpenses = await Transaction.aggregate([
          {
            $match: {
              user: req.user.id,
              category: transaction.category,
              type: 'expense',
              date: { $gte: budget.startDate, $lte: budget.endDate }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]);

        if (totalExpenses[0]?.total > budget.amount) {
          await sendBudgetAlert(req.user.email, budget, totalExpenses[0].total);
        }
      }
    }

    res.status(201).json({
      status: 'success',
      data: transaction
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .populate('category')
      .sort('-date');

    res.status(200).json({
      status: 'success',
      data: transactions
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
}; 