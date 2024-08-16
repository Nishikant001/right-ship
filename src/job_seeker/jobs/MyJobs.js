import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { removeJob, unapplyJob, applyJob, bookmarkJob, applyJobToCompany, unapplyJobFromCompany } from '../../features/jobSlice';

const MyJobs = () => {
  const dispatch = useDispatch();
  const savedJobs = useSelector(state => state.job.savedJobs);
  const appliedJobs = useSelector(state => state.job.appliedJobs);
  const employeeId = useSelector(state => state.auth?.user?._id);

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'savedJobs';
  });

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const toggleApply = (job) => {
    if (!employeeId) {
      console.error('Employee ID is undefined. Cannot apply for the job.');
      return;
    }

    if (appliedJobs.some(appliedJob => appliedJob.id === job.id)) {
      dispatch(unapplyJob(job.id));
      dispatch(unapplyJobFromCompany({
        jobId: job.id,
        companyId: job.companyId,
        employeeId,
      }));
    } else {
      dispatch(applyJob(job));
      dispatch(applyJobToCompany({
        jobId: job.id,
        companyId: job.companyId,
        employeeId,
      }));
    }
  };

  const toggleBookmark = (job) => {
    if (savedJobs.some(savedJob => savedJob.id === job.id)) {
      dispatch(removeJob(job.id));
    } else {
      dispatch(bookmarkJob(job));
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-4 text-center lg:hidden">My Jobs</h1>
        <h1 className="text-3xl font-bold ml-16 mt-10 -mb-5 hidden lg:block">My Jobs</h1>
        <div className="flex justify-center space-x-4">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'savedJobs' ? 'bg-customSky3 text-customBlue font-bold' : ''
            }`}
            onClick={() => setActiveTab('savedJobs')}
          >
            Saved Jobs ({savedJobs.length})
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'appliedJobs' ? 'bg-customSky3 text-customBlue font-bold' : ''
            }`}
            onClick={() => setActiveTab('appliedJobs')}
          >
            Applied Jobs ({appliedJobs.length})
          </button>
        </div>
        <div className="w-11/12 border mx-auto border-blue-300 mb-4"></div>
        <div className="max-w-4xl mx-auto">
          {activeTab === 'savedJobs' &&
            savedJobs.map((job) => (
              <div key={job.id} className="flex flex-col md:flex-row justify-between p-4 border rounded-lg mb-4">
                <div>
                  <p>{job.companyName} | {job.rpslNo}</p>
                  <p className="font-bold">Hiring For</p>
                  <p>{job.hiringFor}</p>
                  <p className="font-bold">Open Positions</p>
                  <p>{job.openPositions.join('  ')}</p>
                </div>
                <div className="flex mt-2 md:mt-0 items-center space-x-2">
                  <button
                    className={`px-4 py-2 ${
                      appliedJobs.some(appliedJob => appliedJob.id === job.id) ? 'border-2 border-customBlue text-customBlue font-semibold rounded-md' : 'border-2 border-customBlue text-white bg-customBlue font-semibold rounded-md'
                    }`}
                    onClick={() => toggleApply(job)}
                  >
                    {appliedJobs.some(appliedJob => appliedJob.id === job.id) ? 'Unapply' : 'Apply Job'}
                  </button>
                  <button onClick={() => toggleBookmark(job)}>
                    <Bookmark className="w-6 h-6 cursor-pointer" color='#1F5882' fill={savedJobs.some(savedJob => savedJob.id === job.id) ? '#1F5882' : 'none'} />
                  </button>
                </div>
              </div>
            ))}
          {activeTab === 'appliedJobs' &&
            appliedJobs.map((job) => (
              <div key={job.id} className="flex justify-between items-center p-4 border rounded-lg mb-4">
                <div>
                  <p>{job.companyName} | {job.rpslNo}</p>
                  <p className="font-bold">Hiring For</p>
                  <p>{job.hiringFor}</p>
                  <p className="font-bold">Open Positions</p>
                  <p>{job.openPositions.join('  ')}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="px-4 py-2 border-2 border-customBlue text-customBlue font-semibold rounded-md"
                    onClick={() => toggleApply(job)}
                  >
                    Unapply
                  </button>
                  <button onClick={() => toggleBookmark(job)}>
                    <Bookmark className="w-6 h-6 cursor-pointer" color='#1F5882' fill={savedJobs.some(savedJob => savedJob.id === job.id) ? '#1F5882' : 'none'} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MyJobs;
