// backend/src/routes/proposalRoutes.js
import express from 'express';
import { 
  createProposal, 
  getClientProposals, 
  getMyProposals,
  getProposalsByJob // Add this for freelancers
} from '../controllers/proposalController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Freelancer: Submit a proposal
router.post('/', verifyToken, createProposal);

// Freelancer: View proposals THEY sent (The "My Proposals" page)
router.get('/my-proposals', verifyToken, getMyProposals);

// Client: View proposals received for THEIR jobs (The "Manage Proposals" page)
router.get('/client', verifyToken, getClientProposals);

router.get('/job/:jobId', verifyToken, getProposalsByJob);

export default router;