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
      setPostResponse(data); // 응답 데이터를 상태로 저장
    } catch (error) {
      console.error('POST 요청 실패:', error.message);
      setPostResponse({ error: error.message });
    }
  };
}
export default App;
