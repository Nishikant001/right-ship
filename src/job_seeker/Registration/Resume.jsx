import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Background from "../../images/background.jpg";
import File from "../../images/File img.png";
import ProfileImage from "../../images/upload.jpg";
import imageCompression from 'browser-image-compression';
import { useSelector } from 'react-redux';
const Resume = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const employeeId = state.employeeId || ''; // Retrieve the employee ID from the state or fallback to an empty string
  const contactInfo = useSelector((state) => state.contact.contactInfo);
  const [profileFile, setProfileFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const profileFileInputRef = useRef(null);
  const resumeFileInputRef = useRef(null);

  useEffect(() => {
    console.log('Location State:', location.state);
    console.log('Employee ID:', employeeId);

    if (!employeeId) {
      setError('Employee ID is missing. Please navigate through the proper flow.');
      // Optionally, you can redirect the user back to a previous page if no employee ID is present
      // navigate('/previousPage');
    }
  }, [location.state, employeeId, navigate]);

  const handleProfileFileChange = async(event) => {
    const options = {
      maxSizeMB: 5, // Maximum file size in MB
      
    };
    const selectedFile = event.target.files[0];
    setProfileFile(selectedFile);
    console.log('Profile file uploaded:', selectedFile);
    try {
      const compressedFile = await imageCompression(selectedFile, options);
      setProfileFile(compressedFile);
      console.log('Profile file uploaded:', compressedFile);
    } catch (error) {
      console.error('Error during image compression:', error);
      setError('Failed to compress image. Please try again.');
    }
  };

  

  const handleResumeFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setResumeFile(selectedFile);
    console.log('Resume file uploaded:', selectedFile);
  };

  const triggerProfileFileUpload = () => {
    profileFileInputRef.current.click();
  };

  const triggerResumeFileUpload = () => {
    resumeFileInputRef.current.click();
  };
  const uploadFile = async (file, key) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await axios.post('https://api.rightships.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Origin': 'http://API.rightships.com'
        },
      });
  
      console.log(`Response for ${key} upload:`, response.data); // Log the full response
  
      if (response.status === 200) {
        // Use 'file_url' from the response data
        console.log(`${key} upload successful:`, response.data);
        return response.data.file_url; // Return the correct property
      } else {
        console.error(`Failed to upload ${key}:`, response);
        setError(`Failed to upload ${key}. Please try again.`);
        return null;
      }
    } catch (error) {
      console.error(`Error uploading ${key}:`, error);
      setError(`Error uploading ${key}. Please try again.`);
      return null;
    }
  };
  
  

  const handleSubmit = async () => {
    if (!employeeId) {
      setError('Employee ID is required.');
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
  
      // Upload profile picture and resume
      const profileFilePath = profileFile ? await uploadFile(profileFile, 'profile picture') : null;
      const resumeFilePath = resumeFile ? await uploadFile(resumeFile, 'resume') : null;
  
      console.log('Profile File Path:', profileFilePath); // Log the file paths
      console.log('Resume File Path:', resumeFilePath);
  
      // Prepare payload for update API
      const payload = {
        employee_id: employeeId,
        profile_photo: profileFilePath,
        resume: resumeFilePath,
      };
  
      const response = await axios.post('https://api.rightships.com/employee/update', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Update Response:', response.data);
  
      if (response.status === 200) {
        console.log('Update successful:', response.data);
        setSuccess(true);
        navigate('/profile',{state:{ employeeId,mobile_no: contactInfo }});
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
    } finally {
      setLoading(false);
    }
  };
   
  return (
    <div className="flex h-screen">
      <div className="hidden md:block w-2/5 h-screen bg-cover bg-center" style={{ backgroundImage: `url(${Background})` }}></div>
      <div className="w-full md:w-3/5 h-screen overflow-y-auto bg-white flex justify-center">
        <div className="container-fluid w-9/12">
          <div className="text-start">
            <h2 className="text-4xl font-semibold mt-14 mb-2">Upload Resume & Profile Picture</h2>
            <p className="text-lg font-semibold mb-4">Manish Sir</p>
          </div>
          {/* Profile picture upload section */}
          <div className="flex justify-center items-center border-2 border-dashed border-black rounded-lg cursor-pointer" onClick={triggerProfileFileUpload}>
            <div className="py-8">
              <h3 className="text-center">Upload your Photo</h3>
              <p className="text-green-600 text-sm">Receive 2x job offers after uploading</p>
              <img className="mx-auto mt-3" src={ProfileImage} alt="Profile Upload" height={80} width={80} />
              <input
                type="file"
                className="hidden"
                ref={profileFileInputRef}
                onChange={handleProfileFileChange}
                accept="image/*"
              />
            </div>
          </div>
          {profileFile && (
            <div className="mt-4">
              <p className="text-gray-700">Selected file: {profileFile.name}</p>
            </div>
          )}
          
          {/* Resume file upload section */}
          <div className="flex justify-center items-center border-2 border-dashed border-black rounded-lg cursor-pointer mt-4" onClick={triggerResumeFileUpload}>
            <div className="py-8">
              <h3 className="text-center">Upload your Resume!</h3>
              <p className="text-green-600 text-sm">Receive 2x job offers after uploading</p>
              <img className="mx-auto" src={File} alt="Resume Upload" height={80} width={80} />
              <input
                type="file"
                className="hidden"
                ref={resumeFileInputRef}
                onChange={handleResumeFileChange}
                accept=".pdf,.doc,.docx"
              />
            </div>
          </div>
          {resumeFile && (
            <div className="mt-4">
              <p className="text-gray-700">Selected file: {resumeFile.name}</p>
            </div>
          )}
          
          <div className="flex justify-between mt-2">
            <div>
              <label className="text-xs text-gray-500">Upload .pdf & .docx file only</label><br/>
              <label className="text-xs text-red-600">max file size 5MB only</label>
            </div>
            <div className="flex space-x-2 mt-4">
              <Link to="/experienceDetails" className="bg-white text-customBlue font-bold border border-customBlue py-2 px-6 rounded w-38 text-center">BACK</Link>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-customBlue text-white font-bold border border-customBlue py-2 px-6 rounded w-38 text-center"
              >
                {loading ? 'Submitting...' : 'SUBMIT'}
              </button>
            </div>
          </div>
          {success && <p className="text-green-500">Update Successful!</p>}
          {error && <p className="text-red-500">Update Failed: {error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Resume;
