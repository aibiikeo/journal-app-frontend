import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { journalApi } from '@features/journalEntry/model/journalApi.js';

export const EntryCard = ({ entry, onBack, onEdit, onSave, onDelete }) => {
  const [editableEntry, setEditableEntry] = useState(entry);
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
      const fetchImages = async () => {
      try {
        const images = await journalApi.getImagesByJournalEntry(entry.userId, entry.id);
        setExistingImages(images);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, [entry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await onSave(editableEntry, newImages);
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await journalApi.deleteImageFromJournalEntry(entry.userId, entry.id, imageId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      {entry.isEditing ? (
        <div>
          <input
            type="text"
            name="title"
            value={editableEntry.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border border-gray-300 rounded-md p-2 mb-4"
          />
          <textarea
            name="content"
            value={editableEntry.content}
            onChange={handleChange}
            placeholder="Content"
            className="w-full border border-gray-300 rounded-md p-2 mb-4"
            rows="5"
          ></textarea>

          {/* Existing Images */}
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">Existing Images</h3>
            <div className="grid grid-cols-2 gap-4">
              {existingImages.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={`/path/to/image/${img.name}`}
                    alt={img.name}
                    className="w-full h-auto rounded-md"
                  />
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Images */}
          <input
            type="file"
            multiple
            onChange={(e) => setNewImages(Array.from(e.target.files))}
            className="mb-4"
          />

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Save
            </button>
            <button
              onClick={onBack}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-2">{entry.title}</h2>
          <p className="text-gray-700 mb-4">{entry.content}</p>
          <p className="text-sm text-gray-500 mb-4">
            <small>{new Date(entry.entryDate).toLocaleDateString()}</small>
          </p>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={onEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(entry.id)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={onBack}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

EntryCard.propTypes = {
  entry: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    entryDate: PropTypes.string.isRequired,
    isEditing: PropTypes.bool,
    userId: PropTypes.number,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
