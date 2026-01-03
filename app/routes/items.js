import express from 'express';
import { getConnection } from '../db/connection.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET all items
router.get('/', async (req, res) => {
  try {
    const db = getConnection();
    const [rows] = await db.execute(
      'SELECT * FROM items ORDER BY id DESC',
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// GET single item by id
router.get('/:id', async (req, res) => {
  try {
    const db = getConnection();
    const [rows] = await db.execute(
      'SELECT * FROM items WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// POST create new item
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const db = getConnection();
    const [result] = await db.execute(
      'INSERT INTO items (name, description) VALUES (?, ?)',
      [name, description || '']
    );

    const [newItem] = await db.execute('SELECT * FROM items WHERE id = ?', [result.insertId]);
    res.status(201).json(newItem[0]);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PUT update item
router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const id = req.params.id;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const db = getConnection();
    const [result] = await db.execute(
      'UPDATE items SET name = ?, description = ? WHERE id = ?',
      [name, description || '', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const [updatedItem] = await db.execute('SELECT * FROM items WHERE id = ?', [id]);
    res.json(updatedItem[0]);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE item
router.delete('/:id', async (req, res) => {
  try {
    const db = getConnection();
    const [result] = await db.execute(
      'DELETE FROM items WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

export default router;

