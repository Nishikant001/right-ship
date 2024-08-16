import React, { useEffect, useState } from 'react';

// Dummy data from a JSON file or as a hardcoded array
const dummyCandidates = [
  { id: 1, name: 'John Doe', Experience: 'johndoe@example.com', PresentRank: 'Ship Captain', AppliedRank:"", DateOfAvaliablity: "" },
  { id: 2, name: 'Jane Smith', email: 'janesmith@example.com' },
  { id: 3, name: 'Alice Johnson', email: 'alicejohnson@example.com' },
];

const CandidatesTable = ({ jobId }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        // Replace the URL with your actual API endpoint
        const response = await fetch(`/api/jobs/${jobId}/candidates`);
        if (!response.ok) {
          throw new Error('Failed to fetch candidates');
        }
        const data = await response.json();
        setCandidates(data);
      } catch (err) {
        setError(err.message);
        setCandidates(dummyCandidates); // Load dummy data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [jobId]);

  if (loading) {
    return <p>Loading candidates...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Candidates</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Experience</th>
            <th className="py-2 px-4 border-b">Present Rank</th>
            <th className="py-2 px-4 border-b">Date of Avaliablity</th>
            <th className="py-2 px-4 border-b">view</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id}>
              <td className="py-2 px-4 border-b">{candidate.id}</td>
              <td className="py-2 px-4 border-b">{candidate.name}</td>
              <td className="py-2 px-4 border-b">{candidate.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <p className="text-red-500 mt-4">Error: {error} (Showing dummy data)</p>}
    </div>
  );
};

export default CandidatesTable;
