import React, { useState, useEffect, useCallback, useRef } from 'react';
import Modal from 'react-modal';
import { Search } from 'lucide-react';
import '../styles.css';

const DistributionBoard = () => {
    const [filterType, setFilterType] = useState('all');
    const [floor, setFloor] = useState('');
    const [searchText, setSearchText] = useState('');
    const [distributionBoards, setDistributionBoards] = useState([]);
    const [filteredBoards, setFilteredBoards] = useState([]);
    const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [showLoadList, setShowLoadList] = useState(false);
    const [spareActive, setSpareActive] = useState(false);

    const loadListRef = useRef(null);

    const fetchCSVData = useCallback(async () => {
        const SPREADSHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1QHwv1YpflqE6T9AEcEbP47CRWPXKwuOJ4lFmC8RPM_M/export?format=csv';
        
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

    const applyFilters = useCallback(() => {
        let results = distributionBoards;

        // 전압 필터링
        if (filterType !== 'all') {
            if (filterType === 'single') {
                results = results.filter(board => board['전압'] && board['전압'].includes('1상'));
            } else if (filterType === 'three-phase-three-wire') {
                results = results.filter(board => board['전압'] && board['전압'].includes('3상3선'));
            } else if (filterType === 'three-phase-four-wire') {
                results = results.filter(board => board['전압'] && board['전압'].includes('3상4선'));
            }
        }

        // 층 필터링
        if (floor) {
            results = results.filter(board => board['층'] === floor);
            setSelectedFloorPlan(`/images/${floor}.jpg`);
        } else {
            setSelectedFloorPlan(null);
        }

        // 검색어 필터링
        if (searchText) {
            results = results.filter(board =>
                Object.values(board).some(value =>
                    typeof value === 'string' && value.toLowerCase().includes(searchText.toLowerCase())
                ) ||
                (board['분기'] && board['분기'].some(branch => branch.toLowerCase().includes(searchText.toLowerCase())))
            );
        }

        // SPARE 필터링
        if (spareActive) {
            results = results.filter(board =>
                board['분기'] && board['분기'].some(branch => branch.match(/\bSP\b/))
            );
        }

        // 마커 클릭으로 필터링
        if (selectedLocation) {
            results = results.filter(board => board['장소'] === selectedLocation);
        }

        setFilteredBoards(results);
        setSearchPerformed(true);
    }, [filterType, floor, searchText, distributionBoards, spareActive, selectedLocation]);

    useEffect(() => {
        fetchCSVData();
    }, [fetchCSVData]);

    useEffect(() => {
        applyFilters();
    }, [filterType, floor, searchText, spareActive, selectedLocation, applyFilters]);

    const getMarkerPosition = (location) => {
        if (!location) return { x: 0, y: 0 };
        const [x, y] = location.split('-').slice(1).map(Number);
        return { x: x / 10, y: y / 10 };
    };

    const handleMarkerClick = (location) => {
        if (selectedLocation === location) {
            setSelectedLocation(null);  // 마커 선택 해제
        } else {
            setSelectedLocation(location);  // 마커 선택
        }
    };

    const openModal = (board) => {
        setSelectedBoard(board);
        setShowLoadList(false);
        setModalIsOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedBoard(null);
        setShowLoadList(false);
        document.body.style.overflow = 'auto';
    };

    const toggleLoadList = () => {
        setShowLoadList(!showLoadList);
        if (!showLoadList) {
            setTimeout(() => {
                if (loadListRef.current) {
                    loadListRef.current.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
        }
    };

    return (
        <>
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
                <div className="p-4">
                    <div className="flex flex-wrap -mx-2 mb-4">
                        <div className="flex w-full mb-4">
                            <select
                                className="flex-grow mr-2 p-2 border rounded"
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
                                className="flex-grow-2 mr-2 p-2 border rounded"
                                style={{ width: '40%' }}
                                placeholder="검색어 입력"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                                onClick={applyFilters}
                            >
                                <Search size={20} />
                            </button>
                        </div>
                        <div className="flex flex-wrap w-full -mx-1 mb-4">
                            {['all', 'single', 'three-phase-three-wire', 'three-phase-four-wire'].map((type) => (
                                <button
                                    key={type}
                                    className={`m-1 px-3 py-1 text-sm rounded-full filter-button ${filterType === type ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    onClick={() => setFilterType(type)}
                                >
                                    {type === 'all' ? '전체' : 
                                    type === 'single' ? '단상' : 
                                    type === 'three-phase-three-wire' ? '3상3선' : '3상4선'}
                                </button>
                            ))}
                            <button
                                className={`m-1 px-3 py-1 text-sm rounded-full filter-button ${spareActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => setSpareActive(!spareActive)}
                                style={{ minWidth: 'auto', padding: '0.5rem 0.75rem' }}
                            >
                                SPARE
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {selectedFloorPlan && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
                    <div className="relative">
                        <img src={selectedFloorPlan} alt="Floor Plan" className="w-full h-auto" />
                        {distributionBoards.filter(board => board['층'] === floor && (!spareActive || (spareActive && board['분기'] && board['분기'].some(branch => branch.match(/\bSP\b/))))).map((board, index) => {
                            const { x, y } = getMarkerPosition(board['장소']);
                            let markerColor = 'bg-red-500'; // 기본 색상 (빨간색)

                            // SPARE 데이터 확인
                            const isSpareBoard = board['분기'] && board['분기'].some(branch => branch.match(/\bSP\b/));

                            if (spareActive && isSpareBoard) {
                                markerColor = 'bg-green-500'; // SPARE 데이터에 해당하는 마커는 초록색
                            }

                            if (selectedLocation === board['장소']) {
                                markerColor = 'bg-blue-500'; // 클릭한 마커는 파란색
                            }

                            return (
                                <div
                                    key={index}
                                    className={`absolute w-2 h-2 rounded-full ${markerColor}`}
                                    style={{ left: `${x}%`, top: `${y}%` }}
                                    title={board['분전반 명칭']}
                                    onClick={() => {
                                        handleMarkerClick(board['장소']);
                                        applyFilters(); // 마커 클릭 후 필터 적용
                                    }}
                                ></div>
                            );
                        })}
                    </div>
                </div>
            )}

            {searchPerformed && filteredBoards.length > 0 && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-4">
                        <h3 className="text-lg font-semibold mb-4">검색 결과</h3>
                        <div className="space-y-2">
                            {filteredBoards.map((board, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center p-3 bg-gray-50 rounded"
                                    onClick={() => openModal(board)}
                                >
                                    <div className="w-1/2 font-medium">{board['분전반 명칭']}</div>
                                    <div className="w-1/4 text-gray-600">{board['용도']}</div>
                                    <div className="w-1/4 text-gray-600">{board['전압']}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Board Details"
                className="distribution-modal"
                overlayClassName="distribution-overlay"
            >
                {selectedBoard && (
                    <>
                        <button onClick={closeModal} className="distribution-close-button">X</button>
                        <div className="modal-content p-4">
                            <h2 className="text-lg font-bold mb-4">{selectedBoard['분전반 명칭']}</h2>
                            <div className="relative mb-4">
                                <img src={`/images/${selectedBoard['층']}.jpg`} alt="Floor Plan" className="w-full h-auto" />
                                <div
                                    className="absolute w-2 h-2 bg-red-500 rounded-full"
                                    style={{ left: `${getMarkerPosition(selectedBoard['장소']).x}%`, top: `${getMarkerPosition(selectedBoard['장소']).y}%` }}
                                    title={selectedBoard['분전반 명칭']}
                                ></div>
                            </div>
                            <table className="w-full mb-4 table-auto border-collapse border border-gray-300">
                                <tbody>
                                    <tr className="border border-gray-300">
                                        <td className="font-bold p-2 border border-gray-300">층</td>
                                        <td className="p-2 border border-gray-300">{selectedBoard['층']}</td>
                                        <td className="font-bold p-2 border border-gray-300">설치형태</td>
                                        <td className="p-2 border border-gray-300">{selectedBoard['설치형태']}</td>
                                    </tr>
                                    <tr className="border border-gray-300">
                                        <td className="font-bold p-2 border border-gray-300">용도</td>
                                        <td className="p-2 border border-gray-300">{selectedBoard['용도']}</td>
                                        <td className="font-bold p-2 border border-gray-300">전압</td>
                                        <td className="p-2 border border-gray-300">{selectedBoard['전압']}</td>
                                    </tr>
                                    <tr className="border border-gray-300">
                                        <td className="font-bold p-2 border border-gray-300">MAIN 차단기</td>
                                        <td className="p-2 border border-gray-300">{selectedBoard['MAIN 차단기']}</td>
                                        <td className="font-bold p-2 border border-gray-300">간선 SQ</td>
                                        <td className="p-2 border border-gray-300">{selectedBoard['간선 SQ']}</td>
                                    </tr>
                                    <tr className="border border-gray-300">
                                        <td className="font-bold p-2 border border-gray-300">TR명</td>
                                        <td className="p-2 border border-gray-300">{selectedBoard['TR명']}</td>
                                        <td className="font-bold p-2 border border-gray-300">면수</td>
                                        <td className="p-2 border border-gray-300">{selectedBoard['면수']}</td>
                                    </tr>
                                    <tr className="border border-gray-300">
                                        <td className="font-bold p-2 border border-gray-300">FEEDER명</td>
                                        <td className="p-2 border border-gray-300">{selectedBoard['FEEDER명']}</td>
                                        <td className="font-bold p-2 border border-gray-300">2차분기판넬</td>
                                        <td className="p-2 border border-gray-300">{selectedBoard['2차분기판넬']}</td>
                                    </tr>
                                    <tr className="border border-gray-300">
                                        <td className="font-bold p-2 border border-gray-300">비고</td>
                                        <td className="p-2 border border-gray-300" colSpan="3">{selectedBoard['비고']}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <button
                                onClick={toggleLoadList}
                                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                            >
                                부하 리스트 보기
                            </button>
                            {showLoadList && (
                                <div className="bg-gray-100 p-4 rounded load-list" ref={loadListRef}>
                                    <h3 className="font-bold mb-2">부하 리스트</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedBoard['분기'].map((load, index) => (
                                            <div key={index} className={`bg-white p-2 border rounded shadow-sm ${load.includes('SP') ? 'sp-highlight' : ''}`}>
                                                {load}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </Modal>
        </>
    );
};

export default DistributionBoard;
