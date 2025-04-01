const express = require('express');
const {
    register,
    uploadEvaluators,
    login,
    logout,
    uploadResearchPaper,
    deleteResearchPaper,
    getResearchPapers,
    approveEvaluator,
    rejectEvaluator,
    rateResearchPaper,
    editResearchPaperRating,
    assignEvaluator,
    getEvaluators,
    getResearchPaperFile,
    checkIfRated,
    getResearchPaperDetails,
    forgotPassword,
    resetPassword,
    getAssignedPapers,
    selectTopThreepapers,
    generateReport,
    downloadExcelReport,
    downloadEvaluatorsExcel,
    deleteAccount

} = require('../controllers/controller');
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const uploadExcel = require('../middlewares/uploadExcel');
const uploadEvaluatorsExcel = require('../middlewares/uploadEvaluators');

const router = express.Router();

// ============================
// User Authentication Routes
// ============================

// Route to register a new user (Any user type)
router.post('/register', register);

// Upload evaluators Excel File
router.post('/upload-evaluators', authMiddleware, uploadEvaluatorsExcel.single('file'), uploadEvaluators);

// Route to log in an admin or evaluator
router.post('/login', login);

// Route to log out an admin or evaluator
router.post('/logout', logout);

// ============================
// Research Paper Routes
// ============================

// Route to upload a research paper (Admin only)
router.post('/upload-research-paper', authMiddleware, upload.single('paper_file'), uploadResearchPaper);

// Route to get all research paper records (Admin & Evaluator)
router.get('/get-papers', authMiddleware, getResearchPapers);

// Route to view a specific research paper file (Admin & Evaluator)
router.get('/get-paper/:filename', authMiddleware, getResearchPaperFile);

// Route to delete a specific research paper (Admin only)
router.delete('/delete-research-paper/:rid', authMiddleware, deleteResearchPaper);

// ============================
// Evaluator Management Routes
// ============================

// Route to get all evaluators with any approval status (Admin only)
router.get('/evaluators', authMiddleware, getEvaluators);

// Route to approve an evaluator with pending status (Admin only)
router.post('/approve/:user_id', authMiddleware, approveEvaluator);

// Route to reject an evaluator with pending status (Admin only)
router.post('/reject/:user_id', authMiddleware, rejectEvaluator);   

// =================================
// Research Paper Evaluation Routes
// =================================

// Route to assign a research paper to an evaluator (Admin only)
router.post('/assign-evaluator', authMiddleware, uploadExcel.single('file'), assignEvaluator);

// Route for an evaluator to rate a research paper (Evaluator only)
router.post('/rate-research-paper', authMiddleware, rateResearchPaper);

// Route for an evaluator to update ratings of research paper (Evaluator only)
router.put('/edit-rating', authMiddleware, editResearchPaperRating);


// Verify if the evaluator has already rated the specified research paper (Admin & Evaluator)
router.get('/check-if-rated/:rid', authMiddleware, checkIfRated); 
// ==========================================
// Example Of Above Route Return Data Format
// ==========================================
// {
    // "rated": false, (True : If Already Rated)
//     "message": "Pending Evaluation" (Evaluation Completed : If True Then Return)
// }



// Retrieve detailed information about the assigned Research Paper, User and Ratings If Given By User (Admin & Evaluator)
router.get('/get-paper-details', authMiddleware, getResearchPaperDetails);
// ==========================================
// Example Of Above Route Return Data Format
// ==========================================
// [
//     {
//         "rid": 12345,
//         "title": "AI vs ML",
//         "author_name": "Rajesh",
//         "post_date": "2025-03-10T13:21:19.000Z",
//         "paper_file": "1741612879503.pdf",
//         "domain": "AI",
//         "EvaluatorAssignments": [
//             {
//                 "eaid": 5,
//                 "User": {
//                     "uid": 2,
//                     "name": "Nishtha",
//                     "email": "n@gmail.com"
//                 }
//             }
//         ],
//         "ResearchPaperRatings": []
//     }
// ]




// ============================
// Password Management Routes
// ============================

// Route to request a password reset email
router.post('/forgot-password', forgotPassword);
// above Route Require valid user email in body and if sucess then email send to email address

// Route to reset the password
router.post('/reset-password/:token', resetPassword);
// in above route if email is send for forgot password after this need to reset the password 
// So from frount end we need url like 
// http://localhost:3000/reset-password/bd56838af17791daa7f15d29daac559dcf90a19f2c2f1530cae0e46ebdc61ed6
// and we also need to pass the password in body 

// Route to delete user account
router.delete('/delete-account', authMiddleware, deleteAccount);


// Route to get research papers assigned to the logged-in evaluator with evaluation status and score
router.get('/assigned-papers', authMiddleware, getAssignedPapers);

// Select Top papers out of Present Evaluated
router.post("/select-top-papers", authMiddleware,selectTopThreepapers);

// for evaluator download report for Sesison vice after select top 3
router.get('/download-report', authMiddleware, generateReport);

// for admin for download whole excel report
router.get('/generate-research-report', authMiddleware,downloadExcelReport);

// for admin for downlaod the evaluator list 
router.get('/evaluatorslist-download', authMiddleware, downloadEvaluatorsExcel);


module.exports = router;
