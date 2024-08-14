import React, { useState } from 'react';
import MobileNumberForm from './mobileNumberForm';
import OtpVerificationForm from './OtpVerificationForm';

const OtpAuth = () => {
  
    const [mobileNumber, setMobileNumber] = useState('');
    const [otpRequested, setOtpRequested] = useState(false);

    const handleOtpRequested = (mobile) => {
        setMobileNumber(mobile);
        setOtpRequested(true);
    };

    return (
        <div>
        {!otpRequested ? (
            <MobileNumberForm onOtpRequested={handleOtpRequested} />
        ) : (
            <OtpVerificationForm mobileNumber={mobileNumber} />
        )}
        </div>
    );
};

export default OtpAuth;
