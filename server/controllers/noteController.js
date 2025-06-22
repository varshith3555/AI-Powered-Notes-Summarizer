const Note = require('../models/Note');
const { generateSummary, generateTitle, extractTags } = require('../utils/openai');

// Get all notes for user
const getNotes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tags, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = { user: req.user._id };
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const notes = await Note.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'username email');
    
    const total = await Note.countDocuments(query);
    
    res.json({
      notes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalNotes: total
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({
      message: 'Error fetching notes',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get single note
const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('user', 'username email');
    
    if (!note) {
      return res.status(404).json({
        message: 'Note not found'
      });
    }
    
    res.json({ note });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      message: 'Error fetching note',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Create new note
const createNote = async (req, res) => {
  try {
    const { title, content, tags, isPublic } = req.body;
    
    // Generate title if not provided
    let finalTitle = title;
    if (!title && content) {
      try {
        finalTitle = await generateTitle(content);
      } catch (error) {
        finalTitle = 'Untitled Note';
      }
    }
    
    // Extract tags if not provided
    let finalTags = tags || [];
    if (!tags && content) {
      try {
        finalTags = await extractTags(content);
      } catch (error) {
        finalTags = [];
      }
    }
    
    const note = new Note({
      user: req.user._id,
      title: finalTitle,
      content,
      tags: finalTags,
      isPublic: isPublic || false
    });
    
    await note.save();
    
    const populatedNote = await Note.findById(note._id).populate('user', 'username email');
    
    res.status(201).json({
      message: 'Note created successfully',
      note: populatedNote
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      message: 'Error creating note',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update note
const updateNote = async (req, res) => {
  try {
    const { title, content, tags, isPublic } = req.body;
    
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!note) {
      return res.status(404).json({
        message: 'Note not found'
      });
    }
    
    // Update fields
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (isPublic !== undefined) note.isPublic = isPublic;
    
    await note.save();
    
    const updatedNote = await Note.findById(note._id).populate('user', 'username email');
    
    res.json({
      message: 'Note updated successfully',
      note: updatedNote
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      message: 'Error updating note',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!note) {
      return res.status(404).json({
        message: 'Note not found'
      });
    }
    
    res.json({
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      message: 'Error deleting note',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Generate AI summary
const generateNoteSummary = async (req, res) => {
  try {
    const { model = 'gpt-3.5-turbo' } = req.body;
    
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!note) {
      return res.status(404).json({
        message: 'Note not found'
      });
    }
    
    if (!note.content) {
      return res.status(400).json({
        message: 'Note has no content to summarize'
      });
    }
    
    // Generate summary using OpenAI
    const summary = await generateSummary(note.content, model);
    
    // Update note with summary
    note.summary = summary;
    note.lastSummarized = new Date();
    note.aiModel = model;
    await note.save();
    
    const updatedNote = await Note.findById(note._id).populate('user', 'username email');
    
    res.json({
      message: 'Summary generated successfully',
      note: updatedNote
    });
  } catch (error) {
    console.error('Generate summary error:', error);
    res.status(500).json({
      message: 'Error generating summary',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get user statistics
const getStats = async (req, res) => {
  try {
    const stats = await Note.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalNotes: { $sum: 1 },
          totalWords: { $sum: '$wordCount' },
          totalSummaryWords: { $sum: '$summaryWordCount' },
          notesWithSummary: {
            $sum: { $cond: [{ $ne: ['$summary', ''] }, 1, 0] }
          }
        }
      }
    ]);
    
    const tagStats = await Note.aggregate([
      { $match: { user: req.user._id } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      stats: stats[0] || {
        totalNotes: 0,
        totalWords: 0,
        totalSummaryWords: 0,
        notesWithSummary: 0
      },
      tagStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      message: 'Error fetching statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  generateNoteSummary,
  getStats
}; 