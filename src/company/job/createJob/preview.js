import React from 'react';

const Preview = ({ formData, prevStep, handlePublish }) => {
  return (
    <div>
      <h2>Preview Job Details</h2>
      <div>
        <h3>Ships:</h3>
        <ul>
          {formData.ships.map((ship, index) => (
            <li key={index}>{ship}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Ranks:</h3>
        <ul>
          {formData.ranks.map((rank, index) => (
            <li key={index}>{rank}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Benefits:</h3>
        <ul>
          {formData.benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Job Description:</h3>
        <p>{formData.jobDescription}</p>
      </div>
      <button onClick={prevStep}>Edit</button>
      <button onClick={handlePublish}>Publish</button>
    </div>
  );
};

export default Preview;
