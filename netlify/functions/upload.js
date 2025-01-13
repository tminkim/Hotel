// netlify/functions/upload.js

const fetch = require('node-fetch');
const FormData = require('form-data');

// 함수가 실행될 때마다 자동 호출되는 메인 함수
exports.handler = async (event) => {
  try {
    // 1) 요청이 POST 인지 확인
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: '허용되지 않은 메서드입니다.' }),
      };
    }

    // 2) FormData 파싱
    // Netlify Functions에서 multipart/form-data를 파싱하려면 별도 라이브러리가 필요할 수 있다.
    // 하지만 간단히 'raw' 바이트를 직접 받아 처리하는 방법을 예시로 씀.
    // netlify-lambda, multiparty 등을 쓰는 방법도 존재.
    // 여기서는 간단히 multiparty 예시 사용:

    const multipart = require('parse-multipart');
    const boundary = multipart.getBoundary(event.headers['content-type']);
    const bodyBuffer = Buffer.from(event.body, 'base64');
    const parts = multipart.Parse(bodyBuffer, boundary);

    // parts는 [{ filename, type, data }, { name, data }, ... ] 형식
    // 여기서 필드명에 따라 title, description, image 등을 찾는다.
    let title = '';
    let description = '';
    let imageFile = null;

    for (let part of parts) {
      if (part.filename) {
        // 파일
        imageFile = part;
      } else {
        // 텍스트 필드
        if (part.name === 'title') {
          title = part.data.toString();
        } else if (part.name === 'description') {
          description = part.data.toString();
        }
      }
    }

    // 3) 이미지 파일을 Cloudinary에 업로드(옵션)
    let imageUrl = '';
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile.data, {
        filename: imageFile.filename,
        contentType: imageFile.type,
      });
      formData.append('upload_preset', 'YOUR_UPLOAD_PRESET'); // Cloudinary 설정
      formData.append('api_key', 'YOUR_CLOUDINARY_API_KEY');
      // etc... (Cloudinary에 따라 필요한 정보 추가)

      const cloudinaryRes = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
        method: 'POST',
        body: formData
      });
      const cloudinaryData = await cloudinaryRes.json();
      imageUrl = cloudinaryData.secure_url;  // 업로드된 이미지의 URL
    }

    // 4) Teams Webhook으로 메시지 전송
    // 미리 생성해둔 webhook URL
    const webhookUrl = 'YOUR_TEAMS_WEBHOOK_URL';

    // 카드 형태 (Adaptive Cards) 대신 간단한 텍스트로 보낼 수도 있음.
    // 여기서는 markdown 형식으로 보내는 예시
    const teamsPayload = {
      text: `**${title}**\n${description}\n\n${imageUrl ? `![이미지](${imageUrl})` : ''}`,
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamsPayload),
    });

    // 5) 응답
    return {
      statusCode: 200,
      body: JSON.stringify({ message: '성공적으로 업로드하고 Teams로 전송했습니다.' }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: '서버 에러 발생', error: err.toString() }),
    };
  }
};
