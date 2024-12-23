import { apiClient } from '@shared/api/axios';

export const passwordResetApi = {
  /**
   * Request a password reset for a specific user.
   * This function sends a POST request to initiate the password reset process.
   * @param {number} userId - The ID of the user for whom the password reset is requested.
   * @returns {Promise<string>} A success message indicating the request was processed.
   */
  async requestPasswordReset(userId) {
    console.log('Initiating password reset request...'); // Log the start of the request
    console.log('User ID:', userId); // Log the userId for debugging purposes
    try {
      // Send the POST request to the password reset endpoint
      const response = await apiClient.post(`/password-reset/request/${userId}`);
      console.log('Password reset request response:', response); // Log the full response object
      console.log('Password reset request successful:', response.data); // Log the success response
      return response.data; // Return the server's success message
    } catch (error) {
      console.error('Error details:', error); // Log the full error object for debugging
      console.error('Error requesting password reset:', error.message); // Log the specific error message
      // Throw a user-friendly error message
      throw new Error('Failed to request password reset. Please try again later.');
    }
  },

  /**
   * Reset the password using a provided token and new password.
   * This function sends a POST request with the reset token and new password to complete the reset process.
   * @param {Object} resetData - The data required to reset the password.
   * @param {string} resetData.token - The unique token for password reset verification.
   * @param {string} resetData.newPassword - The new password to set for the user.
   * @returns {Promise<string>} A success message indicating the password was successfully reset.
   */
  async resetPassword({ token, newPassword }) {
    console.log('Initiating password reset...'); // Log the start of the reset process
    console.log('Token:', token); // Log the reset token for debugging purposes
    console.log('New Password (hidden):', newPassword ? '********' : 'Not provided'); // Indicate if the password is provided without revealing it
    try {
      // Send the POST request to the password reset endpoint with the reset data
      const response = await apiClient.post('/password-reset/reset', { token, newPassword });
      console.log('Password reset response:', response); // Log the full response object
      console.log('Password reset successful:', response.data); // Log the success response
      return response.data; // Return the server's success message
    } catch (error) {
      console.error('Error details:', error); // Log the full error object for debugging
      console.error('Error resetting password:', error.message); // Log the specific error message
      // Throw a user-friendly error message
      throw new Error('Failed to reset password. Please try again later.');
    }
  },
};
