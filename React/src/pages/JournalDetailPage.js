import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function JournalDetailPage() {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/get-entry/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => setEntry(data))
      .catch(error => {
        console.error('There was an error fetching the entry!', error);
      });
  }, [id]);

  if (!entry) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-5xl text-purple-400 mb-5">{entry.title}</h1>
      <p className="text-gray-300 leading-relaxed mb-2">{entry.content}</p>
      <p className="text-gray-400 mb-4">Tags: {entry.tags.join(', ')}</p>
      <Link to="/" className="no-underline text-blue-400 hover:underline">Home</Link>
    </div>
  );
}

export default JournalDetailPage;