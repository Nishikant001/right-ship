import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layout Imports
import DefaultLayout from '../src/component/layout/defaultLayout';
import EmployeeLayout from '../src/component/layout/employeeLayout';
import CompanyLayout from '../src/component/layout/companyLayout';

// import Main from '../src/job_seeker/Profile/'
// Pages
import HomePage from './job_seeker/landingpage/Home';
import NotFoundPage from './pageNotFound';
import CompanyOtpAuth from './company/login/login';
import RegistrationForm from './company/registrationForm';
import EmployeeOtpAuth from './job_seeker/login/login';
import EmployeeSignup from './job_seeker/signup/Signup';
import VerifySignupOtp from './job_seeker/signup/VerifyWithPhone'


import JobDashboard from './job_seeker/jobs/JobDashboard';
import MyJobs from './job_seeker/jobs/MyJobs';


import EmployeeProfile from './job_seeker/employeeProfile/EmployeeProfile';
import CreateJobStepForm from './company/job/createJob/step';
import JobPostList from './company/job/jobPostList';
import CandidatesTable from './company/candidates/candidateList';
import CandidateDetail from './company/candidates/candidateDetail';
import JobDetail from './company/job/jobdetail';
import CompanyManageUsers from './company/manageUsers';
import CompanyProfile from './company/setting';

const App = () => {
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = !!user; // Determine if a user is logged in

  return (
    <BrowserRouter>
      <Routes>
        {/* Global Routes accessible to all users */}
        <Route element={isLoggedIn ? <EmployeeLayout /> : <DefaultLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobDashboard />} />
          <Route path="/company/login" element={<CompanyOtpAuth />} />
          <Route path="/company/register" element={<RegistrationForm />} />
          <Route path="/login" element={<EmployeeOtpAuth />} />
          <Route path="/register" element={<EmployeeSignup />} />
          
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Routes available to logged-in employees */}
        {isLoggedIn && user.role === 'employee' && (
          <Route element={<EmployeeLayout />}>
            <Route path="/profile" element={<EmployeeProfile />} />
            <Route path="/my-jobs" element={<MyJobs />} />
          </Route>
        )}

        {/* Routes available to logged-in companies */}
        {isLoggedIn && user.role === 'company' && (
          <Route element={<CompanyLayout />}>
            <Route path="/create/job" element={<CreateJobStepForm/>} />
            <Route path="/post/job" element={<JobPostList/>} />
            <Route path="/post/job/detail/:id" element={<JobDetail />} />
            <Route path="/job/candidates" element={<CandidatesTable/>} />
            <Route path="/job/candidates/detail/:candidateId" element={<CandidateDetail/>} />
            <Route path="/manage/company/team" element={<CompanyManageUsers/>} />
            <Route path="/setting" element={<CompanyProfile/>} />

          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;

