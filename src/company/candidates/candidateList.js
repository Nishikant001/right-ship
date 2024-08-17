import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';

const dummyCandidates = [
  { id: 1, name: 'John Doe', email: 'johndoe@example.com', rank: 'Captain', shipType: 'Cargo', appliedDate: '2022-01-01' },
  { id: 2, name: 'Jane Smith', email: 'janesmith@example.com', rank: 'First Mate', shipType: 'Cargo', appliedDate: '2022-02-01' },
  { id: 3, name: 'Alice Johnson', email: 'alicejohnson@example.com', rank: 'Engineer', shipType: 'Tanker', appliedDate: '2022-03-01' },
];

const CandidatesTable = ({ jobId }) => {

  const [candidates, setCandidates] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rankFilter, setRankFilter] = useState('');
  const [shipTypeFilter, setShipTypeFilter] = useState('');
  const [sortByDate, setSortByDate] = useState(false);

  const user = useSelector((state) => state.auth.user);

  // Fetch Employee Detail Base on Employee Id 
  const fetchEmployeeDetails = useCallback(async (employeeIds) => {
    try {
      const requestData = {
        employee_id: { '$in': employeeIds },
        page: 1,
        limit: 10,
      };

      const response = await axios.post('https://api.rightships.com/employee/get', requestData, {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
        },
      });

      if (response.data.code === 200) {
        console.log("Data fetched successfully: ===> dd", response.data.data);
        // Ensure the structure of response.data.data matches what you expect
        setCandidates(response.data.data);
        return response.data.data; // Ensure you are returning the correct data here
      } else {
        throw new Error('Failed to fetch employee details');
      }
    } catch (error) {
      console.error("Error fetching employee details:", error.message);
      throw error;
    }
  }, []);

  // Fetch ALl the Jobs & Employee applied
  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.post(
        'https://api.rightships.com/company/application/get',
        { company_id: user.company_id }
      );

      if (response.data.code === 200) {
        return extractEmployeeIds(response.data.applications);
      } else {
        throw new Error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error while fetching posts:', error);
      throw error;
    }
  }, [user.company_id]);

  // Get Employee_id from objects to pass in fetchEmployeeDetails
  const extractEmployeeIds = useCallback((data) => {
    return data.flatMap(item =>
      (item.applied_by || []).map(applied => applied.employee_id)
    ).filter(Boolean);
  }, []);

  // Call to action
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const employeeIds = await fetchPosts();
        const employees = await fetchEmployeeDetails(employeeIds);
        console.log("Updated candidates:", employees); // Check what data is coming here
        setCandidates(employees);
        console.log("Updated Cost:", candidates); // Check what data is coming here
      } catch (err) {
        setError(err.message);
        setCandidates(dummyCandidates);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [fetchPosts, fetchEmployeeDetails]);


  // useEffect(() => {
  //   const fetchCandidates = async () => {
  //     try {
  //       const queryParams = new URLSearchParams({
  //         rank: rankFilter,
  //         shipType: shipTypeFilter,
  //         sortByDate: sortByDate ? 'desc' : 'asc'
  //       }).toString();
  //       const response = await fetch(`/api/jobs/${jobId}/candidates?${queryParams}`);
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch candidates');
  //       }
  //       const data = await response.json();
  //       setCandidates(data);
  //     } catch (err) {
  //       setError(err.message);
  //       // Keep the current candidates instead of loading dummy data
  //     }
  //   };

  //   fetchCandidates();
  // }, [jobId, rankFilter, shipTypeFilter, sortByDate]);

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
          {candidates && candidates.length > 0 ? (
            candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td className="py-2 px-4 border-b">{candidate.id}</td>
                <td className="py-2 px-4 border-b">
                   <Link to={`/job/candidates/detail/${candidate._id}`}>
                  {candidate.name}
                  </Link></td>
                <td className="py-2 px-4 border-b">{candidate.email}</td>
                <td className="py-2 px-4 border-b">{candidate.rank}</td>
                <td className="py-2 px-4 border-b">{candidate.shipType}</td>
                <td className="py-2 px-4 border-b">{candidate.appliedDate}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-2 px-4 text-center">No candidates found.</td>
            </tr>
          )}
        </tbody>
      </table>
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
    </div>
  );
};

export default CandidatesTable;