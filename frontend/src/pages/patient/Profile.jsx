import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
//   const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    bloodType: '',
    allergies: '',
    nextOfKin: '',
    nextOfKinRelation: '',
    nextOfKinPhone: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Simulate API call to fetch user profile
    const fetchUserProfile = async () => {
      setLoading(true);

      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data
        const mockProfile = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '123-456-7890',
          dateOfBirth: '1985-05-15',
          address: '123 Main Street, Anytown, ST 12345',
          bloodType: 'A+',
          allergies: 'Penicillin, Peanuts',
          nextOfKin: 'Jane Doe',
          nextOfKinRelation: 'Spouse',
          nextOfKinPhone: '987-654-3210',
        };

        setProfileData(mockProfile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });

    // Clear any error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });

    // Clear any error for this field
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: '',
      });
    }
  };

  const validateProfileForm = () => {
    const errors = {};

    if (!profileData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!profileData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!profileData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!profileData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    }

    if (!profileData.nextOfKin.trim()) {
      errors.nextOfKin = 'Next of kin is required';
    }

    if (!profileData.nextOfKinPhone.trim()) {
      errors.nextOfKinPhone = 'Next of kin phone is required';
    }

    return errors;
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const errors = validateProfileForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setFormErrors({
        general: 'Failed to update profile. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const errors = validatePasswordForm();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Reset form and close modal
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangePasswordModalOpen(false);

      setSuccessMessage('Password changed successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordErrors({
        general: 'Failed to change password. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">My Profile</h1>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setIsChangePasswordModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Change Password
            </button>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Edit Profile
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile}>
            {/* Personal Information */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
              {formErrors.general && (
                <div className="mb-4 bg-red-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{formErrors.general}</h3>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    required
                    disabled={!isEditing}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                  />
                  {formErrors.firstName && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    required
                    disabled={!isEditing}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                  />
                  {formErrors.lastName && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.lastName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    disabled
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    required
                    disabled={!isEditing}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                  />
                  {formErrors.phone && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={handleProfileChange}
                    required
                    disabled={!isEditing}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      formErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                  />
                  {formErrors.dateOfBirth && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.dateOfBirth}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                    Blood Type
                  </label>
                  <input
                    id="bloodType"
                    name="bloodType"
                    type="text"
                    value={profileData.bloodType}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={2}
                  value={profileData.address}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    formErrors.address ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                />
                {formErrors.address && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.address}</p>
                )}
              </div>

              <div className="mt-6">
                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
                  Allergies
                </label>
                <textarea
                  id="allergies"
                  name="allergies"
                  rows={2}
                  value={profileData.allergies}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  placeholder="List any allergies here"
                  className={`mt-1 block w-full px-3 py-2 border ${
                    formErrors.allergies ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                />
                {formErrors.allergies && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.allergies}</p>
                )}
              </div>

              {isEditing && (
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Next of Kin Information */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Next of Kin Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nextOfKin" className="block text-sm font-medium text-gray-700">
                    Next of Kin Name
                  </label>
                  <input
                    id="nextOfKin"
                    name="nextOfKin"
                    type="text"
                    value={profileData.nextOfKin}
                    onChange={handleProfileChange}
                    required
                    disabled={!isEditing}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      formErrors.nextOfKin ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                  />
                  {formErrors.nextOfKin && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.nextOfKin}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="nextOfKinRelation" className="block text-sm font-medium text-gray-700">
                    Relationship
                  </label>
                  <input
                    id="nextOfKinRelation"
                    name="nextOfKinRelation"
                    type="text"
                    value={profileData.nextOfKinRelation}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      formErrors.nextOfKinRelation ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                  />
                  {formErrors.nextOfKinRelation && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.nextOfKinRelation}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="nextOfKinPhone" className="block text-sm font-medium text-gray-700">
                    Next of Kin Phone
                  </label>
                  <input
                    id="nextOfKinPhone"
                    name="nextOfKinPhone"
                    type="text"
                    value={profileData.nextOfKinPhone}
                    onChange={handleProfileChange}
                    required
                    disabled={!isEditing}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      formErrors.nextOfKinPhone ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                  />
                  {formErrors.nextOfKinPhone && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.nextOfKinPhone}</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Change Password Modal */}
        {isChangePasswordModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
              <form onSubmit={handleChangePassword} className="space-y-4">
                {passwordErrors.general && (
                  <div className="mb-4 bg-red-50 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{passwordErrors.general}</h3>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className={`mt-1 block w-full px-3 py-2 border ${
                      passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-2 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className={`mt-1 block w-full px-3 py-2 border ${
                      passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-2 text-sm text-red-600">{passwordErrors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className={`mt-1 block w-full px-3 py-2 border ${
                      passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsChangePasswordModalOpen(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;