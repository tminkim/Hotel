// React 예시 (Teams.js 처럼 작성해볼 수 있음)

import React, { useState } from 'react';

const App = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // 스프레드시트가 Title, Description 컬럼 헤더를 가정

  const handleSave = async () => {
    try {
      const webAppUrl = "복사해둔_웹앱_URL"; // 구글 웹 앱 URL
      // fetch 옵션
      const response = await fetch(webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          Title: title,
          Description: description
        })
      });
      const result = await response.json();
      if (result.result === "success") {
        alert("스프레드시트에 임시 저장 되었습니다!");
        setTitle('');
        setDescription('');
      } else {
        console.error("Error:", result);
      }
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h3>위험작업 등록 (Google Sheets 임시 저장)</h3>
      <div style={{ marginBottom: '10px' }}>
        <label>제목: </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>설명: </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button onClick={handleSave}>임시 저장</button>
    </div>
  );
};

export default App;
