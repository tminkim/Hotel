import React, { useState } from 'react';

const Form = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    date: '',
    personnel: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToUpload = new FormData();
    formDataToUpload.append('businessName', formData.businessName);
    formDataToUpload.append('date', formData.date);
    formDataToUpload.append('personnel', formData.personnel);
    if (formData.file) {
      formDataToUpload.append('file', formData.file);
    }

    try {
      const response = await fetch('https://your-google-drive-upload-url', {
        method: 'POST',
        body: formDataToUpload,
      });

      if (response.ok) {
        alert('데이터가 성공적으로 업로드되었습니다!');
      } else {
        alert('업로드 중 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error uploading data:', error);
      alert('업로드 실패!');
    }
  };

  return (
    <form className="bg-white shadow-md rounded-lg p-4" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="businessName" className="block text-sm font-medium mb-2">
          사업장명
        </label>
        <input
          type="text"
          id="businessName"
          name="businessName"
          className="w-full p-2 border rounded"
          value={formData.businessName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium mb-2">
          일시
        </label>
        <input
          type="datetime-local"
          id="date"
          name="date"
          className="w-full p-2 border rounded"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="personnel" className="block text-sm font-medium mb-2">
          인원
        </label>
        <input
          type="number"
          id="personnel"
          name="personnel"
          className="w-full p-2 border rounded"
          value={formData.personnel}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="file" className="block text-sm font-medium mb-2">
          사진 업로드
        </label>
        <input
          type="file"
          id="file"
          name="file"
          className="w-full p-2 border rounded"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded"
      >
        승인 요청
      </button>
    </form>
  );
};

export default Form;
