import React, { useState } from 'react';
import axios from 'axios';

const OtpVerificationForm = ({ mobileNumber }) => {

    const [otp, setOtp] = useState('');
    
    try {
        const response = await axios.post('https://api.rightships.com/otp/verify_otp', { mobileNumber, otp });
        if (response.data.success) {
         
        } else {
         
        }
      } catch (error) {
       
      }
    

    return (

    )
};

export default OtpVerificationForm;