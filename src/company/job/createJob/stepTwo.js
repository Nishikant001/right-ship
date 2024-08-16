// StepTwo.js
import React from 'react';
import {
  FormContainer,
  Title,
  Section,
  SectionTitle,
  CheckboxGroup,
  CheckboxLabel,
  Checkbox,
  TextArea,
  ButtonGroup,
  Button
} from '../../../style';

const StepTwo = ({ nextStep, prevStep, benifits, formData, handleInputChange }) => {
  const handleBenefitSelect = (benefit) => {
    const updatedBenefits = formData.benefits.includes(benefit)
      ? formData.benefits.filter((b) => b !== benefit)
      : [...formData.benefits, benefit];
    handleInputChange('benefits')(updatedBenefits);
  };

  return (
    <FormContainer>
      <Title>Select Benefits and Enter Job Description</Title>
      <Section>
        <SectionTitle>Benefits:</SectionTitle>
        <CheckboxGroup>
          {benifits.map((benefit, index) => (
            <CheckboxLabel key={index}>
              <Checkbox
                type="checkbox"
                checked={formData.benefits.includes(benefit)}
                onChange={() => handleBenefitSelect(benefit)}
              />
              {benefit}
            </CheckboxLabel>
          ))}
        </CheckboxGroup>
      </Section>
      <Section>
        <SectionTitle>Job Description:</SectionTitle>
        <TextArea
          value={formData.jobDescription}
          onChange={(e) => handleInputChange('jobDescription')(e.target.value)}
          placeholder="Enter job description here..."
        />
      </Section>
      <ButtonGroup>
        <Button onClick={prevStep}>Back</Button>
        <Button onClick={nextStep} disabled={ formData.jobDescription.trim() === ''}>
          Next
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default StepTwo;