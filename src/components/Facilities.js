import React, { useState } from 'react';

const Facilities = () => {
  const [selectedFacility, setSelectedFacility] = useState(null);

  const facilitiesData = [
    { id: 'substation', name: '변전실', description: '변전실 정보입니다.' },
    { id: 'elevator', name: '승강기', description: '승강기 정보입니다.' },
    { id: 'gondola', name: '곤도라', description: '곤도라 정보입니다.' },
    { id: 'ups', name: 'UPS', description: 'UPS 정보입니다.' },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="facility-button-grid" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '1rem' }}>
          {facilitiesData.map(facility => (
            <div key={facility.id} style={{ flex: '1 1 calc(33.333% - 1rem)', maxWidth: 'calc(33.333% - 1rem)', marginBottom: '1rem' }}>
              <button
                className={`facility-button w-full py-2 px-4 font-medium rounded mb-2 ${
                  selectedFacility && selectedFacility.id === facility.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setSelectedFacility(facility)}
              >
                {facility.name}
              </button>
            </div>
          ))}
        </div>
        {selectedFacility && (
          <div className="facility-details">
            <h4 className="text-lg font-semibold">{selectedFacility.name}</h4>
            <p>{selectedFacility.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Facilities;
