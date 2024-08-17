import React, { useEffect, useState } from 'react';

const dummyCandidates = [
  { id: 1, name: 'John Doe', email: 'johndoe@example.com', rank: 'Captain', shipType: 'Cargo', appliedDate: '2022-01-01' },
  { id: 2, name: 'Jane Smith', email: 'janesmith@example.com', rank: 'First Mate', shipType: 'Cargo', appliedDate: '2022-02-01' },
  { id: 3, name: 'Alice Johnson', email: 'alicejohnson@example.com', rank: 'Engineer', shipType: 'Tanker', appliedDate: '2022-03-01' },
];

const CandidatesTable = ({ jobId }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rankFilter, setRankFilter] = useState('');
  const [shipTypeFilter, setShipTypeFilter] = useState('');
  const [sortByDate, setSortByDate] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {

        try {
            const requestData = {
                company_id: user.company_id, // Replace this with dynamic company_id if available
                application_id: id,
            };

            const response = await axios.post('https://api.rightships.com/company/application/get', requestData);

            if (response.data.code === 200) {

                setJob(response.data.application); // Assuming the response contains a list of applications
                console.log(response.data.application);
                setLoading(false);
            } else {
                setError('Failed to fetch job details.');
                setLoading(false);
            }
        } catch (error) {
            setError('An error occurred while fetching job details.', error);
            setLoading(false);
        }
    };

    fetchJobDetail();
  }, [id]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        // Add query parameters as needed for your API
        const queryParams = new URLSearchParams({
          rank: rankFilter,
          shipType: shipTypeFilter,
          sortByDate: sortByDate ? 'desc' : 'asc'
        }).toString();
        const response = await fetch(`/api/jobs/${jobId}/candidates?${queryParams}`);
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
  }, [jobId, rankFilter, shipTypeFilter, sortByDate]);

  const handleSortChange = () => {
    setSortByDate(!sortByDate);
  };

  if (loading) {
    return <p>Loading candidates...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Candidates</h2>
      <div>
        <select value={rankFilter} onChange={e => setRankFilter(e.target.value)}>
          <option value="">Filter by Rank</option>
          <option value="Captain">Captain</option>
          <option value="First Mate">First Mate</option>
          <option value="Engineer">Engineer</option>
        </select>
        <select value={shipTypeFilter} onChange={e => setShipTypeFilter(e.target.value)}>
          <option value="">Filter by Ship Type</option>
          <option value="Cargo">Cargo</option>
          <option value="Tanker">Tanker</option>
        </select>
        <button onClick={handleSortChange}>
          Sort by Date {sortByDate ? 'Descending' : 'Ascending'}
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Rank</th>
            <th className="py-2 px-4 border-b">Ship Type</th>
            <th className="py-2 px-4 border-b">Applied Date</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id}>
              <td className="py-2 px-4 border-b">{candidate.id}</td>
              <td className="py-2 px-4 border-b">{candidate.name}</td>
              <td className="py-2 px-4 border-b">{candidate.email}</td>
              <td className="py-2 px-4 border-b">{candidate.rank}</td>
              <td className="py-2 px-4 border-b">{candidate.shipType}</td>
              <td className="py-2 px-4 border-b">{candidate.appliedDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <p className="text-red-500 mt-4">Error: {error} (Showing dummy data)</p>}
    </div>
  );
};

export default CandidatesTable;
