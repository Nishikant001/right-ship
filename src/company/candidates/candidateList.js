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
        setCandidates(response.data.data);
        return response.data.data;
      } else {
        throw new Error('Failed to fetch employee details');
      }
    } catch (error) {
      console.error("Error fetching employee details:", error.message);
      throw error;
    }
  }, []);

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

  const extractEmployeeIds = useCallback((data) => {
    return data.flatMap(item =>
      (item.applied_by || []).map(applied => applied.employee_id)
    ).filter(Boolean);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const employeeIds = await fetchPosts();
        const employees = await fetchEmployeeDetails(employeeIds);
        setCandidates(employees);
      } catch (err) {
        setError(err.message);
        setCandidates(dummyCandidates);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [fetchPosts, fetchEmployeeDetails]);

  const handleSortChange = () => {
    setSortByDate(!sortByDate);
  };



  const [shipOptions, setShipOptions] = useState([]);

  const [rankOptions, setRankOptions] = useState([]);


  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await axios.post('https://api.rightships.com/attributes/get', {}, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
          }
        });

        if (response.data && response.data.code === 200) {
          const attributes = response.data.data;


          const shipAttribute = attributes.find(attr => attr.name.toLowerCase() === 'ships');

          const rankAttribute = attributes.find(attr => attr.name.toLowerCase() === 'rank');


          const shipData = shipAttribute ? shipAttribute.values.sort((a, b) => a.localeCompare(b)) : []; // Sorting ship data

          const rankData = rankAttribute ? rankAttribute.values.sort((a, b) => a.localeCompare(b)) : [];


          setShipOptions(shipData); // Set ship options for Last Vessel Type

          setRankOptions(rankData);
        } else {
          console.error('Failed to fetch attributes:', response.data.msg);
        }
      } catch (error) {
        console.error('Failed to fetch attributes:', error);
      }
    };

    fetchAttributes();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Loading candidates...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Candidates</h2>

      <div className="mb-4 flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
        <select
          value={rankFilter}
          onChange={e => setRankFilter(e.target.value)}
          className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="">Filter by Rank</option>
          {rankOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={shipTypeFilter}
          onChange={e => setShipTypeFilter(e.target.value)}
          className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        >
          <option value="">Filter by Ship Type</option>
          {shipOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          onClick={handleSortChange}
          className="p-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Sort by Date {sortByDate ? 'Descending' : 'Ascending'}
        </button>
      </div>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-3 px-6 bg-blue-600 text-white font-semibold text-sm text-left">Name</th>
              <th className="py-3 px-6 bg-blue-600 text-white font-semibold text-sm text-left">Applied Rank</th>
              <th className="py-3 px-6 bg-blue-600 text-white font-semibold text-sm text-left">Past Rank</th>
              <th className="py-3 px-6 bg-blue-600 text-white font-semibold text-sm text-left">Apply Vessel</th>
              <th className="py-3 px-6 bg-blue-600 text-white font-semibold text-sm text-left">Exp. Past Vessel</th>
              <th className="py-3 px-6 bg-blue-600 text-white font-semibold text-sm text-left">Date of Availability</th>
              {/* <th className="py-3 px-6 bg-blue-600 text-white font-semibold text-sm text-left">Full Detail</th> */}
            </tr>
          </thead>
          <tbody>
            {candidates && candidates.length > 0 ? (
              candidates.map((candidate) => (
                <tr key={candidate.id} className="border-t">
                  <td className="py-4 px-6 text-gray-700">
                    <Link to={`/job/candidates/detail/${candidate._id}`} className="text-blue-600 hover:underline">
                      <ListView data={[candidate.name, `DOB : ${candidate.dateOfBirth}`, `Gender : ${candidate.gender}`]} />

                    </Link>
                  </td>
                  <td className="py-4 px-6 text-gray-700">{candidate.appliedRank}</td>
                  <td className="py-4 px-6 text-gray-700">{candidate.presentRank}</td>
                  <td className="py-4 px-6 text-gray-700">{candidate.applyvessel}</td>
                  <td className="py-4 px-6 text-gray-700"> <ListView data={candidate.pastvesselExp} /></td>
                  <td className="py-4 px-6 text-gray-700">{candidate.availability.split('T')[0]}</td>
                  {/* <td className="py-4 px-6 text-gray-700">{candidate.appliedDate}</td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 px-6 text-center text-gray-600">No candidates found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
    </div>
  );
};

const ListView = ({ data }) => {
  return (
    <div>

      <ul>
        {data.map((vessel, index) => (
          <li key={index}>{vessel}</li>
        ))}
      </ul>
    </div>
  );
};

export default CandidatesTable;
