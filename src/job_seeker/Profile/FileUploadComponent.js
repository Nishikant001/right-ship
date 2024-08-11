import React, { useState } from 'react';
import { FaRegEdit } from "react-icons/fa";

function FileUploadComponent() {
  const [file, setFile] = useState(null);

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
