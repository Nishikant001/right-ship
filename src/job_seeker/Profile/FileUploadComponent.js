import React, { useState, useEffect } from 'react';
import { FaRegEdit } from "react-icons/fa";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function FileUploadComponent() {
  const [file, setFile] = useState(null);
  const location = useLocation();
  const employeeId = location.state?.employeeId;
  const contactInfo = useSelector((state) => state.contact.contactInfo);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axios.post('https://api.rightships.com/user/details', {
          mobile_no: contactInfo,
          user_type: 'employee', // Ensure this matches the API's required payload
        });

        console.log('API Response:', response);

        const data = response.data;
        console.log('Response Data:', data);

        if (data && (data.resume || data.resume_url)) {
          const resumeUrl = data.resume || data.resume_url;
          setFile({
            name: resumeUrl.split('/').pop(),
            type: resumeUrl.endsWith('.pdf') ? 'application/pdf' : 'application/msword',
            url: resumeUrl,
          });
        } else {
          console.warn('Resume field not found in response data.');
        }
      } catch (error) {
        console.error('Error fetching resume:', error);
      }
    };

    if (contactInfo) {
      fetchResume();
    }
  }, [contactInfo]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) {
      return 'fa-file-pdf';
    } else if (fileType.includes('word')) {
      return 'fa-file-word';
    } else {
      return 'fa-file-alt';
    }
  };

  return (
    <div className="h-20 w-full border-b-2 p-4 flex items-center">
      <div className="ml-auto flex items-center">
        {file && (
          <div className="flex items-center mr-8 md:mr-32">
            <i className={`fas ${getFileIcon(file.type)} text-2xl text-gray-600 mr-2`}></i>
            <span className='ml-3 text-sm md:text-base '>{file.name}</span>
          </div>
        )}
        <input
          type="file"
          id="fileUpload"
          className="hidden"
          onChange={handleFileChange}
        />
        <label htmlFor="fileUpload" className="cursor-pointer text-black">
          <FaRegEdit className='text-xl md:text-2xl' />
        </label>
      </div>
    </div>
  );
}

export default FileUploadComponent;
