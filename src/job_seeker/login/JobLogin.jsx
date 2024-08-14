import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp } from '../../features/otpSlice';
import { setContactInfo } from '../../features/contactSlice';
import logo from "../../images/logo.png";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {

  const [phoneNumber, setPhoneNumber] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const otpStatus = useSelector((state) => state.otp.status);
  const otpError = useSelector((state) => state.otp.error);

  const handleSendOtp = () => {
    if (!phoneNumber.trim()) {
      toast.error("Phone number field cannot be empty!");
      return;}

    dispatch(sendOtp(phoneNumber));
    dispatch(setContactInfo(phoneNumber));
    toast.success("OTP sent successfully")
    navigate('/login-verify');
  };

  return (
    <section className="flex flex-col items-center py-20 h-screen bg-gray-100">
      <ToastContainer/>
      <div className="mb-4">
        <img src={logo} alt="Logo" className="h-24 w-20" />
      </div>
      <div className="bg-white p-10 mt-3 rounded-lg shadow-lg border w-full max-w-md">
        <h2 className="text-center text-2xl font-semibold mb-6">Log in to Rightship</h2>
        <input
          type="text"
          placeholder="Enter the phone number"
          className="w-full px-4 py-4 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-customBlue"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <button
          onClick={handleSendOtp}
          className={`w-full py-4 rounded-md text-white font-medium ${otpStatus === 'loading' ? 'bg-customBlue' : 'bg-customBlue hover:bg-customBlue2'} transition duration-300`}
          disabled={otpStatus === 'loading'}
        >
          {otpStatus === 'loading' ? 'Sending...' : 'Send OTP'}
        </button>
        {otpStatus === 'failed' && <p className="text-red-600 mt-4 text-center">{otpError}</p>}
      </div>
    </section>
  );
};

export default Login;
