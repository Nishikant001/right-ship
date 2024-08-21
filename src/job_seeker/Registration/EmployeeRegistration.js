import React, { useState, useRef ,useEffect} from 'react';
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
  const [copOptions, setCopOptions] = useState([]);
  const [cocOptions, setCocOptions] = useState([]);
  const [shipOptions, setShipOptions] = useState([]);
  const [watchKeepingOptions, setWatchKeepingOptions] = useState([]);
  const [rankOptions, setRankOptions] = useState([]);
  // const [error, setError] = useState('');

  const { loading, error } = useSelector((state) => state.employee);



  const handleDateOfBirthChange = (value) => {
    setFormData({ ...formData, dob: value });

    // Calculate the age
    const calculateAge = (dob) => {
      const today = new Date();
      const birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    };

    const age = calculateAge(value);
    setFormData({ ...formData, dob: value, age: age.toString() }); // Update age field as string
  };

   
 
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile_no: contactInfo || '', // Assuming contactInfo is being passed correctly
    whatsappNumber: '',
    gender: '',
    country: '', // corresponds to country
    dob: '',
    age: '', // Age field added
    availability: '', // corresponds to availability
    appliedVessel: '', // corresponds to lastVesselType
    presentVessel: '', // corresponds to presentVessel
    vesselExp: [], // Initialize as empty array
    appliedRank: '',
    presentRank: '',
    presentRankExperienceInYear: '',
    presentRankExperienceInMonth: '',
    totalSeaExperienceYear: '',
    totalSeaExperienceMonth: '',
    cop: '',
    coc: '',
    watchkeeping: '',
    profile: null, // corresponds to profile_photo
    resume: null,
    address: {
      country: '', // Ensure this field is present and initialized
      state: '',
      city: '',
      addresss: ''
    },
    createdDate: '',
    updatedDate: ''
  });
  
  

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
                // console.log(rankOptions)
            } else {
                console.error('Failed to fetch attributes:', response.data.msg);
            }
        } catch (error) {
            console.error('Failed to fetch attributes:', error);
        }
    };

    fetchAttributes();
}, []);


  // Define the steps array
  const steps = ['Personal Details', 'Experience', 'Upload Resume & Profile Picture'];

  const handleNext = async () => {
    if (currentStep === 1) {
      const requiredFields = [
        'mobile_no', 
        'whatsappNumber', 
        'gender', 
        'country', 
        'email', 
        'dob', 
        'availability'
      ];
      const missingFields = requiredFields.filter(field => !formData[field]);
  
      if (missingFields.length > 0) {
        toast.error(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }
    } else if (currentStep === 2) {
      const requiredFields = [
        'presentVessel', 
        'appliedVessel', 
        'presentRank',
        'appliedRank', 
        'totalSeaExperienceYear', // Fixed field name
        'totalSeaExperienceMonth', // Fixed field name
        'presentRankExperienceInYear', 
        'presentRankExperienceInMonth', 
        'cop', 
        'coc', 
        'watchkeeping'
      ];
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
    console.log('File type:', type); // Debugging line
    const selectedFile = event.target.files[0];
  
    if (!selectedFile) {
      toast.error('Please select a file.');
      return;
    }
  
    let validFileTypes = [];
    let apiField = '';
    let errorMessage = '';
  
    if (type === 'profile') {
      validFileTypes = ['image/jpeg', 'image/png'];
      apiField = 'profile';
      errorMessage = 'Invalid file type. Please upload a JPEG or PNG file.';
    } else if (type === 'resume') {
      validFileTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      apiField = 'resume';
      errorMessage = 'Invalid file type. Please upload a PDF, DOC, or DOCX file.';
    }
  
    if (!validFileTypes.includes(selectedFile.type)) {
      toast.error(errorMessage);
      return;
    }
  
    const formDataFile = new FormData();
    formDataFile.append('file', selectedFile);
  
    try {
      // Upload file
      const response = await axios.post('https://api.rightships.com/upload', formDataFile, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const fileUrl = response.data.file_url;
  
      // Update state with the file URL
      setFormData({ ...formData, [apiField]: fileUrl });
  
      // Prepare data for updating employee info
      const updatePayload = {
        employee_id: employeeId,
        [apiField]: fileUrl,
      };
  
      // Update employee data with the new file URL
      await axios.post('https://api.rightships.com/employee/update', updatePayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      toast.success(`${type === 'profile' ? 'Profile photo' : 'Resume'} updated successfully.`);
    } catch (error) {
      toast.error(`Failed to upload ${type === 'profile' ? 'profile photo' : 'resume'}.`);
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
            <InputField
              label="First Name"
              value={formData.firstName}
              onChange={(value) => setFormData({ ...formData, firstName: value })}
              required
            />
            <InputField
              label="Last Name"
              value={formData.lastName}
              onChange={(value) => setFormData({ ...formData, lastName: value })}
              required
            />
            <InputField
              label="Email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              required
              type="email"
            />
            <InputField
              label="Mobile Number"
              value={formData.mobile_no}
              onChange={(value) => setFormData({ ...formData, mobile_no: value })}
              required
            />
            <InputField
              label="WhatsApp Number"
              value={formData.whatsappNumber}
              onChange={(value) => setFormData({ ...formData, whatsappNumber: value })}
              required
            />
            <InputField
              label="Gender"
              value={formData.gender}
              onChange={(value) => setFormData({ ...formData, gender: value })}
              required
              type="select"
              options={["Male", "Female", "Other"]}
            />
            <InputField
              label="Country"
              value={formData.country}
              onChange={(value) => setFormData({ ...formData, country: value })}
              required
            />
           <InputField
              label="Date of Birth"
              value={formData.dob}
              onChange={(value) => handleDateOfBirthChange(value)}
              required
              type="date"
            />
             <InputField
              label="Age"
              value={formData.age}
              onChange={(value) => setFormData({ ...formData, age: value })}
              required
            />
            <InputField
              label="Date of Availability"
              value={formData.availability}
              onChange={(value) => setFormData({ ...formData, availability: value })}
              required
              type="date"
            />
          </>
        );
      case 2:
        return (
          <>
    <InputField
        label="Present Vessel"
        value={formData.presentVessel}
        onChange={(value) => setFormData({ ...formData, presentVessel: value })}
        required
    />
    <InputField
        label="Applied Vessel"
        value={formData.appliedVessel}
        onChange={(value) => setFormData({ ...formData, appliedVessel: value })}
        required
    />
    <InputField
        label="Present Rank"
        value={formData.presentRank}
        onChange={(value) => setFormData({ ...formData, presentRank: value })}
        required
        type="select"
        options={rankOptions} // Use the dynamically fetched rank options
    />
    <InputField
        label="Applied Rank"
        value={formData.appliedRank}
        onChange={(value) => setFormData({ ...formData, appliedRank: value })}
        required
        type="select"
        options={rankOptions} // Use the dynamically fetched rank options
    />
    <InputField
        label="Total Sea Experience (Years)"
        value={formData.totalSeaExperienceYear}
        onChange={(value) => setFormData({ ...formData, totalSeaExperienceYear: value })}
        required
        type="number"
    />
    <InputField
        label="Total Sea Experience (Months)"
        value={formData.totalSeaExperienceMonth}
        onChange={(value) => setFormData({ ...formData, totalSeaExperienceMonth: value })}
        required
        type="number"
    />
    <InputField
        label="Present Rank Experience (Years)"
        value={formData.presentRankExperienceInYear}
        onChange={(value) => setFormData({ ...formData, presentRankExperienceInYear: value })}
        required
        type="number"
    />
    <InputField
        label="Present Rank Experience (Months)"
        value={formData.presentRankExperienceInMonth}
        onChange={(value) => setFormData({ ...formData, presentRankExperienceInMonth: value })}
        required
        type="number"
    />
    <InputField
        label="COP"
        value={formData.cop}
        onChange={(value) => setFormData({ ...formData, cop: value })}
        required
        type="select"
        options={copOptions} // Use the dynamically fetched COP options
    />
    <InputField
        label="COC"
        value={formData.coc}
        onChange={(value) => setFormData({ ...formData, coc: value })}
        required
        type="select"
        options={cocOptions} // Use the dynamically fetched COC options
    />
    <InputField
        label="Watchkeeping"
        value={formData.watchkeeping}
        onChange={(value) => setFormData({ ...formData, watchkeeping: value })}
        required
        type="select"
        options={watchKeepingOptions} // Use the dynamically fetched Watchkeeping options
    />
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
                  onChange={(e) => handleFileChange(e, 'profile')}
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
