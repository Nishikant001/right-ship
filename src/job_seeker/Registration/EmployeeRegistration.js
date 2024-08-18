import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerEmployee } from '../../features/employeeRegistrationSlice';
import Background from '../../images/background.jpg';
import ProfileImage from '../../images/upload.jpg';
import File from '../../images/File img.png';
import imageCompression from 'browser-image-compression';

const EmployeeRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const employeeId = state.employeeId || '';
  const contactInfo = useSelector((state) => state.contact.contactInfo);
  const dispatch = useDispatch();
  const profileFileInputRef = useRef(null);
  const resumeFileInputRef = useRef(null);

  const { loading, error } = useSelector((state) => state.employee);

  const [formData, setFormData] = useState({
    name: '',
    mobile_no: contactInfo || '',
    whatsappNumber: '',
    gender: '',
    country: '',
    email: '',
    dob: '',
    availability: '',
    lastVesselType: '',
    presentRank: '',
    appliedRank: '',
    totalSeaExperienceYears: '',
    totalSeaExperienceMonths: '',
    totalRankExperienceYears: '',
    totalRankExperienceMonths: '',
    cop: '',
    coc: '',
    watchKeeping: '',
    profile_photo: null,
    resume: null,
  });

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate the first step form data here
      const requiredFields = ['mobile_no', 'whatsappNumber', 'gender', 'country', 'email', 'dob', 'availability'];
      const missingFields = requiredFields.filter(field => !formData[field]);

      if (missingFields.length > 0) {
        alert(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }
    } else if (currentStep === 2) {
      // Validate the second step form data here
      const requiredFields = ['lastVesselType', 'presentRank', 'appliedRank', 'totalSeaExperienceYears', 'totalSeaExperienceMonths', 'totalRankExperienceYears', 'totalRankExperienceMonths', 'cop', 'coc', 'watchKeeping'];
      const missingFields = requiredFields.filter(field => !formData[field]);

      if (missingFields.length > 0) {
        alert(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      dispatch(registerEmployee({
        employee_id: employeeId,
        ...formData
      }));

      if (!loading && !error) {
        alert('Registration successful!');
        navigate('/dashboard'); // Redirect to a new page after completion
      }
    } catch (err) {
      console.error('Failed to submit registration', err);
    }
  };

  const handleFileChange = async (event, type) => {
    const options = {
      maxSizeMB: 5,
    };
    const selectedFile = event.target.files[0];

    if (type === 'profile_photo') {
      try {
        const compressedFile = await imageCompression(selectedFile, options);
        setFormData({ ...formData, profile_photo: compressedFile });
      } catch (error) {
        console.error('Error during image compression:', error);
        alert('Failed to compress image. Please try again.');
      }
    } else if (type === 'resume') {
      setFormData({ ...formData, resume: selectedFile });
    }
  };

  const triggerFileUpload = (inputRef) => {
    inputRef.current.click();
  };

  return (
    <div className="flex h-screen">
      <div className="hidden md:block w-2/5 h-screen bg-cover bg-center" style={{ backgroundImage: `url(${Background})` }}></div>
      <div className="w-full md:w-3/5 h-screen overflow-y-auto bg-white flex justify-center">
        <div className="container-fluid w-9/12">
          {currentStep === 1 && (
            <>
              <h2 className="text-3xl font-semibold mt-14 mb-6">Personal Details</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1">
                  <label className='text-base'>Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    className="w-full border-2 border-gray-200 py-2.5 px-5 rounded-lg mt-1"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    value={formData.name}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className='text-base'>Mobile Number</label>
                    <input
                      type="text"
                      name="mobile_no"
                      placeholder="Enter your mobile number"
                      className="w-full border-2 border-gray-200 py-2.5 px-5 rounded-lg mt-1"
                      onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                      value={formData.mobile_no}
                    />
                  </div>
                  <div>
                    <label className='text-base'>Whatsapp Number</label>
                    <input
                      type="text"
                      name="whatsappNumber"
                      placeholder="Enter your WhatsApp number"
                      className="w-full border-2 border-gray-200 py-2.5 px-5 rounded-lg mt-1"
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      value={formData.whatsappNumber}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className='text-base'>Gender</label>
                    <select
                      name="gender"
                      className="w-full border-2 border-gray-200 py-2.5 px-4 rounded mt-1"
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      value={formData.gender}
                    >
                      <option value="">Choose Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className='text-base'>Country</label>
                    <input
                      type="text"
                      name="country"
                      placeholder="Enter your country"
                      className="w-full border-2 border-gray-200 py-2.5 px-5 rounded-lg mt-1"
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      value={formData.country}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1">
                  <label className='text-base'>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email id"
                    className="w-full border-2 border-gray-200 py-2.5 px-5 rounded-lg mt-1"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    value={formData.email}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className='text-base'>Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      className="w-full border-2 border-gray-200 py-2.5 px-5 mt-1 rounded-lg"
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      value={formData.dob}
                    />
                  </div>
                  <div>
                    <label className='text-base'>Date of Availability</label>
                    <input
                      type="date"
                      name="availability"
                      className="w-full border-2 border-gray-200 py-2.5 px-5 mt-1 rounded-lg"
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                      value={formData.availability}
                    />
                  </div>
                </div>
              </form>
            </>
          )}
          {currentStep === 2 && (
            <>
              <h2 className="text-3xl font-semibold mt-14 mb-6">Experience</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-2">
                  <label className='text-base'>Last Vessel Type</label>
                  <select
                    name="lastVesselType"
                    value={formData.lastVesselType}
                    className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg mt-1"
                    onChange={(e) => setFormData({ ...formData, lastVesselType: e.target.value })}
                  >
                    <option value="">Select Last Vessel Type</option>
                    {/* Add options here dynamically */}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-base">Present Rank</label>
                    <select
                      name="presentRank"
                      value={formData.presentRank}
                      className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg mt-1"
                      onChange={(e) => setFormData({ ...formData, presentRank: e.target.value })}
                    >
                      <option value="">Select Present Rank</option>
                      {/* Add options here dynamically */}
                    </select>
                  </div>
                  <div>
                    <label className="text-base">Applied Rank</label>
                    <select
                      name="appliedRank"
                      value={formData.appliedRank}
                      className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg mt-1"
                      onChange={(e) => setFormData({ ...formData, appliedRank: e.target.value })}
                    >
                      <option value="">Select Applied Rank</option>
                      {/* Add options here dynamically */}
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
                        onChange={(e) => setFormData({ ...formData, totalSeaExperienceYears: e.target.value })}
                      />
                      <input
                        type="number"
                        name="totalSeaExperienceMonths"
                        value={formData.totalSeaExperienceMonths}
                        placeholder="Months"
                        className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg"
                        onChange={(e) => setFormData({ ...formData, totalSeaExperienceMonths: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, totalRankExperienceYears: e.target.value })}
                      />
                      <input
                        type="number"
                        name="totalRankExperienceMonths"
                        value={formData.totalRankExperienceMonths}
                        placeholder="Months"
                        className="w-full border-2 border-gray-200 py-3 px-5 rounded-lg"
                        onChange={(e) => setFormData({ ...formData, totalRankExperienceMonths: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </>
          )}
          {currentStep === 3 && (
            <>
              <h2 className="text-3xl font-semibold mt-14 mb-6">Upload Resume & Profile Picture</h2>
              <form className="space-y-6">
                <div className="flex justify-center items-center border-2 border-dashed border-black rounded-lg cursor-pointer" onClick={() => triggerFileUpload(profileFileInputRef)}>
                  <div className="py-8">
                    <h3 className="text-center">Upload your Photo</h3>
                    <p className="text-green-600 text-sm">Receive 2x job offers after uploading</p>
                    <img className="mx-auto mt-3" src={ProfileImage} alt="Profile Upload" height={80} width={80} />
                    <input
                      type="file"
                      className="hidden"
                      ref={profileFileInputRef}
                      onChange={(e) => handleFileChange(e, 'profile_photo')}
                      accept="image/*"
                    />
                  </div>
                </div>
                <div className="flex justify-center items-center border-2 border-dashed border-black rounded-lg cursor-pointer mt-4" onClick={() => triggerFileUpload(resumeFileInputRef)}>
                  <div className="py-8">
                    <h3 className="text-center">Upload your Resume!</h3>
                    <p className="text-green-600 text-sm">Receive 2x job offers after uploading</p>
                    <img className="mx-auto" src={File} alt="Resume Upload" height={80} width={80} />
                    <input
                      type="file"
                      className="hidden"
                      ref={resumeFileInputRef}
                      onChange={(e) => handleFileChange(e, 'resume')}
                      accept=".pdf,.doc,.docx"
                    />
                  </div>
                </div>
              </form>
            </>
          )}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
            >
              {currentStep < 3 ? 'Next' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeRegistration;
