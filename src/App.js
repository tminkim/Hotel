import React, { useState } from 'react';
import DistributionBoard from './components/DistributionBoard';
import Facilities from './components/Facilities';
import Teams from './components/Teams';
import PendingApproval from './components/PendingApproval';

const App = () => {
  const [activeTab, setActiveTab] = useState('distributionBoard');

  // 부모에서 pendingItems 상태를 관리
  const [pendingItems, setPendingItems] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
          <div className="flex">
            {['distributionBoard', 'facilities', 'teams', 'pendingApproval'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'distributionBoard'
                  ? '분전반 정보'
                  : tab === 'facilities'
                  ? '시설물 현황'
                  : tab === 'teams'
                  ? '위험작업 등록'
                  : '작업승인 대기'}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'distributionBoard' && <DistributionBoard />}
        {activeTab === 'facilities' && <Facilities />}
        {activeTab === 'teams' && (
          <Teams
            pendingItems={pendingItems}
            setPendingItems={setPendingItems}
          />
        )}
        {activeTab === 'pendingApproval' && (
          <PendingApproval
            pendingItems={pendingItems}
            setPendingItems={setPendingItems}
          />
        )}
      </div>
    </div>
  );
};

export default App;
