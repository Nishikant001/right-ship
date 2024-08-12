import React, { useState, useEffect } from 'react';
import { FaRegEdit } from "react-icons/fa";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProfileCard() {
  const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImage') || "https://i2.pickpik.com/photos/711/14/431/smile-profile-face-male-preview.jpg");
  const [profileData, setProfileData] = useState({
    name: localStorage.getItem('profileName') || '',
    rank: localStorage.getItem('profileRank') || '',
    
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

        if (response.data) {
          const { 
            profile_photo, name, 
            presentRank } = response.data;
          const finalProfileImage = 
          profile_photo;

          setProfileImage(finalProfileImage);
          setProfileData({ name, 
            presentRank });

          // Store data in local storage
          localStorage.setItem('profileImage', finalProfileImage);
          localStorage.setItem('profileName', name);
          localStorage.setItem('profileRank', 
            presentRank);
         
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    if (contactInfo) {
      fetchProfileData();
    }
  }, [contactInfo]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('https://api.rightships.com/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data && response.data.imageUrl) {
          const newProfileImage = response.data.imageUrl;
          setProfileImage(newProfileImage);
          localStorage.setItem('profileImage', newProfileImage);
        }
      } catch (error) {
        console.error('Error uploading the image:', error);
      }
    }
  };

  return (
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
      <h2 className="mt-4 text-lg font-semibold">{profileData.name || 'Nishikant Sahoo'}</h2>
      <p className="text-gray-600 text-sm">{profileData.rank || 'Present Rank'}</p>
      <button className="mt-2 px-4 py-2 bg-customBlue text-white rounded">
        {profileData.position || 'Chief Officer'}
      </button>
    </div>
  );
}

export default ProfileCard;
