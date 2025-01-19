const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middlewares/auth');
const { validateReportGeneration } = require('../middlewares/validate');

router.use(protect);

// Generate reports
router.post('/generate', validateReportGeneration, reportController.getSummary);


module.exports = router; 