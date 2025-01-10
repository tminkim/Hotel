import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const submitData = async () => {
    try {
      const response = await axios.post(
        'https://script.google.com/macros/s/AKfycbz5xUWk83jBMAGSf6_VM7Islde0bjc4aWw1WIb5pJJkAQx3kmAbc370xOnRStOssBY/exec', // Apps Script Web App URL
        {
          name: name,
          email: email,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('응답 데이터:', response.data);
      // 전송 성공 시 추가 동작
    } catch (error) {
      console.error('데이터 전송 실패:', error);
      // 에러 처리
    }
  };

  return (
    <div>
      <h1>Apps Script 테스트</h1>
      <input
        type="text"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={submitData}>데이터 전송</button>
    </div>
  );
}

export default App;
