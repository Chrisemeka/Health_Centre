{/* Confirmed Appointments Table */}
<table className="min-w-full divide-y divide-gray-200">
  <thead>
    <tr>
      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Doctor
      </th>
      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Hospital
      </th>
      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Date
      </th>
      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Time
      </th>
      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Purpose
      </th>
      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Status
      </th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {appointments.map((appointment, index) => (
      <tr key={appointment._id || appointment.id || index}>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {appointment.doctorName}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {appointment.hospitalName}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {appointment.date || 'Not specified'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {appointment.time || 'Not specified'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {appointment.purpose || 'Not specified'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              appointment.status === 'Confirmed' || appointment.status === 'confirmed'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {appointment.status || 'Pending'}
          </span>
        </td>
      </tr>
    ))}
  </tbody>
</table>