import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditEntryPage() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:4000/get-entry/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(entry => {
        setTitle(entry.title);
        setContent(entry.content);
        setTags(entry.tags.join(', '));
      })
      .catch(error => {
        console.error('There was an error fetching the entry!', error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = tags.split(',').map(tag => tag.trim());
    fetch(`http://localhost:4000/update-entry/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, content, tags: tagsArray })
    })
      .then(response => response.json())
      .then(() => {
        navigate('/');
      })
      .catch(error => {
        console.error('There was an error updating the entry!', error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-5xl text-purple-400 mb-5">Edit Entry</h1>
      <form onSubmit={handleSubmit} className="bg-gray-800 shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:border-purple-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:border-purple-500"
            rows="10"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="tags">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:border-purple-500"
          />
        </div>
        <button type="submit" className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">Update Entry</button>
      </form>
    </div>
  );
}

export default EditEntryPage;