import React, { useState } from 'react';

function App() {
  const [getResponse, setGetResponse] = useState(null); // GET 요청 응답 저장
  const [postResponse, setPostResponse] = useState(null); // POST 요청 응답 저장

  // Google Apps Script Web App URL
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbz5xUWk83jBMAGSf6_VM7Islde0bjc4aWw1WIb5pJJkAQx3kmAbc370xOnRStOssBY/exec'; // Web App URL로 변경

  // GET 요청 처리 함수
  const handleGetRequest = async () => {
    try {
      const response = await fetch(`${scriptUrl}?param1=value1&param2=value2`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGetResponse(data); // 응답 데이터 저장
    } catch (error) {
      console.error('GET 요청 실패:', error.message);
      setGetResponse({ error: error.message });
    }
  };

  // POST 요청 처리 함수
  const handlePostRequest = async () => {
    try {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key1: 'value1',
          key2: 'value2',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPostResponse(data); // 응답 데이터 저장
    } catch (error) {
      console.error('POST 요청 실패:', error.message);
      setPostResponse({ error: error.message });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>React와 Google Apps Script 통신 테스트</h1>

      {/* GET 요청 버튼 */}
      <button
        onClick={handleGetRequest}
        style={{
          margin: '10px',
          padding: '10px',
          backgroundColor: 'blue',
          color: 'white',
        }}
      >
        GET 요청 보내기
      </button>
      {getResponse && (
        <div>
          <h2>GET 응답:</h2>
          <pre>{JSON.stringify(getResponse, null, 2)}</pre>
        </div>
      )}

      {/* POST 요청 버튼 */}
      <button
        onClick={handlePostRequest}
        style={{
          margin: '10px',
          padding: '10px',
          backgroundColor: 'green',
          color: 'white',
        }}
      >
        POST 요청 보내기
      </button>
      {postResponse && (
        <div>
          <h2>POST 응답:</h2>
          <pre>{JSON.stringify(postResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
