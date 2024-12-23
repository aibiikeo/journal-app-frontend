import { apiClient } from '@shared/api/axios';

const BASE_URL = 'http://localhost:8080/journal-entries';

export const journalApi = {
  // Fetch all journal entries for a user
  getAllJournalEntriesByUser: async (userId, token) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      throw error;
    }
  },

  // Fetch a specific journal entry by user ID and entry ID
  getJournalEntryByUserById: async (userId, id, token) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/${userId}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching journal entry:', error);
      throw error;
    }
  },

  // Create a new journal entry with optional images
  createJournalEntryByUser: async (userId, token, journalEntryDto, images) => {
    try {
      const formData = new FormData();
      formData.append('journalEntryDto', new Blob([JSON.stringify(journalEntryDto)], { type: 'application/json' }));
      images.forEach((image) => formData.append('images', image));

      const response = await apiClient.post(`${BASE_URL}/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating new journal entry:', error);
      throw error;
    }
  },

  // Update a journal entry with optional images
  updateJournalEntryByUser: async (userId, id, token, journalEntryDto, images) => {
    try {
      const formData = new FormData();
      formData.append('journalEntryDto', new Blob([JSON.stringify(journalEntryDto)], { type: 'application/json' }));
      images.forEach((image) => formData.append('images', image));

      const response = await apiClient.put(`${BASE_URL}/${userId}/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error updating journal entry:', error);
      throw error;
    }
  },

  // Delete a journal entry by user ID and entry ID
  deleteJournalEntry: async (userId, id) => {
    try {
      await apiClient.delete(`${BASE_URL}/${userId}/${id}`);
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      throw new Error('Failed to delete journal entry. Please try again later.');
    }
  },

  // Fetch images for a specific journal entry
  getImagesByJournalEntry: async (userId, id) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/images/${userId}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching images by journal entry:', error);
      throw error;
    }
  },

  // Delete a specific image from a journal entry
  deleteImageFromJournalEntry: async (userId, id, imageId, token) => {
    try {
      await apiClient.delete(`${BASE_URL}/${userId}/${id}/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Error deleting image from journal entry:', error);
      throw error;
    }
  },

  // Upload images separately
  uploadImages: async (images) => {
    try {
      const formData = new FormData();
      images.forEach((image) => formData.append('images', image));

      const response = await apiClient.post(`${BASE_URL}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  },

  // Fetch a specific image with optional resizing parameters
  getImage: async (fileName, width, height) => {
    try {
      const params = {};
      if (width && height) {
        params.width = width;
        params.height = height;
      }

      const response = await apiClient.get(`${BASE_URL}/images/${fileName}`, {
        responseType: 'arraybuffer', // Needed to handle binary data
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching image:', error);
      throw error;
    }
  },
};
