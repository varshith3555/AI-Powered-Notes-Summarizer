const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Note title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Note content is required'],
    trim: true,
    maxlength: [10000, 'Content cannot exceed 10,000 characters']
  },
  summary: {
    type: String,
    trim: true,
    maxlength: [2000, 'Summary cannot exceed 2,000 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  wordCount: {
    type: Number,
    default: 0
  },
  summaryWordCount: {
    type: Number,
    default: 0
  },
  lastSummarized: {
    type: Date,
    default: null
  },
  aiModel: {
    type: String,
    default: 'gpt-3.5-turbo'
  }
}, {
  timestamps: true
});

// Calculate word count before saving
noteSchema.pre('save', function(next) {
  if (this.content) {
    this.wordCount = this.content.split(/\s+/).filter(word => word.length > 0).length;
  }
  if (this.summary) {
    this.summaryWordCount = this.summary.split(/\s+/).filter(word => word.length > 0).length;
  }
  next();
});

// Index for better query performance
noteSchema.index({ user: 1, createdAt: -1 });
noteSchema.index({ user: 1, tags: 1 });

// Virtual for reading time (average 200 words per minute)
noteSchema.virtual('readingTime').get(function() {
  return Math.ceil(this.wordCount / 200);
});

// Virtual for summary reading time
noteSchema.virtual('summaryReadingTime').get(function() {
  return Math.ceil(this.summaryWordCount / 200);
});

// Ensure virtuals are serialized
noteSchema.set('toJSON', { virtuals: true });
noteSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Note', noteSchema); 