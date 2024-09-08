import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import '../styles.css';

const Facilities = () => {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [elevatorData, setElevatorData] = useState([]);
  const [gondolaData, setGondolaData] = useState([]);
  const [upsData, setUpsData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [firstColumnData, setFirstColumnData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  // CSV 데이터를 파싱하는 함수
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

  // 승강기 데이터를 가져오는 함수
  const fetchElevatorData = useCallback(async () => {
    const ELEVATOR_CSV_URL = 'https://docs.google.com/spreadsheets/d/11SG04Ob3Z4IQmpYPdSwFXZe9EP3vwUtIBnKqIMot7OA/export?format=csv';
    
    try {
      const response = await fetch(ELEVATOR_CSV_URL);
      const text = await response.text();
      const data = parseCSV(text);
      setElevatorData(data);
    } catch (error) {
      console.error('Error fetching Elevator CSV data:', error);
    }
  }, []);

  // 곤도라 데이터를 가져오는 함수
  const fetchGondolaData = useCallback(async () => {
    const GONDOLA_CSV_URL = 'https://docs.google.com/spreadsheets/d/1xboyVF9psRyC9nlmAMoTLibKCZwC8fuC2gDCBmMecpU/export?format=csv';
    
    try {
      const response = await fetch(GONDOLA_CSV_URL);
      const text = await response.text();
      const data = parseCSV(text);
      setGondolaData(data);
    } catch (error) {
      console.error('Error fetching Gondola CSV data:', error);
    }
  }, []);

  // UPS 데이터를 가져오는 함수
  const fetchUPSData = useCallback(async () => {
    const UPS_CSV_URL = 'https://docs.google.com/spreadsheets/d/1pio8AEhR313wVj8dypfV231Yr5ggWcy26pHOKBw1zZM/export?format=csv';
    
    try {
      const response = await fetch(UPS_CSV_URL);
      const text = await response.text();
      const data = parseCSV(text);
      setUpsData(data);
    } catch (error) {
      console.error('Error fetching UPS CSV data:', error);
    }
  }, []);

  // 컴포넌트가 마운트될 때 데이터를 가져오는 useEffect
  useEffect(() => {
    fetchElevatorData();
    fetchGondolaData();
    fetchUPSData();
  }, [fetchElevatorData, fetchGondolaData, fetchUPSData]);

  const facilitiesData = [
    { id: 'elevator', name: '승강기', description: '승강기 정보입니다.' },
    { id: 'gondola', name: '곤도라', description: '곤도라 정보입니다.' },
    { id: 'ups', name: 'UPS', description: 'UPS 정보입니다.' },
  ];

  // 시설 버튼 클릭 시 이미지와 1열 데이터를 설정하는 함수
  const handleButtonClick = (facility) => {
    setSelectedFacility(facility);
    let image = null;
    let data = [];

    if (facility.id === 'elevator') {
      image = '/images/elevator-floor-plan.jpg';  // 승강기 도면 이미지 경로
      data = elevatorData.map(item => item['호기']);
    } else if (facility.id === 'gondola') {
      image = '/images/gondola-floor-plan.jpg';  // 곤도라 도면 이미지 경로
      data = gondolaData.map(item => item['호기']);
    } else if (facility.id === 'ups') {
      image = null;  // UPS는 이미지 없음
      data = upsData.map(item => item['장소']);
    }

    setSelectedImage(image);
    setFirstColumnData(data);
  };

  // 1열 데이터 버튼 클릭 시 모달 창 열기
  const handleDataButtonClick = (data) => {
    let selected;
    if (selectedFacility.id === 'elevator') {
      selected = elevatorData.find(item => item['호기'] === data);
    } else if (selectedFacility.id === 'gondola') {
      selected = gondolaData.find(item => item['호기'] === data);
    } else {
      selected = upsData.find(item => item['장소'] === data);
    }
    setSelectedData(selected);
    setModalIsOpen(true);
  };

  // 모달 창 닫기
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedData(null);
  };

  // 1열 데이터를 렌더링하는 함수
  const renderFirstColumnData = () => {
    const gridTemplateColumns = selectedFacility.id === 'ups' ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)';

    return (
      <div className="grid gap-2" style={{ gridTemplateColumns }}>
        {firstColumnData.map((data, index) => (
          <button
            key={index}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded mb-2"
            onClick={() => handleDataButtonClick(data)}
          >
            {data}
          </button>
        ))}
      </div>
    );
  };

  // 모달 창에서 선택된 데이터 표시
  const renderModalContent = () => {
    if (!selectedData) return null;

    const fields = selectedFacility.id === 'elevator' 
      ? ['호기', '기종', '용도', '하중(KG)', '정원(인)', '속도(m/min)', '전원(AC)', '전동기(kW)', '운행층', '준공일', '제작사', '유지보수업체', '비고']
      : selectedFacility.id === 'gondola'
      ? ['호기', '위치', '용도', '형식', '승강양정(M)', '적재량(kg)', '전원(V)', '승강모터(kW)', '주행모터(kW)', '암터링모터(kW)', '회전모터(kW)', '승강속도(M/min)', '주행속도(M/min)', '암터링속도(M/min)', '대차회전속도(RPM)', '와이어로프(mm)', '제조사', '설치년도', '검사년도', '비고']
      : ['장소', '타입', '용량', '전압', '제조번호', '제작년월', '축전지', '축전지년월', '설치업체', '유지보수', '비고'];

    return (
      <table className="w-full mb-4 table-auto border-collapse border border-gray-300">
        <tbody>
          {fields.map((field, index) => (
            <tr key={index} className="border border-gray-300">
              <td className="font-bold p-2 border border-gray-300">{field}</td>
              <td className="p-2 border border-gray-300">{selectedData[field]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

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
                onClick={() => handleButtonClick(facility)}
              >
                {facility.name}
              </button>
            </div>
          ))}
        </div>
        {selectedFacility && (
          <div className="facility-details">
            <h4 className="text-lg font-semibold">{selectedFacility.name}</h4>
            {selectedImage && <img src={selectedImage} alt={`${selectedFacility.name} 도면`} className="w-full h-auto mb-4" />}
            {renderFirstColumnData()}
          </div>
        )}
      </div>

      {/* 모달 창 */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel={`${selectedFacility ? selectedFacility.name : ''} Details`}
        className="facility-modal"
        overlayClassName="facility-overlay"
      >
        {selectedData && (
          <>
            <button onClick={closeModal} className="facility-close-button">X</button>
            <div className="modal-content p-4">
              <h2 className="text-lg font-bold mb-4">상세 정보 - {selectedData['호기'] || selectedData['장소']}</h2>
              {selectedImage && (
                <div className="relative mb-4">
                  <img src={selectedImage} alt={`${selectedFacility.name} 도면`} className="w-full h-auto" />
                </div>
              )}
              {renderModalContent()}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Facilities;