import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function InfoSection() {
  const location = useLocation();
  const employeeId = location.state?.employeeId; // Retrieve employeeId from location state
  const contactInfo = useSelector((state) => state.contact.contactInfo);
  const [editSection, setEditSection] = useState(null);
  const [sectionData, setSectionData] = useState({
    lastVesselType: '',
    vesselAppliedFor: '',
    dateOfAvailability: '',
    name: '', // Include name in sectionData
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

  useEffect(() => {
    const fetchData = async () => {
      if (contactInfo && employeeId) {
        const payload = {
          mobile_no: contactInfo,
          user_type: 'employee',
          employee_id: employeeId,
        };
        try {
          const response = await axios.post(
            'https://api.rightships.com/employee/details',
            payload,
            {
              headers: {
                'Content-Type': 'application/json',
                Accept: '*/*',
              },
            }
          );
          console.log('API Response:', response.data);
          setSectionData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [contactInfo, employeeId]);

  const handleEditClick = (section) => {
    setEditSection(section);
  };

  const handleSaveClick = () => {
    updateUserData();
    setEditSection(null);
  };

  const handleChange = (section, key, value) => {
    // If section is a string, directly update the value
    if (typeof sectionData[section] === 'string') {
      setSectionData({
        ...sectionData,
        [section]: value,
      });
    } else {
      // If section is an object, update the nested key
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
        employee_id: employeeId, // Use the employeeId from location state
        name: sectionData.name, // Include the name field
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
    <div className="flex h-screen">
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
    </div>
  );
}

export default InfoSection;
