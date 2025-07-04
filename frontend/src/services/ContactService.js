import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Submits the contact form data to the backend
 * @param {Object} data - { name, phone, time, reason }
 * @returns {Promise}
 */
export const submitContactForm = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/submit`, data);
    return response.data;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};
