import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function NotesPage() {
  const { user, loading } = useAuth();
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  const fetchNotes = async () => {
    setFetching(true);
    try {
      const res = await axios.get('/api/notes');
      setNotes(res.data.notes);
    } catch (err) {
      toast.error('Failed to fetch notes');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!loading && user) fetchNotes();
  }, [user, loading]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await axios.post('/api/notes', { title, content });
      setTitle('');
      setContent('');
      toast.success('Note created!');
      setNotes([res.data.note, ...notes]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create note');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await axios.delete(`/api/notes/${id}`);
      setNotes(notes.filter(n => n._id !== id));
      toast.success('Note deleted');
    } catch (err) {
      toast.error('Failed to delete note');
    }
  };

  const handleSummarize = async (id) => {
    toast.loading('Summarizing...', { id: 'summarize' });
    try {
      const res = await axios.post(`/api/notes/${id}/summarize`);
      setNotes(notes.map(n => n._id === id ? res.data.note : n));
      toast.success('Summary generated!', { id: 'summarize' });
    } catch (err) {
      toast.error('Failed to summarize', { id: 'summarize' });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div className="text-center">Please <Link to="/login" className="text-blue-600">login</Link> to view your notes.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Notes</h2>
      <form onSubmit={handleCreate} className="mb-6 bg-white p-4 rounded shadow space-y-2">
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-2"
          placeholder="Title (optional)"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border px-3 py-2 rounded"
          placeholder="Write or paste your note here..."
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
          disabled={creating}
        >
          {creating ? 'Adding...' : 'Add Note'}
        </button>
      </form>
      {fetching ? (
        <div>Loading notes...</div>
      ) : notes.length === 0 ? (
        <div>No notes yet.</div>
      ) : (
        <div className="space-y-4">
          {notes.map(note => (
            <div key={note._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center mb-2">
                <Link to={`/notes/${note._id}`} className="font-semibold text-lg hover:underline">{note.title}</Link>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/notes/${note._id}`)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(note._id)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
              <div className="mb-2 text-gray-700 whitespace-pre-line">{note.content.slice(0, 200)}{note.content.length > 200 ? '...' : ''}</div>
              {note.summary && (
                <div className="bg-gray-50 border-l-4 border-blue-400 p-2 rounded mb-2">
                  <div className="font-medium text-blue-700 mb-1">Summary:</div>
                  <div className="text-gray-800 whitespace-pre-line">{note.summary}</div>
                </div>
              )}
              <button
                onClick={() => handleSummarize(note._id)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                disabled={!!note.summary}
              >
                {note.summary ? 'Summarized' : 'Summarize with AI'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotesPage; 