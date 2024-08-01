import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const ElectricalManagementApp = () => {
  const [activeTab, setActiveTab] = useState('distributionBoard');
  const [filterType, setFilterType] = useState('all');
  const [floor, setFloor] = useState('');
  const [searchText, setSearchText] = useState('');
  const [distributionBoards, setDistributionBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);

  const fetchCSVData = useCallback(async () => {
    const SPREADSHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1oBO54GD6oM-L-DR15m5t6Aq6ubV7Q1dfBEGe4Hq7DpA/export?format=csv';
    
    try {
      const response = await fetch(SPREADSHEET_CSV_URL);
      const text = await response.text();
      const data = parseCSV(text);

      const formattedData = data.map(row => {
        const board = {};
        Object.keys(row).forEach(header => {
          if (header.startsWith('분기')) {
            if (!board['분기']) board['분기'] = [];
            if (row[header]) board['분기'].push(row[header]);
          } else {
            board[header] = row[header];
          }
        });
        return board;
      });

      setDistributionBoards(formattedData);
      setFilteredBoards(formattedData);
    } catch (error) {
      console.error('Error fetching CSV data:', error);
    }
  }, []);

  const parseCSV = (text) => {
    const rows = text.split('\n').map(row => row.split(','));
    const headers = rows[0].map(header => header.trim());
    const data = rows.slice(1).map(row => {
      let obj = {};
      row.forEach((cell, index) => {
        if (headers[index]) {
          obj[headers[index]] = cell.trim();
        }
      });
      return obj;
    });
    return data;
  };

  const handleSearch = useCallback(() => {
    let results = distributionBoards;

    if (filterType !== 'all') {
      if (filterType === 'single') {
        results = results.filter(board => board['전압'] && board['전압'].includes('1상'));
      } else if (filterType === 'three-phase-three-wire') {
        results = results.filter(board => board['전압'] && board['전압'].includes('3상3선'));
      } else if (filterType === 'three-phase-four-wire') {
        results = results.filter(board => board['전압'] && board['전압'].includes('3상4선'));
      }
    }

    if (floor) {
      results = results.filter(board => board['층'] === floor);
      setSelectedFloorPlan(`/images/${floor}.jpg`);
    } else {
      setSelectedFloorPlan(null);
    }

    if (searchText) {
      results = results.filter(board =>
        Object.values(board).some(value =>
          typeof value === 'string' && value.toLowerCase().includes(searchText.toLowerCase())
        ) ||
        (board['분기'] && board['분기'].some(branch => branch.toLowerCase().includes(searchText.toLowerCase())))
      );
    }

    setFilteredBoards(results);
  }, [filterType, floor, searchText, distributionBoards]);

  useEffect(() => {
    fetchCSVData();
  }, [fetchCSVData]);

  useEffect(() => {
    handleSearch();
  }, [filterType, floor, searchText, distributionBoards, handleSearch]);

  const getMarkerPosition = (location) => {
    if (!location) return { x: 0, y: 0 };
    const [x, y] = location.split('-').slice(1).map(Number);
    return { x: x / 10, y: y / 10 };
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
          <div className="flex">
            {['distributionBoard', 'facilities', 'manual'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'distributionBoard' ? '분전반 정보' : 
                 tab === 'facilities' ? '시설물 현황' : '매뉴얼'}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'distributionBoard' && (
          <>
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <select
                    className="flex-grow p-2 border rounded"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                  >
                    <option value="">전체 층</option>
                    {[...new Set(distributionBoards.map(board => board['층']))].map(floorOption => (
                      <option key={floorOption} value={floorOption}>{floorOption}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="flex-grow p-2 border rounded mx-2"
                    placeholder="검색어 입력"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                    onClick={handleSearch}
                  >
                    <Search size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap -mx-2 mb-4">
                  {['all', 'single', 'three-phase-three-wire', 'three-phase-four-wire'].map((type) => (
                    <button
                      key={type}
                      className={`m-2 px-3 py-1 text-sm rounded-full ${
                        filterType === type ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                      onClick={() => setFilterType(type)}
                    >
                      {type === 'all' ? '전체' : 
                       type === 'single' ? '단상' : 
                       type === 'three-phase-three-wire' ? '3상3선' : '3상4선'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {selectedFloorPlan && (
              <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
                <div className="relative">
                  <Zoom>
                    <img src={selectedFloorPlan} alt="Floor Plan" className="w-full h-auto" />
                    {filteredBoards.map((board, index) => {
                      const { x, y } = getMarkerPosition(board['장소']);
                      return (
                        <div
                          key={index}
                          className="absolute w-3 h-3 bg-red-500 rounded-full"
                          style={{ left: `${x}%`, top: `${y}%` }}
                          title={board['분전반 명칭']}
                        ></div>
                      );
                    })}
                  </Zoom>
                </div>
              </div>
            )}

            {filteredBoards.length > 0 && (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4">검색 결과</h3>
                  {filteredBoards.map((board, index) => (
                    <div key={index} className="mb-4 last:mb-0 p-3 bg-gray-50 rounded">
                      <h4 className="font-medium">{board['분전반 명칭']}</h4>
                      <p className="text-sm text-gray-600">층: {board['층']}</p>
                      <p className="text-sm text-gray-600">용도: {board['용도']}</p>
                      <p className="text-sm text-gray-600">전압: {board['전압']}</p>
                      <p className="text-sm text-gray-600">MAIN 차단기: {board['MAIN 차단기']}</p>
                      <details>
                        <summary className="text-sm text-blue-500 cursor-pointer">분기 정보</summary>
                        <ul className="mt-2 pl-4 text-sm">
                          {board['분기'] && board['분기'].map((branch, i) => (
                            <li key={i}>{branch}</li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'facilities' && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold">시설물 현황</h3>
              <p>시설물 현황 내용을 여기에 추가하세요.</p>
            </div>
          </div>
        )}

        {activeTab === 'manual' && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold">매뉴얼</h3>
              <p>매뉴얼 내용을 여기에 추가하세요.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectricalManagementApp;
