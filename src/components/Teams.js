import React, { useState } from 'react';

const Form = () => {
  const [formData, setFormData] = useState({
    date: '',
    supervisor: '',
    taskName: '',
    taskLocation: '',
    personnel: '',
    risks: '',
    startTime: '',
    endTime: '',
    photos: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map((file) => URL.createObjectURL(file));
    setFormData({ ...formData, photos: [...formData.photos, ...newPhotos] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 데이터를 Google Drive에 업로드 (API URL을 실제로 대체해야 함)
    const formDataToUpload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'photos') {
        value.forEach((photo, index) => formDataToUpload.append(`photo_${index}`, photo));
      } else {
        formDataToUpload.append(key, value);
      }
    });

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
        <label htmlFor="date" className="block text-sm font-medium mb-2">
          확인일시
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
        <label htmlFor="supervisor" className="block text-sm font-medium mb-2">
          현장책임자
        </label>
        <input
          type="text"
          id="supervisor"
          name="supervisor"
          className="w-full p-2 border rounded"
          value={formData.supervisor}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="taskName" className="block text-sm font-medium mb-2">
          작업명
        </label>
        <input
          type="text"
          id="taskName"
          name="taskName"
          className="w-full p-2 border rounded"
          value={formData.taskName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="taskLocation" className="block text-sm font-medium mb-2">
          작업장소
        </label>
        <input
          type="text"
          id="taskLocation"
          name="taskLocation"
          className="w-full p-2 border rounded"
          value={formData.taskLocation}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="personnel" className="block text-sm font-medium mb-2">
          작업 인원
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
        <label htmlFor="risks" className="block text-sm font-medium mb-2">
          6대 핵심 위험요인
        </label>
        <textarea
          id="risks"
          name="risks"
          className="w-full p-2 border rounded"
          value={formData.risks}
          onChange={handleChange}
          rows="3"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="startTime" className="block text-sm font-medium mb-2">
          작업 시작 시간
        </label>
        <input
          type="time"
          id="startTime"
          name="startTime"
          className="w-full p-2 border rounded"
          value={formData.startTime}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="endTime" className="block text-sm font-medium mb-2">
          작업 종료 시간
        </label>
        <input
          type="time"
          id="endTime"
          name="endTime"
          className="w-full p-2 border rounded"
          value={formData.endTime}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">현장확인 사진</label>
        <div className="flex gap-2">
          <label
            htmlFor="camera"
            className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
          >
            카메라로 촬영
          </label>
          <input
            type="file"
            id="camera"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handlePhotoUpload}
          />
          <label
            htmlFor="file"
            className="bg-green-500 text-white py-2 px-4 rounded cursor-pointer"
          >
            저장된 이미지 업로드
          </label>
          <input
            type="file"
            id="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {formData.photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Uploaded ${index + 1}`}
              className="w-full h-20 object-cover rounded"
            />
          ))}
        </div>
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
