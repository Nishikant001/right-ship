import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
// import { updateData } from '../../features/employeeRegistrationSlice';
import Background from "../../images/background.jpg";
import { Link, useNavigate ,useLocation} from 'react-router-dom';

const Experience = () => {
  const navigate = useNavigate();
  const location = useLocation();
const state = location.state || {};
const employeeId = state.employeeId || '';

  console.log('Location State:', location.state); // Add this line
  console.log('Employee ID:', employeeId);

  const [formData, setFormData] = useState({
    lastVesselType: '',
    presentRank:  '',
    appliedRank:  '',
    totalSeaExperienceYears:  '',
    totalSeaExperienceMonths: '',
    totalRankExperienceYears: '',
    totalRankExperienceMonths: '',
    cop:  '',
    coc:  '',
    watchKeeping:  ''
  });

  const [error, setError] = useState('');

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
    // dispatch(updateData({ [name]: value }));
  };

  const handleNext = async () => {
    console.log('Submitting form data:', formData);
    console.log('Employee ID:', employeeId);
    // const employeeId = data.employeeId;

    const requiredFields = ['lastVesselType', 'presentRank', 'appliedRank', 'totalSeaExperienceYears', 'totalSeaExperienceMonths', 'totalRankExperienceYears', 'totalRankExperienceMonths', 'cop', 'coc', 'watchKeeping'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (!employeeId) {
      setError('Employee ID is required.');
      console.log('Location State:', location.state);
      return;
    }

    try {
      const response = await axios.post('https://api.rightships.com/employee/update', {
        employee_id: employeeId,
        ...formData
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response:', response);

      if (response.status === 200) {
        console.log('Update successful:', response.data);
        // console.log('Navigating to Experience with Employee ID:', employeeId);
        console.log('Navigating with employeeId:', employeeId);

        // navigate('/experinceDetails', { state: { employeeId } });
        navigate('/resume&profile',{ state: { employeeId } });
      } else {
        console.error('Failed to update:', response);
        setError('Failed to update employee details. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(`Error: ${error.response.data.message || 'An error occurred. Please try again.'}`);
      } else {
        console.error('Error:', error);
        setError('An error occurred during update. Please try again.');
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="hidden md:block w-2/5 h-screen bg-cover bg-center" style={{ backgroundImage: `url(${Background})` }}></div>
      <div className="w-full md:w-3/5 h-screen overflow-y-auto bg-white flex justify-center">
        <div className="container-fluid w-9/12">
          <h1 className="text-4xl font-semibold mt-14 mb-2">Your Experience</h1>
          <h6 className='text-lg font-semibold mb-4'>Manish Sir</h6>
          {error && (
            <div className="bg-red-200 text-red-800 p-3 mb-4 rounded">
              {error}
            </div>
          )}
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-2">
              <label className='text-base'>Last Vessel Type</label>
              <input
                type="text"
                name="lastVesselType"
                value={formData.lastVesselType}
                placeholder="Enter your last vessel type"
                className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg"
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <input
                type="text"
                name="presentRank"
                value={formData.presentRank}
                placeholder="Enter your present rank"
                className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg"
                onChange={handleChange}
              />
              <input
                type="text"
                name="appliedRank"
                value={formData.appliedRank}
                placeholder="Enter your applied rank"
                className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg"
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-base">Total Sea Experience</label>
                <div className="flex flex-row mt-2">
                  <input
                    type="text"
                    name="totalSeaExperienceYears"
                    value={formData.totalSeaExperienceYears}
                    placeholder="Years"
                    className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg"
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="totalSeaExperienceMonths"
                    value={formData.totalSeaExperienceMonths}
                    placeholder="Months"
                    className="w-full border-2 border-gray-200 py-3 px-5 mx-3 rounded-lg"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="text-base">Total Rank Experience</label>
                <div className="flex flex-row mt-2">
                  <input
                    type="text"
                    name="totalRankExperienceYears"
                    value={formData.totalRankExperienceYears}
                    placeholder="Years"
                    className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg"
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="totalRankExperienceMonths"
                    value={formData.totalRankExperienceMonths}
                    placeholder="Months"
                    className="w-full border-2 border-gray-200 py-3 px-5 mx-3 rounded-lg"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <label className="text-base">COP</label>
                <input
                  type="text"
                  name="cop"
                  value={formData.cop}
                  placeholder="Select COP"
                  className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg mt-1"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-base">COC</label>
                <input
                  type="text"
                  name="coc"
                  value={formData.coc}
                  placeholder="Select COC"
                  className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg mt-1"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-base">Watch Keeping</label>
                <input
                  type="text"
                  name="watchKeeping"
                  value={formData.watchKeeping}
                  placeholder="Select watch keeping"
                  className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg mt-1"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex justify-start space-x-4 mt-6">
              <Link to='/personalDetails'>
                <button className="bg-white text-customBlue border font-bold border-customBlue py-2 rounded w-24 text-center">
                  BACK
                </button>
              </Link>
              <button
                type="button"
                className="bg-customBlue text-white font-bold py-2 rounded w-24 text-center"
                onClick={handleNext}
              >
                NEXT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Experience;
