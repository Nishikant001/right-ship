import React, { useState, useEffect } from 'react';
import { FaRegEdit, FaEdit } from "react-icons/fa";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './EmployeeProfile.css'; // Assuming you will place the CSS in EmployeeProfile.css

const EmployeeProfile = () => {
  const [profileImage, setProfileImage] = useState("https://i2.pickpik.com/photos/711/14/431/smile-profile-face-male-preview.jpg");
  const [profileData, setProfileData] = useState({ name: '', rank: '', position: '' });
  const [file, setFile] = useState(null);
  const [editSection, setEditSection] = useState(null);
  const [sectionData, setSectionData] = useState({
    lastVesselType: '',
    vesselAppliedFor: '',
    dateOfAvailability: '',
    contactDetail: {
      email: '',
      whatsappNumber: '',
      dob: '',
      age: '',
      gender: '',
    },
    experience: {
      seaExperience: '',
      lastRankExperience: '',
      presentRank: '',
      lastRank: '',
    },
    licenseHolding: {
      coc: '',
      cop: '',
      watchKeeping: '',
    },
  });

  const location = useLocation();
  const employeeId = location.state?.employeeId;
  const contactInfo = useSelector((state) => state.contact.contactInfo);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.post('https://api.rightships.com/user/details', {
          mobile_no: contactInfo,
          user_type: 'employee',
        });
        const result = await response.json();
        const profile_photo = result.data?.profile_photo;
        setProfileImage(profile_photo);
        setProfileData({
          name: result.data?.name || 'Nishikant Sahoo',
          rank: result.data?.rank || 'Present Rank',
          position: result.data?.position || 'Chief Officer'
        });

        const resume = result.data?.resume;
        if (resume) {
          const fileNameWithUnderscore = resume.split('/').pop(); 
          const fileName = fileNameWithUnderscore.replace(/^_/, ''); 
          setFile({
            name: fileName,
            url: resume,
          });
        }

        setSectionData(result.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    if (contactInfo) {
      fetchProfileData();
    }
  }, [contactInfo]);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }

  const handleEditClick = (section) => {
    setEditSection(section);
  };

  const handleSaveClick = () => {
    updateUserData();
    setEditSection(null);
  };

  const handleChange = (section, key, value) => {
    if (typeof sectionData[section] === 'string') {
      setSectionData({
        ...sectionData,
        [section]: value,
      });
    } else {
      setSectionData({
        ...sectionData,
        [section]: {
          ...sectionData[section],
          [key]: value,
        },
      });
    }
  };

  const updateUserData = () => {
    if (employeeId) {
      const payload = {
        employee_id: employeeId,
        name: sectionData.name,
        lastVesselType: sectionData.lastVesselType,
        appliedRank: sectionData.vesselAppliedFor,
        availability: sectionData.dateOfAvailability,
        contactDetail: sectionData.contactDetail,
        experience: sectionData.experience,
        licenseHolding: sectionData.licenseHolding,
      };

      axios
        .post('https://api.rightships.com/employee/update', payload, {
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
          },
        })
        .then((response) => {
          console.log('Data updated successfully:', response.data);
        })
        .catch((error) => {
          console.error('Error updating data:', error);
        });
    }
  };

  const renderEditableField = (section, key, value) => {
    const displayValue = typeof value === 'string' ? value : JSON.stringify(value);
    return editSection === section ? (
      <input
        type="text"
        className="border p-1 rounded"
        value={displayValue}
        onChange={(e) => handleChange(section, key, e.target.value)}
      />
    ) : (
      <b>{displayValue}</b>
    );
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100 z-0">
      <aside className="sticky top-2 right-0 w-full lg:w-1/3 p-4 bg-white shadow-md overflow-y-auto" style={{ height: "40em" }}>
        <div className="bg-white p-4 border-b-2 shadow-lg flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-gray-300 object-cover"
            />
            <div
              className="absolute bottom-0 right-0 w-8 h-8 bg-customBlue rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => document.getElementById('fileUpload').click()}
            >
              <FaRegEdit className="text-white" />
            </div>
            <input
              type="file"
              id="fileUpload"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <h2 className="mt-4 text-lg font-semibold">{profileData.name}</h2>
          <p className="text-gray-600 text-sm">{profileData.rank}</p>
          <button className="mt-2 px-4 py-2 bg-customBlue text-white rounded">
            {profileData.position}
          </button>
        </div>

        <div className="h-20 w-full border-b-2 p-4 flex items-center">
          <div className="ml-auto flex items-center">
            {file && (
              <div className="flex items-center mr-8 md:mr-32">
                <span className='ml-3 text-sm md:text-base'>{file.name}</span>
              </div>
            )}
            <input
              type="file"
              id="resumeUpload"
              className="hidden"
              onChange={handleFileChange}
            />
            <label htmlFor="resumeUpload" className="cursor-pointer text-black">
              <FaRegEdit className='text-xl md:text-2xl' />
            </label>
          </div>
        </div>

        <div className='h-24 border bg-black'>
          {/* Add your advertisement content here */}
        </div>
      </aside>

      <main className="w-full lg:w-2/3 p-0 h-screen">
        <div className="flex-1 overflow-scroll p-4 space-y-4">
          {Object.entries({
            lastVesselType: 'Last Vessel Type',
            vesselAppliedFor: 'Vessel Applied For',
            dateOfAvailability: 'Date of Availability',
          }).map(([key, title]) => (
            <div key={key} className="p-4 bg-white border-1 border-[#D6D6D6] px-12 py-10 relative">
              <h3 className="text-lg font-semibold flex justify-between">
                {title}
                <FaEdit className="cursor-pointer" onClick={() => handleEditClick(key)} />
              </h3>
              <div className="mt-2 text-black">
                {renderEditableField(key, key, sectionData[key])}
              </div>
            </div>
          ))}

          {['contactDetail', 'experience', 'licenseHolding'].map((section) => (
            <div key={section} className="p-4 bg-white border-1 border-[#D6D6D6] px-12 py-10 relative">
              <h3 className="text-lg font-semibold flex justify-between">
                {section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')}
                <FaEdit className="cursor-pointer" onClick={() => handleEditClick(section)} />
              </h3>
              <div className="mt-2 text-black grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(sectionData[section]).map((key) => (
                  <p key={key} className="text-sm">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: <br />
                    {renderEditableField(section, key, sectionData[section][key])}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {editSection && (
            <div className="text-right">
              <button
                onClick={handleSaveClick}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default EmployeeProfile;
