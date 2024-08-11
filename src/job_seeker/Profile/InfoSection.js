import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import axios from 'axios';

function InfoSection() {
  const [editSection, setEditSection] = useState(null);
  const [sectionData, setSectionData] = useState({
    lastVesselType: '',
    vesselAppliedFor: '',
    dateOfAvailability: '',
    contactDetail: {
      email: '',
      whatsapp: '',
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
      lowerRank: '',
    },
  });

  const handleEditClick = (section) => {
    setEditSection(section);
  };

  const handleSaveClick = () => {
    updateUserData();
    setEditSection(null);
  };

  const handleChange = (section, key, value) => {
    setSectionData({
      ...sectionData,
      [section]: {
        ...sectionData[section],
        [key]: value,
      },
    });
  };

  const updateUserData = () => {
    const payload = {
      employee_id: '669b88908c9761528b0cfbb6', // replace with actual employee_id
      name: sectionData.contactDetail.email, // replace or add other relevant data here
      // Add other fields as required by your API
    };

    axios.post('https://api.rightships.com/employee/update', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
    })
    .then((response) => {
      console.log('Data updated successfully:', response.data);
    })
    .catch((error) => {
      console.error('Error updating data:', error);
    });
  };

  const renderEditableField = (section, key, value) => (
    editSection === section ? (
      <input
        type="text"
        className="border p-1 rounded"
        value={value}
        onChange={(e) => handleChange(section, key, e.target.value)}
      />
    ) : (
      <b>{value}</b>
    )
  );

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-scroll h-screen p-4 space-y-4" style={{height:"62em"}}>
        <div className="p-4 bg-white border-2 rounded-lg shadow relative">
          <h3 className="text-lg font-semibold flex justify-between">
            Last Vessel Type
            <FaEdit className="cursor-pointer" onClick={() => handleEditClick('lastVesselType')} />
          </h3>
          <div className="mt-2 text-black">
            {renderEditableField('lastVesselType', 'lastVesselType', sectionData.lastVesselType)}
          </div>
        </div>

        <div className="p-4 bg-white border-2 rounded-lg shadow relative">
          <h3 className="text-lg font-semibold flex justify-between">
            Vessel Applied For
            <FaEdit className="cursor-pointer" onClick={() => handleEditClick('vesselAppliedFor')} />
          </h3>
          <div className="mt-2 text-black">
            {renderEditableField('vesselAppliedFor', 'vesselAppliedFor', sectionData.vesselAppliedFor)}
          </div>
        </div>

        <div className="p-4 bg-white border-2 rounded-lg shadow relative">
          <h3 className="text-lg font-semibold flex justify-between">
            Date of Availability
            <FaEdit className="cursor-pointer" onClick={() => handleEditClick('dateOfAvailability')} />
          </h3>
          <div className="mt-2 text-black">
            {renderEditableField('dateOfAvailability', 'dateOfAvailability', sectionData.dateOfAvailability)}
          </div>
        </div>

        <div className="p-4 bg-white border-2 rounded-lg shadow relative">
          <h3 className="text-lg font-semibold flex justify-between">
            Contact Detail
            <FaEdit className="cursor-pointer" onClick={() => handleEditClick('contactDetail')} />
          </h3>
          <div className="mt-2 text-black grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(sectionData.contactDetail).map((key) => (
              <p key={key} className="text-sm">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: <br />
                {renderEditableField('contactDetail', key, sectionData.contactDetail[key])}
              </p>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white border-2 rounded-lg shadow relative">
          <h3 className="text-lg font-semibold flex justify-between">
            Experience
            <FaEdit className="cursor-pointer" onClick={() => handleEditClick('experience')} />
          </h3>
          <div className="mt-2 text-black grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(sectionData.experience).map((key) => (
              <p key={key} className="text-sm">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: <br />
                {renderEditableField('experience', key, sectionData.experience[key])}
              </p>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white border-2 rounded-lg shadow relative">
          <h3 className="text-lg font-semibold flex justify-between">
            License Holding
            <FaEdit className="cursor-pointer" onClick={() => handleEditClick('licenseHolding')} />
          </h3>
          <div className="mt-2 text-black grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(sectionData.licenseHolding).map((key) => (
              <p key={key} className="text-sm">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: <br />
                {renderEditableField('licenseHolding', key, sectionData.licenseHolding[key])}
              </p>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white border-2 rounded-lg shadow relative">
          <h3 className="text-lg font-semibold flex justify-between">
            Address
            <FaEdit className="cursor-pointer" onClick={() => handleEditClick('address')} />
          </h3>
          <div className="mt-2 text-black grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(sectionData.address).map((key) => (
              <p key={key} className="text-sm">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: <br />
                {renderEditableField('address', key, sectionData.address[key])}
              </p>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white border-2 rounded-lg shadow relative">
          <h3 className="text-lg font-semibold flex justify-between">
            Others
            <FaEdit className="cursor-pointer" onClick={() => handleEditClick('others')} />
          </h3>
          <div className="mt-2 text-black flex flex-wrap gap-10">
            {Object.keys(sectionData.others).map((key) => (
              <p key={key} className="text-sm">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: <br />
                {renderEditableField('others', key, sectionData.others[key])}
              </p>
            ))}
          </div>
        </div>

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
  );
}

export default InfoSection;
