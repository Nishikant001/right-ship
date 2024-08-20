import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const JobTypeFilter = ({ selectedTypes, setSelectedTypes, options, title }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckboxChange = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
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
    {/* Add more job details here */}
  </motion.div>
);

const App = () => {
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [location, setLocation] = useState('');
  const [salaryRange, setSalaryRange] = useState(0);
  const [experienceLevel, setExperienceLevel] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  const [rankOptions, setRankOptions] = useState([]);
  const [shipOptions, setShipOptions] = useState([]);
  const [selectedRanks, setSelectedRanks] = useState([]);
  const [selectedVessels, setSelectedVessels] = useState([]);
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetching job data
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.post('https://api.rightships.com/company/application/get', {});
        if (response.data.code === 200) {
          setJobs(response.data.applications); // Store applications in jobs state
          setLoading(false);
          console.log("====+>", jobs);
        } else {
          setError('Failed to fetch job details.');
          setLoading(false);
        }
      } catch (error) {
        setError('An error occurred while fetching job details.', error);
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobs]);

  // Fetching attributes for ship types and ranks
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await axios.post('https://api.rightships.com/attributes/get', {});
        if (response.data && response.data.code === 200) {
          const attributes = response.data.data;
          const shipAttribute = attributes.find(attr => attr.name.toLowerCase() === 'ships');
          const rankAttribute = attributes.find(attr => attr.name.toLowerCase() === 'rank');
          const shipData = shipAttribute ? shipAttribute.values.sort((a, b) => a.localeCompare(b)) : [];
          const rankData = rankAttribute ? rankAttribute.values.sort((a, b) => a.localeCompare(b)) : [];

          setShipOptions(shipData);
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
  
  // Filtering logic
  const filteredJobs = jobs.filter(job => 
    job.open_positions.some(position => position.toLowerCase().includes(searchTerm.toLowerCase())) ||
    job.company_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Filters</h2>

              <JobTypeFilter
                selectedTypes={selectedRanks}
                setSelectedTypes={setSelectedRanks}
                options={rankOptions}
                title="Rank"
              />

              <JobTypeFilter
                selectedTypes={selectedVessels}
                setSelectedTypes={setSelectedVessels}
                options={shipOptions}
                title="Vessel Type"
              />

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Location</h3>
                <input 
                  type="text" 
                  placeholder="Enter location" 
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Salary Range</h3>
                <input 
                  type="range" 
                  min="0" 
                  max="200000" 
                  className="w-full"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>$0</span>
                  <span>$200,000+</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Experience Level</h3>
                <div className="space-y-2">
                  {['Entry Level', 'Mid Level', 'Senior Level'].map(level => (
                    <label key={level} className="flex items-center cursor-pointer">
                      <input 
                        type="radio" 
                        name="experience" 
                        className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                        value={level}
                        checked={experienceLevel === level}
                        onChange={() => setExperienceLevel(level)}
                      />
                      <span className="ml-2 text-gray-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Job List */}
          <div className="w-full md:w-3/4">
            <input 
              type="text" 
              placeholder="Search jobs..." 
              className="w-full px-4 py-3 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 mb-6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="grid gap-6">
              {filteredJobs.map(job => (
                <JobCard key={job.application_id} job={job} onCardClick={setSelectedJob} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedJob && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Job Details Canvas */}
            <JobDetailsCanvas job={selectedJob} onClose={() => setSelectedJob(null)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;




// 

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';

// const JobTypeFilter = ({ selectedTypes, setSelectedTypes, options, title, onFilterChange }) => {
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredOptions = options.filter(option =>
//     option.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleCheckboxChange = (type) => {
//     setSelectedTypes(prev =>
//       prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
//     );
//     onFilterChange();
//   };

//   return (
//     <div className="mb-6">
//       <h3 className="text-lg font-semibold mb-3">{title}</h3>
//       <input
//         type="text"
//         placeholder={`Search ${title.toLowerCase()}...`}
//         className="w-full px-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//       <div className="mt-3 max-h-48 overflow-y-auto">
//         {filteredOptions.map(option => (
//           <label key={option} className="flex items-center mb-2 cursor-pointer">
//             <input
//               type="checkbox"
//               className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
//               checked={selectedTypes.includes(option)}
//               onChange={() => handleCheckboxChange(option)}
//             />
//             <span className="ml-2 text-gray-700">{option}</span>
//           </label>
//         ))}
//       </div>
//     </div>
//   );
// };

// const JobCard = ({ job, onCardClick }) => (
//   <motion.div
//     className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300 cursor-pointer"
//     onClick={() => onCardClick(job)}
//     whileHover={{ scale: 1.02 }}
//     whileTap={{ scale: 0.98 }}
//   >
//     <h3 className="text-xl font-bold text-gray-800">{job.open_positions.join(', ')}</h3>
//     <p className="text-sm text-gray-600 mt-1">{job.company_name} • {new Date(job.created_date).toLocaleDateString()}</p>
//     <p className="mt-3 text-gray-700">{job.description || "No description available"}</p>
//     <div className="mt-4 flex space-x-3">
//       <button className="px-4 py-2 rounded-lg bg-green-100 text-green-700 font-medium hover:bg-green-200 transition duration-200">Save</button>
//       <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition duration-200">Apply</button>
//     </div>
//   </motion.div>
// );

// const JobDetailsCanvas = ({ job, onClose }) => (
//   <motion.div
//     initial={{ x: '100%' }}
//     animate={{ x: 0 }}
//     exit={{ x: '100%' }}
//     transition={{ type: 'tween', duration: 0.3 }}
//     className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg p-6 overflow-y-auto z-50"
//   >
//     <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700">&times;</button>
//     <h2 className="text-2xl font-bold mb-4 text-gray-800">{job.open_positions.join(', ')}</h2>
//     <p className="text-gray-600 mb-2">{job.company_name} • {new Date(job.created_date).toLocaleDateString()}</p>
//     <p className="mb-4 text-gray-700">{job.description || "No description available"}</p>
//   </motion.div>
// );

// const App = () => {
//   const [selectedRanks, setSelectedRanks] = useState([]);
//   const [selectedVessels, setSelectedVessels] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedJob, setSelectedJob] = useState(null);

//   const [rankOptions, setRankOptions] = useState([]);
//   const [shipOptions, setShipOptions] = useState([]);

//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const [currentPage, setCurrentPage] = useState(1);
//   const jobsPerPage = 10;

//   const fetchJobDetails = async () => {
//     if (searchTerm.trim() === '') {
//       return; // Prevent API call if the search term is empty
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post('https://api.rightships.com/company/application/get', {
//         searchTerm,
//         rank: selectedRanks,
//         shiptype: selectedVessels,
//         page: currentPage,
//         limit: jobsPerPage,
//       });
//       if (response.data.code === 200) {
//         setJobs(response.data.applications);
//         setLoading(false);
//       } else {
//         setError('Failed to fetch job details.');
//         setLoading(false);
//       }
//     } catch (error) {
//       setError('An error occurred while fetching job details.', error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchJobDetails();
//   }, [currentPage]);

//   useEffect(() => {
//     console.log("=======>", selectedRanks, "\n", "========>", selectedVessels);
//   }, [selectedRanks, selectedVessels]);

//   // Fetching attributes for ship types and ranks
//   useEffect(() => {
//     const fetchAttributes = async () => {
//       try {
//         const response = await axios.post('https://api.rightships.com/attributes/get', {});
//         if (response.data && response.data.code === 200) {
//           const attributes = response.data.data;
//           const shipAttribute = attributes.find(attr => attr.name.toLowerCase() === 'ships');
//           const rankAttribute = attributes.find(attr => attr.name.toLowerCase() === 'rank');
//           const shipData = shipAttribute ? shipAttribute.values.sort((a, b) => a.localeCompare(b)) : [];
//           const rankData = rankAttribute ? rankAttribute.values.sort((a, b) => a.localeCompare(b)) : [];

//           setShipOptions(shipData);
//           setRankOptions(rankData);
//         } else {
//           console.error('Failed to fetch attributes:', response.data.msg);
//         }
//       } catch (error) {
//         console.error('Failed to fetch attributes:', error);
//       }
//     };

//     fetchAttributes();
//   }, []);

//   // Handle search
//   const handleSearch = () => {
//     if (searchTerm.trim() === '') {
//       // Prevent the API call if the search term is empty
//       return;
//     }

//     setCurrentPage(1); // Reset to the first page when searching
//     fetchJobDetails(); // Call the API to fetch the filtered jobs
//   };

//   // Handle pagination
//   const paginate = (pageNumber) => {
//     setCurrentPage(pageNumber);
//     fetchJobDetails();
//   };

//   // Pagination calculation
//   const totalJobs = jobs.length; // This should be the total number of jobs from your API
//   const totalPages = Math.ceil(totalJobs / jobsPerPage);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen relative">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex flex-col md:flex-row gap-8">
//           {/* Filter Sidebar */}
//           <div className="w-full md:w-1/4">
//             <div className="bg-white p-6 rounded-xl shadow-sm sticky top-8">
//               <h2 className="text-2xl font-bold mb-6 text-gray-800">Filters</h2>

//               <JobTypeFilter
//                 selectedTypes={selectedRanks}
//                 setSelectedTypes={setSelectedRanks}
//                 options={rankOptions}
//                 title="Rank"
//                 onFilterChange={fetchJobDetails}
//               />

//               <JobTypeFilter
//                 selectedTypes={selectedVessels}
//                 setSelectedTypes={setSelectedVessels}
//                 options={shipOptions}
//                 title="Vessel Type"
//                 onFilterChange={fetchJobDetails}
//               />
//             </div>
//           </div>

//           {/* Job List */}
//           <div className="w-full md:w-3/4">
//             <div className="flex mb-6">
//               <input
//                 type="text"
//                 placeholder="Search jobs..."
//                 className="flex-grow px-4 py-3 rounded-l-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <button
//                 onClick={handleSearch}
//                 className="px-6 py-3 bg-blue-600 text-white font-medium rounded-r-lg hover:bg-blue-700 transition duration-200"
//               >
//                 Search
//               </button>
//             </div>
//             <div className="grid gap-6">
//               {jobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage).map(job => (
//                 <JobCard key={job.application_id} job={job} onCardClick={setSelectedJob} />
//               ))}
//             </div>

//             {/* Pagination */}
//             <div className="flex justify-center mt-6">
//               <nav className="inline-flex rounded-md shadow">
//                 <button
//                   onClick={() => paginate(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="px-3 py-2 rounded-l-md bg-white text-gray-500 hover:bg-gray-50"
//                 >
//                   Previous
//                 </button>

//                 {/* Page Numbers */}
//                 {Array.from({ length: totalPages }, (_, index) => (
//                   <button
//                     key={index + 1}
//                     onClick={() => paginate(index + 1)}
//                     className={`px-3 py-2 ${index + 1 === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-500'} hover:bg-gray-50`}
//                   >
//                     {index + 1}
//                   </button>
//                 ))}

//                 <button
//                   onClick={() => paginate(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="ml-1 px-3 py-2 rounded-r-md bg-white text-gray-500 hover:bg-gray-50"
//                 >
//                   Next
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </div>
//       </div>

//       <AnimatePresence>
//         {selectedJob && (
//           <>
//             {/* Overlay */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 0.5 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black z-40"
//             />

//             {/* Job Details Canvas */}
//             <JobDetailsCanvas job={selectedJob} onClose={() => setSelectedJob(null)} />
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default App;