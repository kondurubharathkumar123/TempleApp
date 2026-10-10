
import { Router } from 'express';

import {
  getDharmaCategories,
  getDharmaQuestions,
  getDharmaQuestionById,
  createDharmaQuestion,
  createDharmaAnswer,
    toggleDharmaHelpfulVote,
      reportDharmaContent,
       reviewDharmaReport,
       getAdminDharmaReports,
} from '../controllers/dharmaController';

import {
  authenticateToken,
} from '../middleware/authMiddleware';

const router = Router();

// ========================================
// PUBLIC ROUTES
// ========================================

// Get available Dharma categories
router.get('/categories', getDharmaCategories);

// Get approved questions with filters
router.get('/questions', getDharmaQuestions);

// Get a specific question and its answers
router.get('/questions/:id', getDharmaQuestionById);


router.post(
  '/questions/:id/answers',
  authenticateToken,
  createDharmaAnswer
);
// ========================================
// HELPFUL VOTE
// ========================================

router.post(
  '/answers/:answerId/helpful',
  authenticateToken,
  toggleDharmaHelpfulVote
);
// ========================================
// REPORT QUESTION OR ANSWER
// ========================================

router.post(
  '/reports',
  authenticateToken,
  reportDharmaContent
);

// ========================================
// DHARMA REPORT MODERATION
// ========================================

// View reports
router.get(
  '/reports',
  getAdminDharmaReports
);

// Review, dismiss, or hide reported content
router.patch(
  '/reports/:id/review',
  reviewDharmaReport
);


// ========================================
// AUTHENTICATED ROUTES
// ========================================

// Submit a new question for admin approval
router.post(
  '/questions',
  authenticateToken,
  createDharmaQuestion
);

export default router;
