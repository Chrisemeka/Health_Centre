import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

  const validateHospitalForm = () => {
    const errors = {};

    if (!hospitalForm.name.trim()) {
      errors.name = 'Hospital name is required';
    }

    if (!hospitalForm.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(hospitalForm.email)) {
      errors.email = 'Email is invalid';
    }

    if (!hospitalForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    if (!hospitalForm.address.trim()) {
      errors.address = 'Address is required';
    }

    if (!hospitalForm.city.trim()) {
      errors.city = 'City is required';
    }

    if (!hospitalForm.state.trim()) {
      errors.state = 'State is required';
    }

    if (!hospitalForm.country.trim()) {
      errors.country = 'Country is required';
    }

    if (!hospitalForm.adminName.trim()) {
      errors.adminName = 'Admin name is required';
    }

    if (!hospitalForm.adminEmail) {
      errors.adminEmail = 'Admin email is required';
    } else if (!/\S+@\S+\.\S+/.test(hospitalForm.adminEmail)) {
      errors.adminEmail = 'Admin email is invalid';
    }

    return errors;
  };

  const handleRegisterHospital = async (e) => {
    e.preventDefault();

    const errors = validateHospitalForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Registration successful
      alert('Hospital registered successfully. Admin credentials have been sent to the provided email.');
      navigate('/hospitals');
    } catch (error) {
      console.error('Error registering hospital:', error);
      setFormErrors({
        general: 'Failed to register hospital. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Register New Hospital</h1>
        <Link
          to="/superadmin/dashboard"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
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
                    required={field.required}
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

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Admin Information</h3>
            <p className="text-sm text-gray-500 mb-4">
              This user will be the hospital administrator with access to manage doctors and staff.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'adminName', label: 'Admin Name', type: 'text', required: true },
                { id: 'adminEmail', label: 'Admin Email', type: 'email', required: true },
                { id: 'adminPhone', label: 'Admin Phone', type: 'text', required: false },
              ].map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    name={field.id}
                    type={field.type}
                    value={hospitalForm[field.id]}
                    onChange={handleHospitalFormChange}
                    required={field.required}
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
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register Hospital'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HospitalRegistration;