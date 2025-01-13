import React, { useState } from 'react';

const PendingApproval = ({ pendingItems, setPendingItems }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // 수정 모드 진입
  const handleEdit = (index) => {
    const item = pendingItems[index];
    setTitle(item.title);
    setDescription(item.description);
    setImageFile(item.imageFile);
    setEditingIndex(index);
  };

  // 수정 사항 반영
  const handleUpdate = () => {
    if (editingIndex === null) return;
    const updatedItems = [...pendingItems];
    updatedItems[editingIndex] = {
      title,
      description,
      imageFile
    };
    setPendingItems(updatedItems);
    // 수정 후 초기화
    setEditingIndex(null);
    setTitle('');
    setDescription('');
    setImageFile(null);
  };

  // 삭제
  const handleDelete = (index) => {
    const updatedItems = pendingItems.filter((_, i) => i !== index);
    setPendingItems(updatedItems);
  };

  // 최종 승인 후 Teams 전송
  const handleApprove = async (index) => {
    const item = pendingItems[index];
    try {
      const formData = new FormData();
      formData.append('title', item.title);
      formData.append('description', item.description);
      if (item.imageFile) {
        formData.append('image', item.imageFile);
      }

      // 실제로는 서버 혹은 서버리스 함수를 통해 Microsoft Teams 업로드
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      console.log('서버 응답:', result);

      // 성공 시 목록에서 제거
      handleDelete(index);
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">작업 승인 대기 목록</h2>

      {/* 수정 중인 항목이 있을 때 표시되는 폼 */}
      {editingIndex !== null && (
        <div className="mb-4 bg-gray-100 p-3 rounded shadow-sm">
          <label className="block mb-1 font-medium">작업 제목</label>
          <input
            type="text"
            className="border border-gray-300 rounded-md px-3 py-2 w-full mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="block mb-1 font-medium">작업 설명</label>
          <textarea
            className="border border-gray-300 rounded-md px-3 py-2 w-full mb-2"
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="block mb-1 font-medium">이미지 변경</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-2"
          />

          <button
            onClick={handleUpdate}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded"
          >
            수정 완료
          </button>
        </div>
      )}

      {pendingItems.length === 0 ? (
        <p className="text-gray-500">대기 중인 작업이 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {pendingItems.map((item, idx) => (
            <li key={idx} className="bg-gray-50 p-3 rounded shadow-sm">
              <div className="mb-2">
                <strong>제목:</strong> {item.title}
              </div>
              <div className="mb-2">
                <strong>설명:</strong> {item.description}
              </div>
              {item.imageFile && (
                <div className="mb-2">
                  <strong>이미지:</strong> {item.imageFile.name}
                </div>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(idx)}
                  className="px-3 py-1 bg-yellow-400 text-white rounded"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  삭제
                </button>
                <button
                  onClick={() => handleApprove(idx)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  최종 전송
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingApproval;
