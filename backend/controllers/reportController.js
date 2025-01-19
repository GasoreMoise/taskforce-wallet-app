const Transaction = require('../models/Transaction');

exports.getSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const summary = await Transaction.aggregate([
      {
        $match: {
          user: req.user.id,
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: {
            type: '$type',
            category: '$category',
            account: '$account'
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.type',
          categories: {
            $push: {
              category: '$_id.category',
              account: '$_id.account',
              total: '$total',
              count: '$count'
            }
          },
          totalAmount: { $sum: '$total' }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: summary
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
}; 