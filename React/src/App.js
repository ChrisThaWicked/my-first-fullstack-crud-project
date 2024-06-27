import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.js';
import AddEntryPage from './pages/AddEntryPage.js';
import EditEntryPage from './pages/EditEntryPage.js';
import JournalDetailPage from './pages/JournalDetailPage.js';

function App() {
  return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddEntryPage />} />
        <Route path="/edit/:id" element={<EditEntryPage />} />
        <Route path="/entry/:id" element={<JournalDetailPage />} />
      </Routes>
  );
}

export default App;