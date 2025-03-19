import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    phone: '',
    nextOfKin: '',
    nextOfKinPhone: '',
    role: 'patient'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.nextOfKin.trim()) {
      newErrors.nextOfKin = 'Next of kin is required';
    }
    
    if (!formData.nextOfKinPhone) {
      newErrors.nextOfKinPhone = 'Next of kin phone number is required';
    }
    
    return newErrors;
  };

  const handleNextStep = () => {
    const stepErrors = validateStep1();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const stepErrors = validateStep2();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Make the API call to the registration endpoint
      const response = await api.post('/api/auth/signup', formData);
  
      // Check if the response indicates success (status code 2xx)
      if (response.status >= 200 && response.status < 300) {
        // Show success message and redirect to login
        alert('Registration successful! You can now log in.');
        // navigate('/login');
      } else {
        // Handle unexpected response status
        throw new Error('Registration failed. Please try again.');
      }
    } catch (error) {
      // Handle errors from the API call
      setErrors({
        general: error.response?.data?.message || 'Registration failed. Please try again.',
      });
    } finally {
      // Stop loading indicator
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">
              Sign in
            </Link>
          </p>
        </div>
        
        {errors.general && (
          <div className="mb-4 bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{errors.general}</h3>
              </div>
            </div>
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Step indicator */}
          <div className="mb-4">
            <div className="flex items-center">
              <div className={`flex-1 h-2 ${step >= 1 ? 'bg-teal-600' : 'bg-gray-200'} rounded-l-full`}></div>
              <div className={`flex-1 h-2 ${step >= 2 ? 'bg-teal-600' : 'bg-gray-200'} rounded-r-full`}></div>
            </div>
            <div className="flex justify-between mt-1">
              <div className="text-xs text-gray-500">Account Information</div>
              <div className="text-xs text-gray-500">Personal Details</div>
            </div>
          </div>
          
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
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
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
              
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                Next
              </button>
            </>
          )}
          
          {step === 2 && (
            <>
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-2 text-sm text-red-600">{errors.dateOfBirth}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="nextOfKin" className="block text-sm font-medium text-gray-700">
                  Next of Kin Name
                </label>
                <input
                  id="nextOfKin"
                  name="nextOfKin"
                  type="text"
                  value={formData.nextOfKin}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.nextOfKin ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                />
                {errors.nextOfKin && (
                  <p className="mt-2 text-sm text-red-600">{errors.nextOfKin}</p>
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
                  value={formData.nextOfKinPhone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.nextOfKinPhone ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm`}
                />
                {errors.nextOfKinPhone && (
                  <p className="mt-2 text-sm text-red-600">{errors.nextOfKinPhone}</p>
                )}
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Back
                </button>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;