import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function NoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [summarizing, setSummarizing] = useState(false);

  const fetchNote = async () => {
    try {
      const res = await axios.get(`/api/notes/${id}`);
      setNote(res.data.note);
      setTitle(res.data.note.title);
      setContent(res.data.note.content);
    } catch (err) {
      toast.error('Failed to fetch note');
      navigate('/notes');
    }
  };

  useEffect(() => {
    fetchNote();
    // eslint-disable-next-line
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put(`/api/notes/${id}`, { title, content });
      setNote(res.data.note);
      toast.success('Note updated!');
    } catch (err) {
      toast.error('Failed to update note');
    } finally {
      setSaving(false);
    }
  };

  const handleSummarize = async () => {
    setSummarizing(true);
    toast.loading('Summarizing...', { id: 'summarize' });
    try {
      const res = await axios.post(`/api/notes/${id}/summarize`);
      setNote(res.data.note);
      toast.success('Summary generated!', { id: 'summarize' });
    } catch (err) {
      toast.error('Failed to summarize', { id: 'summarize' });
    } finally {
      setSummarizing(false);
    }
  };

  if (!note) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Note</h2>
      <form onSubmit={handleSave} className="space-y-4 mb-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Content</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={8}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <Link to="/notes" className="ml-4 text-gray-600 hover:underline">Back to Notes</Link>
      </form>
      {note.summary && (
        <div className="bg-gray-50 border-l-4 border-blue-400 p-3 rounded mb-2">
          <div className="font-medium text-blue-700 mb-1">Summary:</div>
          <div className="text-gray-800 whitespace-pre-line">{note.summary}</div>
        </div>
      )}
      <button
        onClick={handleSummarize}
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        disabled={summarizing}
      >
        {summarizing ? 'Summarizing...' : 'Summarize with AI'}
      </button>
    </div>
  );
}

export default NoteDetailPage; 