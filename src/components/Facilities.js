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
  const [markerData, setMarkerData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

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

  // 마커 위치 계산 함수
  const getMarkerPosition = (location) => {
    if (!location) return null;
    const [x, y] = location.split('-').map(Number);
    return { x: x / 10, y: y / 10 };
  };

  // 시설 버튼 클릭 시 이미지와 1열 데이터를 설정하는 함수
  const handleButtonClick = (facility) => {
    setSelectedFacility(facility);
    let image = null;
    let data = [];
    let markerData = [];

    if (facility.id === 'elevator') {
      image = '/images/lobby.jpg';
      data = elevatorData.map(item => item['호기']);
      markerData = elevatorData.map(item => item['위치']);
    } else if (facility.id === 'gondola') {
      image = '/images/lobby.jpg';
      data = gondolaData.map(item => item['호기']);
      markerData = gondolaData.map(item => item['위치']);
    } else if (facility.id === 'ups') {
      image = null;
      data = upsData.map(item => item['장소']);
    }

    setSelectedImage(image);
    setFirstColumnData(data);
    setMarkerData(markerData);
    setSelectedLocation(null); // 마커 선택 해제
  };

  // 마커 클릭 시 데이터 필터링
  const handleMarkerClick = (location) => {
    if (selectedLocation === location) {
      setSelectedLocation(null); // 마커 선택 해제
      const data = selectedFacility.id === 'elevator'
        ? elevatorData.map(item => item['호기'])
        : gondolaData.map(item => item['호기']);
      setFirstColumnData(data); // 전체 데이터 표시
    } else {
      setSelectedLocation(location); // 새로운 위치 선택
      const filteredData = selectedFacility.id === 'elevator'
        ? elevatorData.filter(item => item['위치'] === location).map(item => item['호기'])
        : gondolaData.filter(item => item['위치'] === location).map(item => item['호기']);
      setFirstColumnData(filteredData); // 필터링된 데이터만 표시
    }
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

  // 천단위 쉼표 추가 및 특별한 값 처리 함수
  const formatValue = (field, value) => {
    // 하중(KG)과 정원(인) 필드에만 쉼표 추가
    if (field === '하중(KG)' || field === '정원(인)') {
      // 숫자 포함된 문자열 처리 ('6000명/hr' -> '6,000명/hr')
      if (/\d/.test(value) && typeof value === 'string') {
        return value.replace(/\d+/, match => Number(match).toLocaleString());
      }
    }

    return value; // 다른 경우는 원래 값을 그대로 반환
  };

  // 1열 데이터를 렌더링하는 함수
  const renderFirstColumnData = () => {
    const gridTemplateColumns = 'repeat(2, 1fr)'; // 2열로 설정

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
      ? ['호기', '기종', '용도', '하중(KG)', '정원(인)', '속도(m/min)', '전원(AC)', '전동기(kW)', '운행층', '준공일', '제작사', '유지보수업체', '위치', '비고']
      : selectedFacility.id === 'gondola'
      ? ['호기', '위치', '용도', '형식', '승강양정(M)', '적재량(kg)', '전원(V)', '승강모터(kW)', '주행모터(kW)', '암터링모터(kW)', '회전모터(kW)', '승강속도(M/min)', '주행속도(M/min)', '암터링속도(M/min)', '대차회전속도(RPM)', '와이어로프(mm)', '제조사', '설치년도', '검사년도', '비고']
      : ['장소', '타입', '용량', '전압', '제조번호', '제작년월', '축전지', '축전지년월', '설치업체', '유지보수', '비고'];

    return (
      <table className="w-full mb-4 table-auto border-collapse border border-gray-300">
        <tbody>
          {fields.map((field, index) => (
            <tr key={index} className="border border-gray-300">
              <td className="font-bold p-2 border border-gray-300">{field}</td>
              <td className="p-2 border border-gray-300">
                {formatValue(field, selectedData[field])}
              </td>
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
            {selectedImage && (
              <div className="relative mb-4">
                <img src={selectedImage} alt={`${selectedFacility.name} 도면`} className="w-full h-auto" />
                {markerData && markerData.map((location, index) => {
                  const position = getMarkerPosition(location);
                  if (position) {
                    return (
                      <div
                        key={index}
                        className={`absolute w-2 h-2 rounded-full ${selectedLocation === location ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ left: `${position.x}%`, top: `${position.y}%` }}
                        title={`Marker ${index + 1}`}
                        onClick={() => handleMarkerClick(location)}
                      ></div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
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
                  {selectedData['위치'] && (
                    <div
                      className="absolute w-2 h-2 bg-red-500 rounded-full"  // 분전반 모달과 동일한 색상 적용
                      style={{ left: `${getMarkerPosition(selectedData['위치']).x}%`, top: `${getMarkerPosition(selectedData['위치']).y}%` }}
                      title="Selected Location"
                    ></div>
                  )}
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
