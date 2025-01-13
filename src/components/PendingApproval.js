// src/components/PendingApproval.js
import React, { useEffect, useState } from 'react';

const PendingApproval = () => {
  const [tasks, setTasks] = useState([]);

  // 컴포넌트 로드 시점에 GET 요청
  useEffect(() => {
    fetchPendingTasks();
  }, []);

  const fetchPendingTasks = async () => {
    try {
      const response = await fetch('/.netlify/functions/pendingTasks');
      const data = await response.json();
      if (data.tasks) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">승인 대기 목록</h2>
      {tasks.length === 0 ? (
        <p>등록된 작업이 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="bg-gray-100 p-3 rounded shadow-sm">
              <strong>제목:</strong> {task.title}
              <br />
              <strong>설명:</strong> {task.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingApproval;
