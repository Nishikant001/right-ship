import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';

const dummyCandidate = {
  id: 1,
  name: 'John Doe',
  email: 'ancreation4004@gmail.com',
  phone: '+918384745756',
  dateOfAvailability: '23 Aug, 2024',
  dateOfBirth: '17 April, 2002',
  age: '20 yrs',
  gender: 'Male',
  totalSeaExperience: '2 yrs, 3 months',
  totalLastRankExperience: '1 yr, 6 months',
  presentRank: 'No',
  presentRankLastRank: 'No',
  shipExperience: ['Ship Name 1', 'Ship Name 2', 'Ship Name 3'],
  lastVesselType: 'Ship Name',
  vesselAppliedFor: 'Ship Name',
  licenseCOC: 'ancreation4004@gmail.com',
  cop: 'ancreation4004@gmail.com',
  watchKeeping: 'ancreation4004@gmail.com',
  address: {
    line1: 'Address1 xxxxxxxxxxx',
    line2: 'address2 xxxxxxxxxxxx',
    city: 'xxxxx',
    state: '匕',
  },
  height: 'Yes',
  weight: 'Yes',
  sidCard: '9.2',
  willingToAcceptLowerRank: 'YES',
  profileImage: 'https://via.placeholder.com/150', // Placeholder image URL
  resumeUrl: '/dummy_resume.pdf', // Placeholder resume URL
};

const CandidateDetail = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const data = {
    employee_id: candidateId
  };

  useEffect(() => {
    const fetchCandidate = async () => {
      setLoading(true);
      try {
        // Ensure you pass the data object correctly as the second parameter
        const response = await axios.post('https://api.rightships.com/employee/get', data, {});
        // Directly use the data from the response, as Axios handles JSON parsing
        setCandidate(response.data.data[0]);
        console.log(candidate, "====");
      } catch (err) {
        // Handle errors more accurately here
        console.error('Error fetching candidate details:', err);
        setError(err.message);
        setCandidate(dummyCandidate); // Fallback to dummy data on error
      } finally {
        setLoading(false);
      }
    };
  
    fetchCandidate();
  }, [candidateId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!candidate) {
    return <p className="text-center text-xl mt-8 text-gray-600">No candidate found.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen ">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
          <img
          loading="lazy"
          className="h-48 w-full object-cover md:w-48"
          src={candidate.profileImage || 'https://via.placeholder.com/150'}
          alt={candidate.name}
        />
          
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {candidate.presentRank || 'Candidate'}
            </div>
            <h1 className="block mt-1 text-3xl leading-tight font-bold text-gray-900">
              {candidate.name}
            </h1>
            <p className="mt-2 text-gray-600">
              {candidate.email} | {candidate.phone}
            </p>
            <div className="mt-4">
              <a
                href={candidate.resumeUrl}
                download={`${candidate.name}-resume.pdf`}
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <InfoCard title="Personal Information">
          <InfoItem icon="📅" label="Available From" value={candidate.dateOfAvailability} />
          <InfoItem icon="🎂" label="Date of Birth" value={candidate.dateOfBirth} />
          <InfoItem icon="👤" label="Age" value={candidate.age} />
          <InfoItem icon="⚧" label="Gender" value={candidate.gender} />
        </InfoCard>

        <InfoCard title="Professional Experience">
          <InfoItem icon="⚓" label="Total Sea Experience" value={candidate.totalSeaExperience} />
          <InfoItem icon="🏅" label="Last Rank Experience" value={candidate.totalLastRankExperience} />
          <InfoItem icon="🚢" label="Last Vessel Type" value={candidate.lastVesselType} />
          <InfoItem icon="🎯" label="Vessel Applied For" value={candidate.vesselAppliedFor} />
        </InfoCard>

        <InfoCard title="Certifications">
          <InfoItem icon="📜" label="License (COC)" value={candidate.licenseCOC} />
          <InfoItem icon="🏆" label="COP" value={candidate.cop} />
          <InfoItem icon="⏰" label="Watch Keeping" value={candidate.watchKeeping} />
        </InfoCard>

        <InfoCard title="Additional Details">
          <InfoItem icon="📏" label="Height" value={candidate.height} />
          <InfoItem icon="⚖️" label="Weight" value={candidate.weight} />
          <InfoItem icon="🆔" label="SID Card" value={candidate.sidCard} />
          <InfoItem icon="👍" label="Open to Lower Rank" value={candidate.willingToAcceptLowerRank} />
        </InfoCard>
      </div>

      {error && <p className="text-red-500 mt-4 text-center">Error: {error} (Showing dummy data)</p>}
    </div>
  );

};

const InfoCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 ease-in-out">
    <div className="px-6 py-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  </div>
);

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center">
    <span className="text-xl mr-3">{icon}</span>
    <div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="text-gray-900">{value || 'N/A'}</p>
    </div>
  </div>
);

export default CandidateDetail;
