import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

const HospitalRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Form state
  const [hospitalForm, setHospitalForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleHospitalFormChange = (e) => {
    const { name, value } = e.target;
    setHospitalForm({
      ...hospitalForm,
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

  // const validateHospitalForm = () => {
  //   const errors = {};

  //   if (!hospitalForm.name.trim()) {
  //     errors.name = 'Hospital name is required';
  //   }

  //   if (!hospitalForm.email) {
  //     errors.email = 'Email is required';
  //   } else if (!/\S+@\S+\.\S+/.test(hospitalForm.email)) {
  //     errors.email = 'Email is invalid';
  //   }

  //   if (!hospitalForm.phone.trim()) {
  //     errors.phone = 'Phone number is required';
  //   }

  //   if (!hospitalForm.address.trim()) {
  //     errors.address = 'Address is required';
  //   }

  //   if (!hospitalForm.city.trim()) {
  //     errors.city = 'City is required';
  //   }

  //   if (!hospitalForm.state.trim()) {
  //     errors.state = 'State is required';
  //   }

  //   if (!hospitalForm.country.trim()) {
  //     errors.country = 'Country is required';
  //   }

  //   if (!hospitalForm.adminName.trim()) {
  //     errors.adminName = 'Admin name is required';
  //   }

  //   if (!hospitalForm.adminEmail) {
  //     errors.adminEmail = 'Admin email is required';
  //   } else if (!/\S+@\S+\.\S+/.test(hospitalForm.adminEmail)) {
  //     errors.adminEmail = 'Admin email is invalid';
  //   }

  //   return errors;
  // };

  const handleRegisterHospital = async (e) => {
    e.preventDefault();
    console.log('Form submission triggered');

    // const errors = validateHospitalForm();
    // if (Object.keys(errors).length > 0) {
    //   setFormErrors(errors);
    //   return;
    // }

    setLoading(true);

    try {
      // Prepare data for API submission
      const hospitalData = {
        name: hospitalForm.name,
        email: hospitalForm.email,
        phone: hospitalForm.phone,
        address: hospitalForm.address,
        city: hospitalForm.city,
        state: hospitalForm.state,
        country: hospitalForm.country,
        admin: {
          name: hospitalForm.adminName,
          email: hospitalForm.adminEmail,
          phone: hospitalForm.adminPhone || undefined
        }
      };

      // Send data to API
      const response = await api.post('/api/admin/hospitals', hospitalData);
      console.log('Hospital registered successfully:', response.data);

      // Show success message
      setSuccessMessage('Hospital registered successfully. Admin credentials have been sent to the provided email.');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/hospitals');
      }, 2000);
    } catch (error) {
      console.error('Error registering hospital:', error);
      
      // Handle API validation errors
      if (error.response && error.response.data && error.response.data.errors) {
        // If the API returns specific field errors
        const apiErrors = {};
        
        error.response.data.errors.forEach(err => {
          // Map API error fields to form fields
          let fieldName = err.field;
          if (fieldName.startsWith('admin.')) {
            fieldName = fieldName.replace('admin.', 'admin');
          }
          apiErrors[fieldName] = err.message;
        });
        
        setFormErrors(apiErrors);
      } else if (error.response && error.response.data && error.response.data.message) {
        // If the API returns a general error message
        setFormErrors({
          general: error.response.data.message
        });
      } else {
        // Generic error handling
        setFormErrors({
          general: 'Failed to register hospital. Please try again.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Register New Hospital</h1>
        <Link
          to="/admin/dashboard"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
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

        <form onSubmit={handleRegisterHospital} className="space-y-6">
          {formErrors.general && (
            <div className="bg-red-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{formErrors.general}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium text-gray-900">Hospital Information</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'name', label: 'Hospital Name', type: 'text', required: true },
                { id: 'email', label: 'Hospital Email', type: 'email', required: true },
                { id: 'phone', label: 'Hospital Phone', type: 'text', required: true },
                { id: 'address', label: 'Hospital Address', type: 'text', required: true, fullWidth: true },
                { id: 'city', label: 'City', type: 'text', required: true },
                { id: 'state', label: 'State/Province', type: 'text', required: true },
                { id: 'country', label: 'Country', type: 'text', required: true },
              ].map((field) => (
                <div key={field.id} className={field.fullWidth ? 'md:col-span-2' : ''}>
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    value={hospitalForm[field.id]}
                    onChange={handleHospitalFormChange}
                    required
                    className={`mt-1 block w-full px-3 py-2 border ${
                      formErrors[field.id] ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  />
                  {formErrors[field.id] && (
                    <p className="mt-2 text-sm text-red-600">{formErrors[field.id]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Link
              to="/hospitals"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                'Register Hospital'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HospitalRegistration;