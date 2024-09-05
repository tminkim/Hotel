import React, { useState } from 'react';
import DistributionBoard from './components/DistributionBoard';
import Facilities from './components/Facilities';
import Drawing from './components/Drawing';

const App = () => {
  const [activeTab, setActiveTab] = useState('distributionBoard');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
          <div className="flex">
            {['distributionBoard', 'facilities', 'drawing'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-3 text-sm font-medium ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'distributionBoard' ? '분전반 정보' : 
                 tab === 'facilities' ? '시설물 현황' : '도면'}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'distributionBoard' && <DistributionBoard />}
        {activeTab === 'facilities' && <Facilities />}
        {activeTab === 'drawing' && <Drawing />}
      </div>
    </div>
  );
};

export default App;
