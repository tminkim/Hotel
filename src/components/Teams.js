import React, { useState } from "react";

const App = () => {
  const [testResult, setTestResult] = useState("");
  const [formData, setFormData] = useState({
    date: "2025-01-01",
    supervisor: "홍길동",
    taskName: "테스트 작업",
    taskLocation: "서울",
    personnel: 10,
    risks: "고소 작업",
    startTime: "10:00",
    endTime: "18:00",
  });

  const scriptUrl = "https://script.google.com/macros/s/AKfycbx82E0vh4-j2mbpaScaiKzNHsD5kl6sqGudW6uf8J9RhLSRB6W16FqAyR4RJ8-e8j0X/exec"; // Web App URL 입력

  // GET 요청 테스트
  const testGetRequest = async () => {
    try {
      const response = await fetch(scriptUrl, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("GET Response:", result);
      setTestResult(`GET Response: ${JSON.stringify(result)}`);
    } catch (error) {
      console.error("GET Request Error:", error.message);
      setTestResult(`GET 요청 실패: ${error.message}`);
    }
  };

  // POST 요청 테스트
  const testPostRequest = async () => {
    try {
      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("POST Response:", result);
      setTestResult(`POST Response: ${JSON.stringify(result)}`);
    } catch (error) {
      console.error("POST Request Error:", error.message);
      setTestResult(`POST 요청 실패: ${error.message}`);
    }
  };

  // 폼 데이터 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>React - Google Apps Script 테스트</h1>
      <button
        onClick={testGetRequest}
        style={{ margin: "10px", padding: "10px", backgroundColor: "blue", color: "white" }}
      >
        Test GET Request
      </button>
      <button
        onClick={testPostRequest}
        style={{ margin: "10px", padding: "10px", backgroundColor: "green", color: "white" }}
      >
        Test POST Request
      </button>
      <h3>Test Result:</h3>
      <pre>{testResult}</pre>

      <h2>POST 데이터 입력</h2>
      <form>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Supervisor:
          <input
            type="text"
            name="supervisor"
            value={formData.supervisor}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Task Name:
          <input
            type="text"
            name="taskName"
            value={formData.taskName}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Task Location:
          <input
            type="text"
            name="taskLocation"
            value={formData.taskLocation}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Personnel:
          <input
            type="number"
            name="personnel"
            value={formData.personnel}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Risks:
          <input
            type="text"
            name="risks"
            value={formData.risks}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Start Time:
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          End Time:
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
          />
        </label>
        <br />
      </form>
    </div>
  );
};

export default App;
