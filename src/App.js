import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

// Layout Import 
import DefaultLayout from '../src/component/layout/defaultLayout';
import CompanyLayout from '../src/component/layout/companyLayout';
import EmployeeLayout from '../src/component/layout/employeeLayout';


// Pages
import HomePage from './job_seeker/landingpage/Home';
import NotFoundPage from './pageNotFound';
import CompanyOtpAuth from './company/login/login';
import RegistrationForm from './company/RegistrationForm';
import EmployeeOtpAuth from './job_seeker/login/login';
import EmployeeSignup from './job_seeker/signup/Signup';
import JobDashboard from './job_seeker/jobs/InitialJobs2';
import Main from './job_seeker/Profile/Main';
import CreateJobStepForm from './company/job/createJob/step';
import JobPostList from './company/job/jobPostList';


const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const user = useSelector(state => !!state.auth.user);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* If user Is login */}
        <Route element={ user ?  <Navigate to="/" /> : <DefaultLayout />}>       
          <Route path="/company/login" element={<CompanyOtpAuth />} />
          <Route path="/company/register" element={<RegistrationForm />} />
          <Route path="/login" element={<EmployeeOtpAuth />} />
          <Route path="/register" element={<EmployeeSignup />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        {/* Global Route */}
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobDashboard />} />
        {/* Rolebase */}
        <Route element={ user ?  <EmployeeLayout/> : <Navigate to="/" /> }>   
          <Route path="/profile" element={<Main />} />
          <Route path="/create/job" element={<CreateJobStepForm/>} />
          <Route path="/post/job" element={<JobPostList/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
