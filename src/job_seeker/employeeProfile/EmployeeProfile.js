import React, { useState, useEffect } from 'react';
import { FaRegEdit, FaEdit } from "react-icons/fa";
import axios from 'axios';
import { useSelector } from 'react-redux';
import EditModal from './EditModal';

const EmployeeProfile = () => {
  const [profileImage, setProfileImage] = useState("https://i2.pickpik.com/photos/711/14/431/smile-profile-face-male-preview.jpg");
  const [profileData, setProfileData] = useState({ name: '', rank: '', position: '' });
  const [file, setFile] = useState(null);
  const [editSection, setEditSection] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); 
  const [editValue, setEditValue] = useState({});
  const [sectionData, setSectionData] = useState({
    lastVesselType: '',
    applyvessel: '', 
    appliedRank: '', 
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
          applyvessel: result?.applyvessel || '', 
          appliedRank: result?.appliedRank || '', 
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

  const handleEditClick = (section, value) => {
    setEditSection(section);
    setEditValue(value);
    setModalOpen(true); 
  };

  const handleSaveClick = async () => {
    try {
      if (typeof sectionData[editSection] === 'string') {
        setSectionData({
          ...sectionData,
          [editSection]: editValue,
        });
      } else {
        setSectionData({
          ...sectionData,
          [editSection]: {
            ...editValue,
          },
        });
      }

      const payload = {
        employee_id: employeeId,
        lastVesselType: sectionData.lastVesselType,
        applyvessel: sectionData.applyvessel, 
        appliedRank: sectionData.appliedRank, 
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
      setModalOpen(false); 
      setEditSection(null);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleChange = (e, field) => {
    setEditValue({
      ...editValue,
      [field]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100">
      {/* Sidebar for Profile Info and Uploads */}
      <aside className=" w-full lg:my-8 lg:ms-8 rounded-xl lg:w-1/3 p-8 bg-white shadow-lg flex flex-col space-y-8">
        <div className="bg-white p-8 border rounded-xl shadow-md flex flex-col items-center text-center">
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-gray-200 object-cover shadow-md"
            />
            <div
              className="absolute bottom-0 right-0 w-10 h-10 bg-customBlue rounded-full flex items-center justify-center cursor-pointer shadow"
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
          <h2 className="mt-4 text-2xl font-semibold text-black">{profileData.name}</h2>
          <p className="text-gray-400 text-sm">{profileData.rank}</p>
          <button className="mt-3 px-6 py-2 bg-customBlue text-white rounded-full shadow-md hover:bg-customBlue-dark">
            {profileData.position}
          </button>
        </div>

        <div className="bg-white p-8 border rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-black mb-4">Upload Resume</h3>
          <label htmlFor="resumeUpload" className="cursor-pointer text-gray-600 mb-2 hover:text-gray-900">
            <FaRegEdit className="text-2xl" />
          </label>
          <div className="flex items-center">
            {file && (
              <span className="text-gray-600">{file.name}</span>
            )}
            <input
              type="file"
              id="resumeUpload"
              className="hidden"
              accept=".pdf, .doc, .docx"
              onChange={(e) => handleFileChange(e, 'resume')}
            />
          </div>
        </div>

        <div className="bg-gray-100 p-8 border rounded-xl shadow-md flex items-center justify-center text-gray-500">
          <span>Advertisement</span>
        </div>
      </aside>

      {/* Main Content for Profile Details */}
      <div className="w-full lg:w-2/3 p-8 space-y-8 overflow-y-auto bg-gray-100">
        {Object.entries({
          lastVesselType: 'Last Vessel Type',
          applyvessel: 'Vessel Applied For', 
          appliedRank: 'Applied Rank', 
          dateOfAvailability: 'Date of Availability',
        }).map(([key, title]) => (
          <div key={key} className="bg-white p-8 border rounded-xl shadow-md relative">
            <h3 className="text-lg font-semibold text-black flex justify-between">
              {title}
              <FaEdit className="cursor-pointer text-gray-600 hover:text-gray-900" onClick={() => handleEditClick(key, sectionData[key])} />
            </h3>
            <div className="mt-2 text-gray-600">
              <p>{sectionData[key]}</p>
            </div>
          </div>
        ))}

        {['contactDetail', 'experience', 'licenseHolding', 'address', 'others'].map((section) => (
          <div key={section} className="bg-white p-8 border rounded-xl shadow-md relative">
            <h3 className="text-lg font-semibold text-black flex justify-between">
              {section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')}
              <FaEdit className="cursor-pointer text-gray-600 hover:text-gray-900" onClick={() => handleEditClick(section, sectionData[section])} />
            </h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-600">
              {Object.keys(sectionData[section]).map((key) => (
                <div key={key}>
                  <p className="text-sm font-semibold text-black">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</p>
                  <p className="mt-1 text-gray-600">{sectionData[section][key]}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Modal for Editing */}
        <EditModal
          isOpen={modalOpen}
          title={`Edit ${editSection}`}
          onSave={handleSaveClick}
          onClose={() => setModalOpen(false)}
        >
          {typeof sectionData[editSection] === 'string' ? (
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
          ) : (
            Object.keys(sectionData[editSection] || {}).map((field) => (
              <div key={field} className="mb-4">
                <label className="block text-sm font-medium text-black mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={editValue[field] || sectionData[editSection][field]}
                  onChange={(e) => handleChange(e, field)}
                />
              </div>
            ))
          )}
        </EditModal>
      </div>
    </div>
  );
}

export default EmployeeProfile;
