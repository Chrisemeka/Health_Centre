import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-xl mb-10 overflow-hidden shadow-xl">
          <div className="px-6 py-12 md:py-20 md:px-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About HealthConnect</h1>
            <p className="text-lg md:text-xl text-teal-100 max-w-2xl mx-auto">
              A revolutionary approach to centralized patient record management
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <div className="mx-auto bg-teal-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-teal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600">
                To transform healthcare record management by creating a secure, accessible, and centralized system that empowers patients and healthcare providers with the right information at the right time.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <div className="mx-auto bg-teal-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-teal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
              <p className="text-gray-600">
                A world where healthcare is seamlessly integrated through technology, allowing patients to receive optimal care regardless of location, while maintaining the highest standards of data security and privacy.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-16">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                HealthConnect was born from a simple yet powerful observation: in emergency situations, patients often receive suboptimal care because their complete medical history isn't available to healthcare providers.
              </p>
              <p>
                Founded in 2023 by a team of healthcare professionals and technology experts, HealthConnect set out to solve this critical gap in healthcare. The vision was simple: create a secure, centralized system where patient records could be accessed by authorized healthcare providers anywhere, anytime – but only with appropriate consent.
              </p>
              <p>
                After months of research, development, and collaboration with healthcare institutions, HealthConnect emerged as a comprehensive solution that balances accessibility with robust privacy protections. Today, our platform connects millions of patients with thousands of healthcare providers across multiple facilities.
              </p>
              <p>
                We're proud of how far we've come, but we're just getting started. Our mission continues as we work to expand our network, enhance our technology, and ultimately improve patient outcomes worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Security & Privacy</h3>
              </div>
              <p className="text-gray-600">
                We maintain the highest standards of data security and patient privacy, employing end-to-end encryption and strict access controls.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Patient Empowerment</h3>
              </div>
              <p className="text-gray-600">
                We believe patients should have control over their medical data, with transparency about who accesses their information and when.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Innovation</h3>
              </div>
              <p className="text-gray-600">
                We continuously seek new technologies and approaches to improve our platform, staying at the forefront of healthcare technology.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Inclusivity</h3>
              </div>
              <p className="text-gray-600">
                We design our systems to be accessible to all patients and healthcare providers, regardless of technical expertise or background.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Reliability</h3>
              </div>
              <p className="text-gray-600">
                We understand that healthcare never stops, so our systems are built for 24/7 availability with robust backup and disaster recovery protocols.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-teal-100 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Collaboration</h3>
              </div>
              <p className="text-gray-600">
                We foster partnerships with healthcare institutions, government agencies, and technology providers to create an integrated ecosystem of care.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-8">
          <div className="bg-teal-700 rounded-xl overflow-hidden shadow-xl">
            <div className="px-6 py-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Join Our Network</h2>
              <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
                Whether you're a patient looking for better health record management or a healthcare provider seeking to enhance patient care, HealthConnect is here for you.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-teal-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Sign Up as Patient
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Contact for Healthcare Providers
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;