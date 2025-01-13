import React, { useState } from 'react';

const Teams = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async () => {
    try {
      // 이미지와 텍스트를 함께 전송할 때는 FormData를 사용
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      // netlify functions의 경로: /.netlify/functions/upload
      // (upload.js의 exports.handler 부분이 실행됨)
      const response = await fetch('/.netlify/functions/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      console.log('서버 응답:', result);

      // 이후 로직 (알림, input 초기화 등)
      alert(result.message);
      setTitle('');
      setDescription('');
      setImageFile(null);

    } catch (error) {
      console.error('에러:', error);
    }
  };

  return (
    <div>
      <h1>위험작업 등록</h1>
      <div>
        <label>작업 제목: </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label>작업 설명: </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label>이미지 업로드: </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
      </div>

      <button onClick={handleSubmit}>전송하기</button>
    </div>
  );
};

export default Teams;
