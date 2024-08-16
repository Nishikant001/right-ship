// StepOne.js
import React from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 15px;
  font-size: 1.2em;
`;

const Section = styled.div`
  margin-bottom: 15px;
`;

const SectionTitle = styled.h3`
  color: #555;
  margin-bottom: 5px;
  font-size: 1em;
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const OptionButton = styled.button`
  padding: 8px;
  background-color: ${props => props.selected ? '#007bff' : '#f0f0f0'};
  color: ${props => props.selected ? 'white' : '#333'};
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.selected ? '#0056b3' : '#e0e0e0'};
  }
`;

const NextButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const StepOne = ({ nextStep, shipDatas, rankDatas, formData, handleInputChange }) => {
  const handleShipSelect = (ship) => {
    const updatedShips = formData.ships.includes(ship)
      ? formData.ships.filter((s) => s !== ship)
      : [...formData.ships, ship];
    handleInputChange('ships')(updatedShips);
  };

  const handleRankSelect = (rank) => {
    const updatedRanks = formData.ranks.includes(rank)
      ? formData.ranks.filter((r) => r !== rank)
      : [...formData.ranks, rank];
    handleInputChange('ranks')(updatedRanks);
  };

  return (
    <FormContainer>
      <Title>Job Details</Title>
      <Section>
        <SectionTitle>Ships:</SectionTitle>
        <OptionGrid>
          {shipDatas.map((ship, index) => (
            <OptionButton
              key={index}
              selected={formData.ships.includes(ship)}
              onClick={() => handleShipSelect(ship)}
            >
              {ship}
            </OptionButton>
          ))}
        </OptionGrid>
      </Section>
      <Section>
        <SectionTitle>Ranks:</SectionTitle>
        <OptionGrid>
          {rankDatas.map((rank, index) => (
            <OptionButton
              key={index}
              selected={formData.ranks.includes(rank)}
              onClick={() => handleRankSelect(rank)}
            >
              {rank}
            </OptionButton>
          ))}
        </OptionGrid>
      </Section>
      <NextButton 
        onClick={nextStep} 
        disabled={formData.ships.length === 0 || formData.ranks.length === 0}
      >
        Next
      </NextButton>
    </FormContainer>
  );
};

export default StepOne;