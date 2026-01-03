import { getConnection } from '../db/connection.js';

export async function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const db = getConnection();
    const [rows] = await db.execute(
      'SELECT user_id FROM tokens WHERE token = ? AND expires_at > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.userId = rows[0].user_id;
    next();
  } catch (error) {
    console.error('Error authenticating token:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
}

