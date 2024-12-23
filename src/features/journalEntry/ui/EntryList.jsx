import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { journalApi } from '@features/journalEntry/model/journalApi.js';
import { EntryCard } from '@entities/journalEntry/ui/EntryCard.jsx';

export const EntryList = ({ userId, token }) => {
  const [entries, setEntries] = useState([]); // List of journal entries
  const [selectedEntry, setSelectedEntry] = useState(null); // Currently selected entry
  const [creatingNewEntry, setCreatingNewEntry] = useState(false); // State for creating a new entry
  const [newEntry, setNewEntry] = useState({ title: '', content: '' }); // State for new entry data
  const [newImages, setNewImages] = useState([]); // Images for new entry

  // Fetch journal entries from the API
  const fetchEntries = async () => {
    try {
      const data = await journalApi.getAllJournalEntriesByUser(userId, token);
      setEntries(data);
    } catch (error) {
      console.error('[EntryList] Error fetching entries:', error);
    }
  };

  // Fetch entries on component mount
  useEffect(() => {
    fetchEntries();
  }, []);

  // Handler for starting a new entry
  const handleNewEntry = () => setCreatingNewEntry(true);

  // Save the new entry to the database
  const handleSaveNewEntry = async () => {
    if (!newEntry.title || !newEntry.content) {
      alert('Title and Content are required.');
      return;
    }

    try {
      await journalApi.createJournalEntryByUser(
        userId,
        token,
        { title: newEntry.title, content: newEntry.content, entryDate: new Date().toISOString() },
        newImages
      );
      fetchEntries(); // Refresh the entries list
      setNewEntry({ title: '', content: '' }); // Reset new entry state
      setNewImages([]); // Clear images
      setCreatingNewEntry(false); // Exit creation mode
    } catch (error) {
      console.error('[EntryList] Error creating new entry:', error);
      alert('Failed to create a new entry. Please try again.');
    }
  };

  // Handler for going back to the entries list
  const handleBack = () => setSelectedEntry(null);

  // Handler for selecting an entry
  const handleSelectEntry = (entry) => setSelectedEntry(entry);

  return (
    <div className="container mx-auto p-6 min-h-screen flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Journal Entries</h2>
        <button
          onClick={handleNewEntry}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200 ease-in-out"
        >
          New Entry
        </button>
      </div>

      {/* Create New Entry Form */}
      {creatingNewEntry && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Create New Entry</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveNewEntry();
              }}
              className="space-y-4"
            >
              {/* Title Input */}
              <input
                type="text"
                placeholder="Title"
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              {/* Content Textarea */}
              <textarea
                placeholder="Content"
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="5"
                required
              ></textarea>

              {/* Image Upload */}
              <input
                type="file"
                multiple
                onChange={(e) => setNewImages(Array.from(e.target.files))}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              />

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition duration-200 ease-in-out"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setCreatingNewEntry(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition duration-200 ease-in-out"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Entry Details or Entry List */}
      {!creatingNewEntry && selectedEntry ? (
        <EntryCard
          entry={selectedEntry}
          onBack={handleBack}
          onEdit={() => setSelectedEntry((prev) => ({ ...prev, isEditing: true }))}
          onSave={async (editedEntry, updatedImages) => {
            try {
              await journalApi.updateJournalEntryByUser(
                userId,
                editedEntry.id,
                token,
                {
                  title: editedEntry.title,
                  content: editedEntry.content,
                  entryDate: editedEntry.entryDate,
                },
                updatedImages
              );
              fetchEntries();
              setSelectedEntry(null); // Exit editing mode
            } catch (error) {
              console.error('[EntryList] Error saving entry:', error);
              alert('Failed to save changes.');
            }
          }}
          onDelete={async (id) => {
            try {
              await journalApi.deleteJournalEntry(userId, id);
              fetchEntries(); // Refresh entries
              setSelectedEntry(null);
            } catch (error) {
              console.error('[EntryList] Error deleting entry:', error);
              alert('Failed to delete entry.');
            }
          }}
        />
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => handleSelectEntry(entry)}
            >
              <h3 className="text-lg font-semibold mb-2">{entry.title}</h3>
              <small className="text-gray-500">{new Date(entry.entryDate).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

EntryList.propTypes = {
  userId: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
};
