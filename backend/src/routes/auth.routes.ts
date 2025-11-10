import express from 'express';
import { AuthService } from '../services/auth.service';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Please provide identifier (email/phone) and password' });
    }
    const result = await AuthService.login(identifier, password);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { username, phone, email, password } = req.body;
    if (!username || !phone || !email || !password) {
      return res.status(400).json({ error: 'Please provide username, phone, email, and password' });
    }
    const result = await AuthService.signup(username, phone, email, password);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;