import React, { useState, useEffect } from 'react';
import { FaRegEdit } from "react-icons/fa";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProfileCard() {
  const [profileImage, setProfileImage] = useState( "https://i2.pickpik.com/photos/711/14/431/smile-profile-face-male-preview.jpg");
  const [profileData, setProfileData] = useState('');

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
        if (!response.ok) {
          throw new Error(`Failed to fetch user details: ${response.statusText}`);
          
        }
        const result = await fetchProfileData.json();
        console.log(result)
        const profile_photo=result.data?.profile_photo
        console.log(profile_photo)
        setProfileImage(profile_photo)

      

        

        

        
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
    }
  }

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
