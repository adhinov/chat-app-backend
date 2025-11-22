import { Request, Response, NextFunction } from 'express';

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user as any; // `user` is attached by auth middleware
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(403).json({ error: 'Access denied.' });
  }
};