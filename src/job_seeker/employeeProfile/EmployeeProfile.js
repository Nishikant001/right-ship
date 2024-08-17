import React, { useState, useEffect } from 'react';
import { FaRegEdit, FaEdit } from "react-icons/fa";
import axios from 'axios';
import { useSelector } from 'react-redux';

const EmployeeProfile = () => {
  const [profileImage, setProfileImage] = useState("https://i2.pickpik.com/photos/711/14/431/smile-profile-face-male-preview.jpg");
  const [profileData, setProfileData] = useState({ name: '', rank: '', position: '' });
  const [file, setFile] = useState(null);
  const [editSection, setEditSection] = useState(null);
  const [sectionData, setSectionData] = useState({
    lastVesselType: '',
    applyvessel: '', // Updated for vessel applied field
    appliedRank: '', // Added applied rank
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
    address: {
      address1: '',
      address2: '',
      state: '',
      pincode: '',
      nationality: '',
      city: '',
      country: '',
    },
    others: {
      height: '',
      bmi: '',
      weight: '',
      sidCard: '',
      willingToAcceptLowerRank: '',
    }
  });

  const authState = useSelector((state) => state.auth);
  const employeeId = authState?.user?._id;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.post('https://api.rightships.com/employee/get', {
          employee_id: { $in: [employeeId] },
          page: 1,
          limit: 10
        });

        const result = response.data.data[0];

        setProfileImage(result?.profile_photo || profileImage);
        setProfileData({
          name: result?.name || '',
          rank: result?.rank || '',
          position: result?.position || ''
        });

        setSectionData({
          lastVesselType: result?.lastVesselType || '',
          applyvessel: result?.applyvessel || '', // Updated for vessel applied field
          appliedRank: result?.appliedRank || '', // Updated for applied rank field
          dateOfAvailability: result?.dateOfAvailability || '',
          contactDetail: {
            email: result?.contactDetail?.email || '',
            whatsappNumber: result?.contactDetail?.whatsappNumber || '',
            dob: result?.contactDetail?.dob || '',
            age: result?.contactDetail?.age || '',
            gender: result?.contactDetail?.gender || '',
          },
          experience: {
            seaExperience: result?.experience?.seaExperience || '',
            lastRankExperience: result?.experience?.lastRankExperience || '',
            presentRank: result?.experience?.presentRank || '',
            lastRank: result?.experience?.lastRank || '',
          },
          licenseHolding: {
            coc: result?.licenseHolding?.coc || '',
            cop: result?.licenseHolding?.cop || '',
            watchKeeping: result?.licenseHolding?.watchKeeping || '',
          },
          address: {
            address1: result?.address?.address1 || '',
            address2: result?.address?.address2 || '',
            state: result?.address?.state || '',
            pincode: result?.address?.pincode || '',
            nationality: result?.address?.nationality || '',
            city: result?.address?.city || '',
            country: result?.address?.country || '',
          },
          others: {
            height: result?.others?.height || '',
            bmi: result?.others?.bmi || '',
            weight: result?.others?.weight || '',
            sidCard: result?.others?.sidCard || '',
            willingToAcceptLowerRank: result?.others?.willingToAcceptLowerRank || '',
          }
        });

      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    if (employeeId) {
      fetchProfileData();
    }
  }, [employeeId]);

  const handleFileChange = async (event, type) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const validProfileImageTypes = ['image/jpeg', 'image/png'];
      const validResumeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

      if (type === 'profile' && !validProfileImageTypes.includes(selectedFile.type)) {
        alert('Invalid profile picture file type. Please upload a JPEG or PNG file.');
        return;
      }

      if (type === 'resume' && !validResumeTypes.includes(selectedFile.type)) {
        alert('Invalid resume file type. Please upload a PDF, DOC, or DOCX file.');
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await axios.post('https://api.rightships.com/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const fileUrl = response.data.file_url;
        setFile({ name: selectedFile.name, url: fileUrl });

        const updatePayload = {
          employee_id: employeeId,
        };

        if (type === 'resume') {
          updatePayload.resume = fileUrl;
        } else if (type === 'profile') {
          updatePayload.profile_photo = fileUrl;
          setProfileImage(fileUrl);
        }

        await axios.post('https://api.rightships.com/employee/update', updatePayload, {
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
          },
        });

        console.log(`${type} updated successfully`);
      } catch (error) {
        console.error(`Error uploading ${type}:`, error.response?.data || error.message);
      }
    }
  };

  const handleEditClick = (section) => {
    setEditSection(section);
  };

  const handleSaveClick = async () => {
    try {
      const payload = {
        employee_id: employeeId,
        lastVesselType: sectionData.lastVesselType,
        applyvessel: sectionData.applyvessel, // Updated for vessel applied field
        appliedRank: sectionData.appliedRank, // Updated for applied rank field
        availability: sectionData.dateOfAvailability,
        contactDetail: sectionData.contactDetail,
        experience: sectionData.experience,
        licenseHolding: sectionData.licenseHolding,
        address: sectionData.address,
        others: sectionData.others,
      };

      await axios.post('https://api.rightships.com/employee/update', payload, {
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
      });

      console.log('Data updated successfully');
      setEditSection(null);
    } catch (error) {
      console.error('Error updating data:', error);
    }
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
      <aside className="sticky top-2 right-0 w-full lg:w-1/3 p-4 bg-white shadow-md overflow-y-auto">
        <div className="bg-white p-4 border-b-2 shadow-lg flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-gray-300 object-cover"
            />
            <div
              className="absolute bottom-0 right-0 w-8 h-8 bg-customBlue rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => document.getElementById('profileUpload').click()}
            >
              <FaRegEdit className="text-white" />
            </div>
            <input
              type="file"
              id="profileUpload"
              className="hidden"
              accept="image/jpeg, image/png"
              onChange={(e) => handleFileChange(e, 'profile')}
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
              accept=".pdf, .doc, .docx"
              onChange={(e) => handleFileChange(e, 'resume')}
            />
            <label htmlFor="resumeUpload" className="cursor-pointer text-black">
              <FaRegEdit className='text-xl md:text-2xl' />
            </label>
          </div>
        </div>

        <div className='h-24 border bg-gray-300 flex items-center justify-center'>
          <span>Advertisement</span>
        </div>
      </aside>

      <div className="w-full lg:w-2/3 p-0 h-screen">
        <div className="flex-1 overflow-scroll p-4 space-y-4">
          {Object.entries({
            lastVesselType: 'Last Vessel Type',
            applyvessel: 'Vessel Applied For',  // Updated for vessel applied field
            appliedRank: 'Applied Rank',  // Added applied rank field
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

          {['contactDetail', 'experience', 'licenseHolding', 'address', 'others'].map((section) => (
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
      </div>
    </div>
  );
}

export default EmployeeProfile;

