import express from 'express';
import { AdminService } from '../services/admin.service';
import { authenticateToken } from '../middleware/auth'; // <-- WAJIB UBAH
import { authorizeAdmin } from '../middleware/admin'; // <-- WAJIB UBAH

const router = express.Router();

// Get all users (Admin only)
router.get('/users', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const users = await AdminService.getAllUsers();
    res.json({ users });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;