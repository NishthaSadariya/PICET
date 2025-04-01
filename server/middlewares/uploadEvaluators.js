const multer = require('multer');
const path = require('path');

// Configure storage for evaluator uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/excel/'); // Store uploads in 'uploads/' directory
    },
    filename: (req, file, cb) => {
        cb(null, `evaluators_${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File filter to allow only Excel files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.mimetype === 'application/vnd.ms-excel') {
        cb(null, true);
    } else {
        cb(new Error('Only Excel files are allowed!'), false);
    }
};

// Initialize multer with storage and file filter
const uploadEvaluators = multer({
    storage,
    fileFilter
});

module.exports = uploadEvaluators;
