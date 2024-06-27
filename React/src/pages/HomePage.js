import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = () => {
    fetch('http://localhost:4000/get-entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => setEntries(data))
      .catch(error => {
        console.error('There was an error fetching the entries!', error);
      });
  };

  const deleteEntry = (id) => {
    fetch(`http://localhost:4000/delete-entry/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(() => {
        setEntries(entries.filter(entry => entry.id !== id));
        setSearchTerm(''); // Clear search field after deleting an entry
      })
      .catch(error => {
        console.error('There was an error deleting the entry!', error);
      });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEntries = entries.filter(entry => {
    const searchTermLower = searchTerm.toLowerCase().trim();
    if (!searchTermLower) return true; // Show all entries if search term is empty
  
    // Check for specific matches in title or any tag
    const titleMatch = entry.title.toLowerCase().startsWith(searchTermLower);
    const tagMatch = entry.tags.some(tag => {
      const tagsLower = tag.toLowerCase();
      return tagsLower.startsWith(searchTermLower);
    });
  
    return titleMatch || tagMatch;
  });  

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search by title or tag"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 rounded bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:border-purple-500"
        />
      </div>
      <h1 className="text-5xl text-purple-400 mb-5">Journal Entries</h1>
      <Link to="/add" className="inline-block bg-purple-600 text-white py-2 px-4 rounded mb-4 no-underline hover:bg-purple-700">Add New Entry</Link>
      <ul className="space-y-4">
        {filteredEntries.map(entry => (
          <li key={entry.id} className="bg-gray-800 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-100 mb-2">{entry.title}</h2>
            <p className="text-gray-300 leading-relaxed mb-2">{entry.content.substring(0, 100)}...</p>
            <p className="text-gray-400 mb-4">Tags: {entry.tags.join(', ')}</p>
            <div className="flex space-x-4">
              <Link to={`/entry/${entry.id}`} className="text-blue-400 hover:underline">View</Link>
              <Link to={`/edit/${entry.id}`} className="text-blue-400 hover:underline">Edit</Link>
              <button onClick={() => deleteEntry(entry.id)} className="text-red-400 hover:underline">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;