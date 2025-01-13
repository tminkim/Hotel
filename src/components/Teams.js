// Teams.js
import React, { useState } from 'react';

const Teams = () => {
  // 폼 입력 상태
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Google Apps Script로 배포한 웹 앱 URL
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbx20K_zcgv3JpVeAcoDIcjbKHtHKCnnX_B618C9WP_4sGUcqmSJ7ONiaUMEk_ikH5p3/exec'; 
  // ↑ 실제로는 구글 앱스 스크립트 배포 후 얻은 URL로 교체

  // "임시 저장" 버튼 클릭 시 실행되는 함수
  const handleSave = async () => {
    try {
      // fetch로 POST 요청 (application/x-www-form-urlencoded)
      const response = await fetch(WEB_APP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          Title: title,         // 시트에 "Title" 열이 있어야 함
          Description: description // 시트에 "Description" 열이 있어야 함
        })
      });

      const result = await response.json(); 
      console.log('스프레드시트 응답:', result);

      if (result.result === 'success') {
        alert('스프레드시트에 임시 저장되었습니다!');
        // 입력값 초기화
        setTitle('');
        setDescription('');
      } else {
        alert('스프레드시트에 저장 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('저장 요청 중 에러:', error);
      alert('네트워크 혹은 서버 에러가 발생했습니다.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">위험작업 등록</h2>
      
      <div className="mb-4">
        <label className="block mb-1 font-medium">작업 제목</label>
        <input
          type="text"
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
          placeholder="예: 안전벨트 미착용..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">작업 설명</label>
        <textarea
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
          rows="3"
          placeholder="상세 설명을 입력하세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        임시 저장
      </button>
    </div>
  );
};

export default Teams;
