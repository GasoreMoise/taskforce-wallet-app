const nodemailer = require('nodemailer');
const User = require('../models/User');
const Budget = require('../models/Budget');
const AppError = require('../utils/AppError');

class NotificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendBudgetAlert(userId, budgetId, currentSpending) {
    try {
      const user = await User.findById(userId);
      const budget = await Budget.findById(budgetId).populate('category');

      if (!user || !budget) {
        throw new AppError('User or budget not found', 404);
      }

      const percentageUsed = (currentSpending / budget.amount) * 100;
      
      await this.transporter.sendMail({
        to: user.email,
        subject: 'Budget Alert',
        html: `
          <h2>Budget Alert for ${budget.category.name}</h2>
          <p>You have used ${percentageUsed.toFixed(2)}% of your budget</p>
          <p>Budget Amount: ${budget.amount}</p>
          <p>Current Spending: ${currentSpending}</p>
          <p>Remaining: ${budget.amount - currentSpending}</p>
        `
      });
    } catch (error) {
      console.error('Failed to send budget alert:', error);
      throw new AppError('Failed to send notification', 500);
    }
  }

  async sendMonthlyReport(userId, reportData) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      await this.transporter.sendMail({
        to: user.email,
        subject: 'Monthly Financial Report',
        html: this.generateMonthlyReportTemplate(reportData)
      });
    } catch (error) {
      console.error('Failed to send monthly report:', error);
      throw new AppError('Failed to send report', 500);
    }
  }

  generateMonthlyReportTemplate(reportData) {
    // Template generation logic here
    return `
      <h2>Monthly Financial Report</h2>
      <div>
        <h3>Summary</h3>
        <p>Total Income: ${reportData.totalIncome}</p>
        <p>Total Expenses: ${reportData.totalExpenses}</p>
        <p>Net Savings: ${reportData.netSavings}</p>
      </div>
      <!-- Additional sections -->
    `;
  }
}

module.exports = new NotificationService();