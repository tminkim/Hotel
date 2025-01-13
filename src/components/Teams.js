// src/components/Teams.js
import React, { useState } from 'react';

const Teams = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    try {
      const response = await fetch('/.netlify/functions/pendingTasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });
      const result = await response.json();
      alert(result.message); // "임시 저장 완료"

      // 입력값 초기화
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error(error);
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
          placeholder="작업 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">작업 설명</label>
        <textarea
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
          rows="3"
          placeholder="작업 내용을 입력하세요"
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
