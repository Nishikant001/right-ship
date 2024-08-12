import React, { useRef, useState } from 'react';
import { FaRegEdit } from "react-icons/fa";
import { CiShare2 } from "react-icons/ci";

function ProfileCard() {
  const [profileImage, setProfileImage] = useState("https://i2.pickpik.com/photos/711/14/431/smile-profile-face-male-preview.jpg");
  const fileInputRef = useRef(null);

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Profile of Nishikant Sahoo',
        text: 'Check out the profile of Nishikant Sahoo.',
        url: window.location.href,
      }).then(() => {
        console.log('Profile shared successfully');
      }).catch((error) => {
        console.error('Error sharing profile:', error);
      });
    } else {
      console.error('Share API not supported');
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
          onClick={handleEditClick}
        >
          <FaRegEdit className="text-white" />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <h2 className="mt-4 text-lg font-semibold">Nishikant Sahoo</h2>
      <p className="text-gray-600 text-sm">Present Rank</p>
      <button className="mt-2 px-4 py-2 bg-customBlue text-white rounded">
        Chief Officer
      </button>
      <CiShare2
        className="mt-4 text-xl text-gray-500 cursor-pointer"
        onClick={handleShareClick}
      />
    </div>
  );
}

export default ProfileCard;
