import React, { useState } from 'react';

const StepOne = ({ nextStep, shipDatas, rankDatas, formData, handleInputChange }) => {
  const [ships, setShips] = useState(shipDatas);
  const [ranks, setRanks] = useState(rankDatas);

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
    <div>
      <h2>Select Ships and Ranks</h2>
      <div>
        <h3>Ships:</h3>
        {ships.map((ship, index) => (
          <div key={index}>
            <input
              type="checkbox"
              checked={formData.ships.includes(ship)}
              onChange={() => handleShipSelect(ship)}
            />
            {ship}
          </div>
        ))}
      </div>
      <div>
        <h3>Ranks:</h3>
        {ranks.map((rank, index) => (
          <div key={index}>
            <input
              type="checkbox"
              checked={formData.ranks.includes(rank)}
              onChange={() => handleRankSelect(rank)}
            />
            {rank}
          </div>
        ))}
      </div>
      <button onClick={nextStep}>Next</button>
    </div>
  );
};

export default StepOne;
