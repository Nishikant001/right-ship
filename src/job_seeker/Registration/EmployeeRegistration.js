import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerEmployee } from '../../features/employeeRegistrationSlice';
import ProfileImage from '../../images/upload.jpg';
import File from '../../images/File img.png';
import imageCompression from 'browser-image-compression';
import axios from 'axios';
import { motion } from 'framer-motion';

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

  // Define the steps array
  const steps = ['Personal Details', 'Experience', 'Upload Resume & Profile Picture'];

  const handleNext = async () => {
    if (currentStep === 1) {
      const requiredFields = ['mobile_no', 'whatsappNumber', 'gender', 'country', 'email', 'dob', 'availability'];
      const missingFields = requiredFields.filter(field => !formData[field]);

      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }
    } else if (currentStep === 2) {
      const requiredFields = ['lastVesselType', 'presentRank', 'appliedRank', 'totalSeaExperienceYears', 'totalSeaExperienceMonths', 'totalRankExperienceYears', 'totalRankExperienceMonths', 'cop', 'coc', 'watchKeeping'];
      const missingFields = requiredFields.filter(field => !formData[field]);

      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }
    }

    // Update data after each step
    try {
      await axios.post('https://api.rightships.com/employee/update', {
        employee_id: employeeId,
        ...formData,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast.success('Data updated successfully.');

      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    } catch (err) {
      toast.error('Failed to update data.');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileChange = async (event, type) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      toast.error('Please select a file.');
      return;
    }

    let validFileTypes = [];
    let apiField = '';

    if (type === 'profile_photo') {
      validFileTypes = ['image/jpeg', 'image/png'];
      apiField = 'profile_photo';
    } else if (type === 'resume') {
      validFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      apiField = 'resume';
    }

    if (!validFileTypes.includes(selectedFile.type)) {
      toast.error(`Invalid file type. Please upload a ${type === 'profile_photo' ? 'JPEG or PNG' : 'PDF, DOC, or DOCX'} file.`);
      return;
    }

    const formDataFile = new FormData();
    formDataFile.append('file', selectedFile);

    try {
      const response = await axios.post('https://api.rightships.com/upload', formDataFile, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const fileUrl = response.data.file_url;
      setFormData({ ...formData, [apiField]: fileUrl });

      const updatePayload = {
        employee_id: employeeId,
        [apiField]: fileUrl,
      };

      await axios.post('https://api.rightships.com/employee/update', updatePayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast.success(`${type === 'profile_photo' ? 'Profile photo' : 'Resume'} updated successfully.`);
    } catch (error) {
      toast.error(`Failed to upload ${type}.`);
    }
  };

  const triggerFileUpload = (inputRef) => {
    if (inputRef && inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleSubmit = async () => {
    try {
      dispatch(registerEmployee({
        employee_id: employeeId,
        ...formData,
      }));

      if (!loading && !error) {
        toast.success('Registration successful!');
        navigate('/jobs');
      }
    } catch (err) {
      toast.error('Failed to submit registration');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <InputField label="Name" value={formData.name} onChange={(value) => setFormData({ ...formData, name: value })} required />
            <InputField label="Mobile Number" value={formData.mobile_no} onChange={(value) => setFormData({ ...formData, mobile_no: value })} required />
            <InputField label="Whatsapp Number" value={formData.whatsappNumber} onChange={(value) => setFormData({ ...formData, whatsappNumber: value })} required />
            <InputField label="Gender" value={formData.gender} onChange={(value) => setFormData({ ...formData, gender: value })} required type="select" options={["Male", "Female", "Other"]} />
            <InputField label="Country" value={formData.country} onChange={(value) => setFormData({ ...formData, country: value })} required />
            <InputField label="Email" value={formData.email} onChange={(value) => setFormData({ ...formData, email: value })} required type="email" />
            <InputField label="Date of Birth" value={formData.dob} onChange={(value) => setFormData({ ...formData, dob: value })} required type="date" />
            <InputField label="Date of Availability" value={formData.availability} onChange={(value) => setFormData({ ...formData, availability: value })} required type="date" />
          </>
        );
      case 2:
        return (
          <>
            <InputField label="Last Vessel Type" value={formData.lastVesselType} onChange={(value) => setFormData({ ...formData, lastVesselType: value })} required type="select" options={["Type 1", "Type 2"]} />
            <InputField label="Present Rank" value={formData.presentRank} onChange={(value) => setFormData({ ...formData, presentRank: value })} required type="select" options={["Rank 1", "Rank 2"]} />
            <InputField label="Applied Rank" value={formData.appliedRank} onChange={(value) => setFormData({ ...formData, appliedRank: value })} required type="select" options={["Rank 1", "Rank 2"]} />
            <InputField label="Total Sea Experience (Years)" value={formData.totalSeaExperienceYears} onChange={(value) => setFormData({ ...formData, totalSeaExperienceYears: value })} required type="number" />
            <InputField label="Total Sea Experience (Months)" value={formData.totalSeaExperienceMonths} onChange={(value) => setFormData({ ...formData, totalSeaExperienceMonths: value })} required type="number" />
            <InputField label="Total Rank Experience (Years)" value={formData.totalRankExperienceYears} onChange={(value) => setFormData({ ...formData, totalRankExperienceYears: value })} required type="number" />
            <InputField label="Total Rank Experience (Months)" value={formData.totalRankExperienceMonths} onChange={(value) => setFormData({ ...formData, totalRankExperienceMonths: value })} required type="number" />
            <InputField label="COP" value={formData.cop} onChange={(value) => setFormData({ ...formData, cop: value })} required type="select" options={["COP 1", "COP 2"]} />
            <InputField label="COC" value={formData.coc} onChange={(value) => setFormData({ ...formData, coc: value })} required type="select" options={["COC 1", "COC 2"]} />
            <InputField label="Watch Keeping" value={formData.watchKeeping} onChange={(value) => setFormData({ ...formData, watchKeeping: value })} required type="select" options={["Yes", "No"]} />
          </>
        );
      case 3:
        return (
          <>
            <div className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer" onClick={() => triggerFileUpload(profileFileInputRef)}>
              <div className="py-8 text-center">
                <h3 className="text-lg font-semibold text-gray-700">Upload your Photo</h3>
                <p className="text-sm text-gray-500">Receive 2x job offers after uploading</p>
                <img className="mx-auto mt-3" src={ProfileImage} alt="Profile Upload" height={80} width={80} />
                <input
                  type="file"
                  className="hidden"
                  ref={profileFileInputRef}
                  onChange={(e) => handleFileChange(e, 'profile_photo')}
                  accept="image/jpeg, image/png"
                />
              </div>
            </div>
            <div className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer mt-4" onClick={() => triggerFileUpload(resumeFileInputRef)}>
              <div className="py-8 text-center">
                <h3 className="text-lg font-semibold text-gray-700">Upload your Resume!</h3>
                <p className="text-sm text-gray-500">Receive 2x job offers after uploading</p>
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
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 p-6">
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-teal-400 to-blue-500 text-white p-8 rounded-t-xl">
          <h2 className="text-3xl font-semibold">{steps[currentStep - 1]}</h2>
          <p className="mt-2 text-sm">{`Step ${currentStep} of ${steps.length}`}</p>
        </div>

        <div className="p-8">
          {renderStep()}

          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition duration-200"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              {currentStep < 3 ? 'Next' : 'Submit'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const InputField = ({ label, value, onChange, required, type = 'text', options }) => (
  <div className="relative mb-6">
    <label className="block text-gray-700 text-lg font-medium mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {type === 'select' ? (
      <select
        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      >
        <option value="">Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    )}
  </div>
);

export default EmployeeRegistration;
