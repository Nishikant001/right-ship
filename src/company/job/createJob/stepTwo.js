import React from 'react';

const StepTwo = ({ nextStep, prevStep, benifits, formData, handleInputChange }) => {

  const handleBenefitSelect = (benefit) => {
    const updatedBenefits = formData.benefits.includes(benefit)
      ? formData.benefits.filter((b) => b !== benefit)
      : [...formData.benefits, benefit];
    handleInputChange('benefits')(updatedBenefits);
  };

  return (
    <div>
      <h2>Select Benefits and Enter Job Description</h2>
      <div>
        <h3>Benefits:</h3>
        {benifits.map((benefit, index) => (
          <div key={index}>
            <input
              type="checkbox"
              checked={formData.benefits.includes(benefit)}
              onChange={() => handleBenefitSelect(benefit)}
            />
            {benefit}
          </div>
        ))}
      </div>
      <div>
        <h3>Job Description:</h3>
        <textarea
          value={formData.jobDescription}
          onChange={(e) => handleInputChange('jobDescription')(e.target.value)}
        />
      </div>
      <button onClick={prevStep}>Back</button>
      <button onClick={nextStep}>Next</button>
    </div>
  );
};

export default StepTwo;
