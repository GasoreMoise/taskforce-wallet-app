const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendBudgetAlert = async (userEmail, budget, currentAmount) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Budget Alert',
      html: `
        <h1>Budget Limit Exceeded</h1>
        <p>Your budget of ${budget.amount} has been exceeded.</p>
        <p>Current spending: ${currentAmount}</p>
        <p>Category: ${budget.category}</p>
      `
    });
  } catch (error) {
    console.error('Email sending failed:', error);
  }
}; 