import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import logo from '../../images/logo.png';
import { Link, useNavigate } from 'react-router-dom';

const VerifyLogin = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const otpStatus = useSelector((state) => state.otp.status);
  const otpError = useSelector((state) => state.otp.error);
  const contactInfo = useSelector((state) => state.contact.contactInfo);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleSendOtp = () => {
    setTimer(30);
    setCanResend(false);
    navigate('/signup-number');
  };

  const handleVerifyOtp = async () => {
    try {
      const verifyResponse = await fetch('https://api.rightships.com/otp/verify_otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile_no: contactInfo, otp }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.message || 'Failed to verify OTP');
      }

      const verifyData = await verifyResponse.json();
      if (verifyData.code === 200) {
        const loginResponse = await fetch('https://api.rightships.com/employee/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mobile_no: contactInfo }),
        });

        if (!loginResponse.ok) {
          const errorData = await loginResponse.json();
          throw new Error(errorData.message || 'Failed to log in');
        }

        const loginData = await loginResponse.json();
        navigate('/jobdashboard');
      } else {
        throw new Error(verifyData.msg || 'Failed to verify OTP');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <>
      <section className="flex flex-col items-center py-20 h-screen bg-gray-100">
        <div className="mb-4">
          <img src={logo} alt="Logo" className="h-24 w-20 mx-auto" />
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">Verify OTP</h2>
          <p className="text-center text-sm text-gray-600 mb-6">OTP sent to: {contactInfo}</p>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full px-4 py-4 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-customBlue"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={handleVerifyOtp}
            className={`w-full py-4 rounded-md text-white font-medium ${otpStatus === 'loading' ? 'bg-customBlue' : 'bg-customBlue hover:bg-customBlue2'} transition duration-300`}
            disabled={otpStatus === 'loading'}
          >
            {otpStatus === 'loading' ? 'Verifying...' : 'Verify OTP'}
          </button>
          {otpStatus === 'failed' && <p className="text-red-600 mt-4 text-center">{otpError}</p>}
          <p className="text-center mt-4 text-sm text-gray-600">
            {canResend ? (
              <button
                onClick={handleSendOtp}
                className="text-blue-600 underline hover:text-customBlue2 text-md"
              >
                Resend OTP
              </button>
            ) : (
              `Resend OTP in: ${formatTime(timer)}`
            )}
          </p>
          <Link className="text-blue-600 block text-center text-md underline mt-6 hover:text-customBlue2" to="/signup-number">
            Change Number
          </Link>
        </div>
      </section>
    </>
  );
};

export default VerifyLogin;
