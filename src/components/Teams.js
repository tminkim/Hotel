import React from "react";

const TestGetRequest = () => {
  const handleGetRequest = async () => {
    const scriptUrl = "https://script.google.com/macros/s/AKfycbx82E0vh4-j2mbpaScaiKzNHsD5kl6sqGudW6uf8J9RhLSRB6W16FqAyR4RJ8-e8j0X/exec"; // Web App URL

    try {
      const response = await fetch(scriptUrl, {
        method: "GET", // GET 요청
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("GET Response:", result);
      alert(`GET 요청 성공: ${JSON.stringify(result)}`);
    } catch (error) {
      console.error("GET Request Error:", error.message);
      alert("GET 요청 실패");
    }
  };

  return (
    <div>
      <h1>Google Apps Script GET 테스트</h1>
      <button onClick={handleGetRequest}>GET 요청 보내기</button>
    </div>
  );
};

export default TestGetRequest;
