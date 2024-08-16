// Preview.js
import React from 'react';
import {
  FormContainer,
  Title,
  Section,
  SectionTitle,
  ButtonGroup,
  Button
} from '../../../style';

const Preview = ({ formData, prevStep, handlePublish }) => {
  return (
    <FormContainer>
      <Title>Preview Job Details</Title>
      <Section>
        <SectionTitle>Ships:</SectionTitle>
        <ul>
          {formData.ships.map((ship, index) => (
            <li key={index}>{ship}</li>
          ))}
        </ul>
      </Section>
      <Section>
        <SectionTitle>Ranks:</SectionTitle>
        <ul>
          {formData.ranks.map((rank, index) => (
            <li key={index}>{rank}</li>
          ))}
        </ul>
      </Section>
      <Section>
        <SectionTitle>Benefits:</SectionTitle>
        <ul>
          {formData.benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </Section>
      <Section>
        <SectionTitle>Job Description:</SectionTitle>
        <p>{formData.jobDescription}</p>
      </Section>
      <ButtonGroup>
        <Button onClick={prevStep}>Edit</Button>
        <Button onClick={handlePublish}>Publish</Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default Preview;