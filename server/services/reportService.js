const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Report = require('../models/Report');
const AppError = require('../utils/AppError');

class ReportService {
  static async generateTransactionReport(userId, filters) {
    const { startDate, endDate, categories, accounts, type } = filters;
    
    const matchQuery = {
      user: userId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    };

    if (categories?.length) matchQuery.category = { $in: categories };
    if (accounts?.length) matchQuery.account = { $in: accounts };
    if (type) matchQuery.type = type;

    const report = await Transaction.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            category: '$category',
            type: '$type'
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          transactions: { $push: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id.category',
          foreignField: '_id',
          as: 'categoryDetails'
        }
      }
    ]);

    return report;
  }

  static async generateBudgetReport(userId, filters) {
    const { startDate, endDate, categories } = filters;

    const budgets = await Budget.find({
      user: userId,
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) },
      ...(categories?.length && { category: { $in: categories } })
    }).populate('category');

    const transactions = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
          ...(categories?.length && { category: { $in: categories } })
        }
      },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$amount' }
        }
      }
    ]);

    return {
      budgets,
      transactions,
      analysis: this.analyzeBudgetPerformance(budgets, transactions)
    };
  }

  static analyzeBudgetPerformance(budgets, transactions) {
    return budgets.map(budget => {
      const spent = transactions.find(t => 
        t._id.toString() === budget.category._id.toString()
      )?.totalSpent || 0;

      return {
        category: budget.category.name,
        budgeted: budget.amount,
        spent,
        remaining: budget.amount - spent,
        percentageUsed: (spent / budget.amount) * 100
      };
    });
  }

  static async saveReport(userId, reportData) {
    const report = await Report.create({
      user: userId,
      ...reportData
    });

    return report;
  }
}

module.exports = ReportService; 