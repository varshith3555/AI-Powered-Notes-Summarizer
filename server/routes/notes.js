const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { validateNote } = require('../middleware/validation');
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  generateNoteSummary,
  getStats
} = require('../controllers/noteController');

// All routes require authentication
router.use(auth);

// Get all notes with pagination, search, and filtering
router.get('/', getNotes);

// Get single note
router.get('/:id', getNote);

// Create new note
router.post('/', validateNote, createNote);

// Update note
router.put('/:id', validateNote, updateNote);

// Delete note
router.delete('/:id', deleteNote);

// Generate AI summary for note
router.post('/:id/summarize', generateNoteSummary);

// Get user statistics
router.get('/stats/overview', getStats);

module.exports = router; 