import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { applyJob, bookmarkJob, unapplyJob, removeJob } from '../../features/jobSlice';
import Modal from 'react-modal';

const initialJobsData = {
  savedJobs: [],
  appliedJobs: [],
  bookmarkedJobs: [],
};

const JobDashboard = () => {
  const dispatch = useDispatch();
  const savedJobs = useSelector(state => state.job.savedJobs);
  const appliedJobs = useSelector(state => state.job.appliedJobs);
  const [jobsData, setJobsData] = useState(initialJobsData);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedSavedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
    const storedAppliedJobs = JSON.parse(localStorage.getItem('appliedJobs')) || [];

    setJobsData(prevJobsData => ({
      ...prevJobsData,
      savedJobs: storedSavedJobs,
      appliedJobs: storedAppliedJobs,
    }));

    fetchJobsData();
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 1024 && jobsData.savedJobs.length > 0) {
      setSelectedJob(jobsData.savedJobs[0]);
    }
  }, [jobsData.savedJobs]);

  const fetchJobsData = async () => {
    try {
      const response = await fetch('https://api.rightships.com/company/application/get', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const result = await response.json();
        const data = result.applications || [];

        const formattedData = data.slice(0, 40).map(job => ({
          id: job.application_id || 'undefined-id',
          companyName: job.company_name || '',
          rpslNo: job.rspl_no || '',
          hiringFor: job.hiring_for || '',
          openPositions: job.open_positions || [],
          src: job.website_url || '',
          contact: {
            number: job.mobile_no || '',
            email: job.email || '',
          },
          benefits: job.benifits || [],
          description: job.description || '',
          applied: appliedJobs.some(appliedJob => appliedJob.id === job.application_id),
          bookmarked: savedJobs.some(savedJob => savedJob.id === job.application_id),
          postedDate: job.created_date || '',
        }));

        setJobsData(prevJobsData => ({ ...prevJobsData, savedJobs: formattedData }));
      } else {
        console.error('Failed to fetch job data');
      }
    } catch (error) {
      console.error('Error fetching job data:', error);
    }
  };

  const toggleApply = (jobId) => {
    setJobsData(prevJobsData => {
      const savedJobs = [...prevJobsData.savedJobs];
      const appliedJobs = [...prevJobsData.appliedJobs];
      const jobIndex = savedJobs.findIndex(job => job.id === jobId);

      if (jobIndex !== -1) {
        const job = { ...savedJobs[jobIndex] };
        job.applied = !job.applied;

        if (job.applied) {
          appliedJobs.push(job);
          dispatch(applyJob(job));
        } else {
          const appliedJobIndex = appliedJobs.findIndex(j => j.id === jobId);
          if (appliedJobIndex !== -1) {
            appliedJobs.splice(appliedJobIndex, 1);
          }
          dispatch(unapplyJob(job.id));
        }

        localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
        savedJobs[jobIndex] = job;

        if (selectedJob?.id === jobId) {
          setSelectedJob({ ...job });
        }
      }

      return { ...prevJobsData, savedJobs, appliedJobs };
    });
  };

  const toggleBookmark = (jobId) => {
    setJobsData(prevJobsData => {
      const savedJobs = [...prevJobsData.savedJobs];
      const bookmarkedJobs = prevJobsData.bookmarkedJobs ? [...prevJobsData.bookmarkedJobs] : [];
      const jobIndex = savedJobs.findIndex(job => job.id === jobId);

      if (jobIndex !== -1) {
        const job = { ...savedJobs[jobIndex] };
        job.bookmarked = !job.bookmarked;

        if (job.bookmarked) {
          bookmarkedJobs.push(job);
          dispatch(bookmarkJob(job));
        } else {
          const bookmarkedJobIndex = bookmarkedJobs.findIndex(j => j.id === jobId);
          if (bookmarkedJobIndex !== -1) {
            bookmarkedJobs.splice(bookmarkedJobIndex, 1);
          }
          dispatch(removeJob(job.id));
        }

        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        savedJobs[jobIndex] = job;

        if (selectedJob?.id === jobId) {
          setSelectedJob({ ...job });
        }
      }

      return { ...prevJobsData, savedJobs, bookmarkedJobs };
    });
  };

  const handleJobClick = (job) => {
    if (window.innerWidth >= 1024) {
      // On large and extra-large screens, hide the details when clicking the job div
      setSelectedJob(selectedJob?.id === job.id ? null : job);
    } else {
      // On smaller screens, open the modal
      setSelectedJob(job);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const filteredJobs = jobsData.savedJobs.filter(job =>
    job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.hiringFor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className='w-full h-20 bg-white content-center'>
        <div className='flex flex-row justify-center'>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter skills, designation or company"
            className="w-3/5 rounded-s-md p-2 border border-gray-300"
            style={{ outline: 'none', borderColor: 'gray' }}
          />
          <button className="bg-customBlue rounded-e-md text-white p-2">Search</button>
        </div>
      </div>
      <div className="min-h-screen bg-gray-200 p-3">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:max-w-md pr-3 h-screen overflow-y-scroll" style={{ height: 'calc(110vh - 100px)' }}>
            {filteredJobs.map(job => (
              <div
                key={job.id}
                className={`relative p-4 mb-4 border rounded-md bg-white cursor-pointer ${selectedJob && selectedJob.id === job.id ? 'border-customBlue border' : ''}`}
                onClick={() => handleJobClick(job)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p>{job.companyName} | {job.rpslNo}</p>
                    <p className="font-bold">Hiring For</p>
                    <p>{job.hiringFor}</p>
                    <p className="font-bold mt-2">Open Positions</p>
                    <p>{job.openPositions.join('  ')}</p>
                  </div>
                </div>
                <div className="flex mt-2 md:mt-0 items-center space-x-2">
                  <button
                    className={`mt-2 min-w-24 py-1.5 ${job.applied ? 'border border-customBlue text-customBlue font-semibold rounded-md' : 'bg-customBlue border text-white font-semibold rounded-md'}`}
                    onClick={(e) => { e.stopPropagation(); toggleApply(job.id); }}
                  >
                    {job.applied ? 'Unapply' : 'Apply'}
                  </button>
                  <button
                    className='mt-2'
                    onClick={(e) => { e.stopPropagation(); toggleBookmark(job.id); }}
                  >
                    <Bookmark size={22} className={job.bookmarked ? 'fill-current text-[#1F5882]' : 'stroke-current text-[#1F5882]'} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full md:max-w-3xl px-3 hidden lg:block overflow-y-scroll"  style={{ height: 'calc(110vh - 100px)' }}> {/* Hidden on mobile/tablet */}
            {selectedJob && (
              <div className="bg-white p-8 border border-gray-300 rounded-lg shadow-lg">
                <div className="flex flex-col mb-6">
                  <div className="flex">
                    <img src={selectedJob.src} alt="Company Profile" className="w-32 h-32 object-cover rounded-md" />
                    <div className="ml-4 flex-grow">
                      <h2 className="text-2xl font-bold text-gray-800">{selectedJob.companyName}</h2>
                      <p className="text-black mt-2">{selectedJob.rpslNo}</p>
                      <p className="text-gray-500 text-xs mt-1">Posted on {selectedJob.postedDate}</p>
                      <div className="flex mt-4 space-x-4">
                        <button
                          className={`px-8 py-2 ${selectedJob.applied ? 'bg-gray-400' : 'bg-customBlue'} text-white font-bold rounded-md`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleApply(selectedJob.id);
                          }}
                        >
                          {selectedJob.applied ? 'Applied' : 'Apply'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(selectedJob.id);
                          }}
                        >
                          <Bookmark size={22} className={selectedJob.bookmarked ? 'fill-current text-[#1F5882]' : 'stroke-current text-[#1F5882]'} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-300 my-6"></div>
                <div className="my-6">
                  <p className="font-semibold text-xl">Contact</p>
                  <div className="flex flex-col sm:flex-row justify-between mt-2">
                    <p className="text-sm">Company Number:<br />{selectedJob.contact.number}</p>
                    <p className="text-sm mt-2 sm:mt-0">Email:<br />{selectedJob.contact.email}</p>
                  </div>
                </div>
                <div className="border-t border-gray-300 my-6"></div>
                <div className="flex flex-col sm:flex-row justify-between my-6">
                  <div>
                    <p className="font-semibold text-xl">Hiring For</p>
                    <p className="text-sm mt-2">{selectedJob.hiringFor}</p>
                  </div>
                  <div className="border-l-2 border-gray-300 my-6 sm:my-0"></div>
                  <div>
                    <p className="font-semibold text-xl">Open Positions</p>
                    <div className="grid grid-cols-1 gap-1 mt-2">
                      {selectedJob.openPositions.map((position, index) => (
                        <p key={index} className="text-sm">{position}</p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-300 my-6"></div>
                <div className="my-6">
                  <p className="font-semibold text-xl">Benefits</p>
                  <ul className="list-disc pl-5 mt-2">
                    {selectedJob.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm">{benefit}</li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-gray-300 my-6"></div>
                <div className="my-6">
                  <p className="font-semibold text-xl">Description</p>
                  <p className="text-sm mt-2">{selectedJob.description}</p>
                </div>
              </div>
            )}
          </div>
          <div className='w-full md:max-w-xs px-3 hidden md:block bg-white overflow-y-auto' style={{ height: 'calc(110vh - 100px)' }}></div>
        </div>
      </div>

      {/* Modal for mobile/tablet screens */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="bg-white p-8 border border-gray-300 rounded-lg shadow-lg w-full mx-auto overflow-y-auto h-screen z-50" 
        contentLabel="Job Details"
        ariaHideApp={false}
      >
        <button className="absolute top-2 right-2 text-gray-600" onClick={closeModal}>
          &times;
        </button>
        {selectedJob && (
          <div>
            <div className="flex flex-col mb-6">
              <div className="flex">
                <img src={selectedJob.src} alt="Company Profile" className="w-32 h-32 object-cover rounded-md" />
                <div className="ml-4 flex-grow">
                  <h2 className="text-2xl font-bold text-gray-800">{selectedJob.companyName}</h2>
                  <p className="text-black mt-2">{selectedJob.rpslNo}</p>
                  <p className="text-gray-500 text-xs mt-1">Posted on {selectedJob.postedDate}</p>
                  <div className="flex mt-4 space-x-4">
                    <button
                      className={`px-8 py-2 ${selectedJob.applied ? 'bg-gray-400' : 'bg-customBlue'} text-white font-bold rounded-md`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleApply(selectedJob.id);
                      }}
                    >
                      {selectedJob.applied ? 'Applied' : 'Apply'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(selectedJob.id);
                      }}
                    >
                      <Bookmark size={22} className={selectedJob.bookmarked ? 'fill-current text-[#1F5882]' : 'stroke-current text-[#1F5882]'} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-300 my-6"></div>
            <div className="my-6">
              <p className="font-semibold text-xl">Contact</p>
              <div className="flex flex-col sm:flex-row justify-between mt-2">
                <p className="text-sm">Company Number:<br />{selectedJob.contact.number}</p>
                <p className="text-sm mt-2 sm:mt-0">Email:<br />{selectedJob.contact.email}</p>
              </div>
            </div>
            <div className="border-t border-gray-300 my-6"></div>
            <div className="flex flex-col sm:flex-row justify-between my-6">
              <div>
                <p className="font-semibold text-xl">Hiring For</p>
                <p className="text-sm mt-2">{selectedJob.hiringFor}</p>
              </div>
              <div className="border-l-2 border-gray-300 my-6 sm:my-0"></div>
              <div>
                <p className="font-semibold text-xl">Open Positions</p>
                <div className="grid grid-cols-1 gap-1 mt-2">
                  {selectedJob.openPositions.map((position, index) => (
                    <p key={index} className="text-sm">{position}</p>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-300 my-6"></div>
            <div className="my-6">
              <p className="font-semibold text-xl">Benefits</p>
              <ul className="list-disc pl-5 mt-2">
                {selectedJob.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm">{benefit}</li>
                ))}
              </ul>
            </div>
            <div className="border-t border-gray-300 my-6"></div>
            <div className="my-6">
              <p className="font-semibold text-xl">Description</p>
              <p className="text-sm mt-2">{selectedJob.description}</p>
            </div>
            <button className="mt-4 px-4 py-2 border border-customBlue bg-customBlue text-white hover:bg-white hover:text-customBlue rounded-md" onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JobDashboard;
