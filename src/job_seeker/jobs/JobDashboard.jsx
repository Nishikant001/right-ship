import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-50 z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
  </div>
);

const CardLoader = () => (
  <motion.div
    className="bg-white p-6 rounded-xl shadow-sm animate-pulse"
  >
    <div className="h-6 bg-gray-200 rounded mb-4"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 bg-gray-200 rounded mb-2"></div>
    <div className="h-8 bg-gray-200 rounded mt-4"></div>
  </motion.div>
);

const JobTypeFilter = ({ selectedTypes, setSelectedTypes, options, title, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckboxChange = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
    onFilterChange();
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <input
        type="text"
        placeholder={`Search ${title.toLowerCase()}...`}
        className="w-full px-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="mt-3 max-h-48 overflow-y-auto">
        {filteredOptions.map(option => (
          <label key={option} className="flex items-center mb-2 cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              checked={selectedTypes.includes(option)}
              onChange={() => handleCheckboxChange(option)}
            />
            <span className="ml-2 text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const JobCard = ({ job, onCardClick }) => (
  <motion.div
    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300 cursor-pointer"
    onClick={() => onCardClick(job)}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <h3 className="text-xl font-bold text-gray-800">{job.open_positions.join(', ')}</h3>
    <p className="text-sm text-gray-600 mt-1">{job.company_name} • {new Date(job.created_date).toLocaleDateString()}</p>
    <p className="mt-3 text-gray-700">{job.description || "No description available"}</p>
    <div className="mt-4 flex space-x-3">
      <button className="px-4 py-2 rounded-lg bg-green-100 text-green-700 font-medium hover:bg-green-200 transition duration-200">Save</button>
      <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition duration-200">Apply</button>
    </div>
  </motion.div>
);

const JobDetailsCanvas = ({ job, onClose }) => (
  <motion.div
    initial={{ x: '100%' }}
    animate={{ x: 0 }}
    exit={{ x: '100%' }}
    transition={{ type: 'tween', duration: 0.3 }}
    className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg p-6 overflow-y-auto z-50"
  >
    <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700">&times;</button>
    <h2 className="text-2xl font-bold mb-4 text-gray-800">{job.open_positions.join(', ')}</h2>
    <p className="text-gray-600 mb-2">{job.company_name} • {new Date(job.created_date).toLocaleDateString()}</p>
    <p className="mb-4 text-gray-700">{job.description || "No description available"}</p>
  </motion.div>
);

const App = () => {
  const [selectedRanks, setSelectedRanks] = useState([]);
  const [selectedVessels, setSelectedVessels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputSearchTerm, setInputSearchTerm] = useState(''); // New state to hold input value
  const [selectedJob, setSelectedJob] = useState(null);

  const [rankOptions, setRankOptions] = useState([]);
  const [shipOptions, setShipOptions] = useState([]);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingJobs, setFetchingJobs] = useState(false);
  const [error, setError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  // Fetch rank and ship options on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.post('https://api.rightships.com/attributes/get', {});
        if (response.data.code === 200) {
          const attributes = response.data.data;
          const shipAttribute = attributes.find(attr => attr.name.toLowerCase() === 'ships');
          const rankAttribute = attributes.find(attr => attr.name.toLowerCase() === 'rank');

          setShipOptions(shipAttribute ? shipAttribute.values : []);
          setRankOptions(rankAttribute ? rankAttribute.values : []);
        } else {
          setError('Failed to fetch options data.');
        }
      } catch (error) {
        setError('An error occurred while fetching options data.');
      }
    };

    fetchOptions();
  }, []);

  const fetchJobDetails = async () => {
    setFetchingJobs(true);
    try {
      const response = await axios.post('https://api.rightships.com/company/application/get', {
        searchTerm,
        rank: selectedRanks,
        shiptype: selectedVessels,
        page: currentPage,
        limit: jobsPerPage,
      });
      if (response.data.code === 200) {
        setJobs(response.data.applications);
      } else {
        setError('Failed to fetch job details.');
      }
    } catch (error) {
      setError('An error occurred while fetching job details.');
    } finally {
      setFetchingJobs(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
    setLoading(false);
  }, [currentPage]);

  useEffect(() => {
    fetchJobDetails();
  }, [selectedRanks, selectedVessels]);

  const handleSearchClick = () => {
    setSearchTerm(inputSearchTerm); // Update searchTerm with the input value
    fetchJobDetails();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-50 min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Filters</h2>

              <JobTypeFilter
                selectedTypes={selectedRanks}
                setSelectedTypes={setSelectedRanks}
                options={rankOptions}
                title="Rank"
                onFilterChange={fetchJobDetails}
              />

              <JobTypeFilter
                selectedTypes={selectedVessels}
                setSelectedTypes={setSelectedVessels}
                options={shipOptions}
                title="Vessel Type"
                onFilterChange={fetchJobDetails}
              />
            </div>
          </div>

          <div className="w-full md:w-3/4">
            <div className="flex mb-6">
              <input
                type="text"
                placeholder="Search jobs..."
                className="flex-grow px-4 py-3 rounded-l-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={inputSearchTerm} // Bind to inputSearchTerm
                onChange={(e) => setInputSearchTerm(e.target.value)}
              />
              <button
                onClick={handleSearchClick}
                className="px-4 py-3 bg-blue-600 text-white font-medium rounded-r-lg hover:bg-blue-700 transition duration-200"
              >
                Search
              </button>
            </div>

            <div className="grid gap-6">
              {fetchingJobs
                ? Array.from({ length: jobsPerPage }).map((_, index) => (
                    <CardLoader key={index} />
                  ))
                : jobs.map(job => (
                    <JobCard key={job.application_id} job={job} onCardClick={setSelectedJob} />
                  ))}
            </div>

            <div className="flex justify-center mt-6">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-l-md bg-white text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={jobs.length < jobsPerPage}
                  className="ml-1 px-3 py-2 rounded-r-md bg-white text-gray-500 hover:bg-gray-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
            />
            <JobDetailsCanvas job={selectedJob} onClose={() => setSelectedJob(null)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
