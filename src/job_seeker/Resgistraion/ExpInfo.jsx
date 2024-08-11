import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Background from "../../images/background.jpg";
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Experience = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const employeeId = state.employeeId || '';

  console.log('Location State:', location.state);
  console.log('Employee ID:', employeeId);

  const [formData, setFormData] = useState({
    lastVesselType: '',
    presentRank: '',
    appliedRank: '',
    totalSeaExperienceYears: '',
    totalSeaExperienceMonths: '',
    totalRankExperienceYears: '',
    totalRankExperienceMonths: '',
    cop: '',
    coc: '',
    watchKeeping: ''
  });

  const [copOptions, setCopOptions] = useState([]);
  const [cocOptions, setCocOptions] = useState([]);
  const [shipOptions, setShipOptions] = useState([]);
  const [watchKeepingOptions, setWatchKeepingOptions] = useState([]);
  const [rankOptions, setRankOptions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await axios.post('https://api.rightships.com/attributes/get', {}, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
          }
        });

        if (response.data && response.data.code === 200) {
          const attributes = response.data.data;

          const copAttribute = attributes.find(attr => attr.name.toLowerCase() === 'cop');
          const cocAttribute = attributes.find(attr => attr.name.toLowerCase() === 'coc');
          const shipAttribute = attributes.find(attr => attr.name.toLowerCase() === 'ships');
          const watchKeepingAttribute = attributes.find(attr => attr.name.toLowerCase() === 'watch keeping');
          const rankAttribute = attributes.find(attr => attr.name.toLowerCase() === 'rank');

          const copData = copAttribute ? copAttribute.values : [];
          const cocData = cocAttribute ? cocAttribute.values.sort((a, b) => a.localeCompare(b)) : [];
          const shipData = shipAttribute ? shipAttribute.values.sort((a, b) => a.localeCompare(b)) : []; // Sorting ship data
          const watchKeepingData = watchKeepingAttribute ? watchKeepingAttribute.values : [];
          const rankData = rankAttribute ? rankAttribute.values.sort((a, b) => a.localeCompare(b)) : [];

          setCopOptions(copData);
          setCocOptions(cocData);
          setShipOptions(shipData); // Set ship options for Last Vessel Type
          setWatchKeepingOptions(watchKeepingData);
          setRankOptions(rankData);
        } else {
          console.error('Failed to fetch attributes:', response.data.msg);
        }
      } catch (error) {
        console.error('Failed to fetch attributes:', error);
      }
    };

    fetchAttributes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleNext = async () => {
    console.log('Submitting form data:', formData);
    console.log('Employee ID:', employeeId);

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
        console.log('Navigating to Experience with Employee ID:', employeeId);
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
    <div className="flex flex-col md:flex-row h-screen">
      <div className="hidden md:block md:w-2/5 h-screen bg-cover bg-center" style={{ backgroundImage: `url(${Background})` }}></div>
      <div className="w-full md:w-3/5 h-screen overflow-y-auto bg-white flex justify-center">

        <div className="container w-full md:w-4/5  p-6">
          <h1 className="text-2xl md:text-4xl font-semibold mt-md-8 mb-9">Your Experience</h1>
          {/* <h6 className='text-lg font-semibold mb-4'>Manish Sir</h6> */}
          {error && (
            <div className="bg-red-200 text-red-800 p-3 mb-4 rounded">
              {error}
            </div>
          )}
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-2">
              <label className='text-base'>Last Vessel Type</label>
              <select
                name="lastVesselType"
                value={formData.lastVesselType}
                className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg mt-1"
                onChange={handleChange}
              >
                <option value="">Select Last Vessel Type</option>
                {shipOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-base">Present Rank</label>
                <select
                  name="presentRank"
                  value={formData.presentRank}
                  className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg mt-1"
                  onChange={handleChange}
                >
                  <option value="">Select Present Rank</option>
                  {rankOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-base">Applied Rank</label>
                <select
                  name="appliedRank"
                  value={formData.appliedRank}
                  className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg mt-1"
                  onChange={handleChange}
                >
                  <option value="">Select Applied Rank</option>
                  {rankOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-base">Total Sea Experience</label>
                <div className="flex flex-row mt-2 space-x-3">
                  <input
                    type="number"
                    name="totalSeaExperienceYears"
                    value={formData.totalSeaExperienceYears}
                    placeholder="Years"
                    className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg"
                    onChange={handleChange}
                  />
                  <input
                    type="number"
                    name="totalSeaExperienceMonths"
                    value={formData.totalSeaExperienceMonths}
                    placeholder="Months"
                    className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="text-base">Total Rank Experience</label>
                <div className="flex flex-row mt-2 space-x-3">
                  <input
                    type="number"
                    name="totalRankExperienceYears"
                    value={formData.totalRankExperienceYears}
                    placeholder="Years"
                    className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg"
                    onChange={handleChange}
                  />
                  <input
                    type="number"
                    name="totalRankExperienceMonths"
                    value={formData.totalRankExperienceMonths}
                    placeholder="Months"
                    className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <div>
                <label className="text-base">COP</label>
                <select
                  name="cop"
                  value={formData.cop}
                  className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg mt-1"
                  onChange={handleChange}
                >
                  <option value="">Select COP</option>
                  {copOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-base">COC</label>
                <select
                  name="coc"
                  value={formData.coc}
                  className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg mt-1"
                  onChange={handleChange}
                >
                  <option value="">Select COC</option>
                  {cocOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-base">Watch Keeping</label>
                <select
                  name="watchKeeping"
                  value={formData.watchKeeping}
                  className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg mt-1"
                  onChange={handleChange}
                >
                  <option value="">Select Watch Keeping</option>
                  {watchKeepingOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-between space-x-4 mt-6">
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
          <div className="py-9"></div>
        </div>


      </div>
    </div>
  );
};

export default Experience;
