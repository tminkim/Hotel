const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const formData = JSON.parse(event.body);

    await fetch(process.env.TEAMS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `새 작업 제출됨: ${formData.taskName}\n작업장소: ${formData.location}\n작업 인원: ${formData.personnel}`,
      }),
    });

    return { statusCode: 200, body: '작업 제출 성공' };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
