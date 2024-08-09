import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Background from "../../images/background.jpg";
import File from "../../images/File img.png";
import ProfileImage from "../../images/upload.jpg";

const Resume = () => {
  const navigate = useNavigate();
  const { data, about, experience } = useSelector(state => state.employee); // Access additional data

  const [profileFile, setProfileFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const profileFileInputRef = useRef(null);
  const resumeFileInputRef = useRef(null);

  const handleProfileFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setProfileFile(selectedFile);
    console.log('Profile file uploaded:', selectedFile);
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

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    navigate('/profile')

    try {
      const profileBase64 = profileFile ? await toBase64(profileFile) : null;
      const resumeBase64 = resumeFile ? await toBase64(resumeFile) : null;

      const payload = {
        name: data.name,
        email: data.email,
        mobile_no: data.mobile_no,
        about,        // Include about data
        experience,   // Include experience data
        profilePicture: profileBase64,
        resume: resumeBase64,
      };

      const response = await fetch('https://api.rightships.com/employee/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Employee registered successfully:', responseData);
        setSuccess(true);
        navigate('/login');
      } else {
        const errorText = await response.text();
        setError('Registration failed');
        console.error('Failed to register employee:', errorText);
      }
    } catch (error) {
      setError(error.message || 'Error registering employee');
      console.error('Error registering employee:', error);
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
          {success && <p className="text-green-500">Registration Successful!</p>}
          {error && <p className="text-red-500">Registration Failed: {error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Resume;
