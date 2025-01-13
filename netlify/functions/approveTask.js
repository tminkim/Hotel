const fetch = require('node-fetch');
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { issueNumber, approved, comment } = JSON.parse(event.body);

    // GitHub 이슈 상태 업데이트
    await octokit.issues.update({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      issue_number: issueNumber,
      state: 'closed',
      labels: [approved ? 'approved' : 'rejected'],
    });

    // 승인 또는 반려 코멘트 추가
    await octokit.issues.createComment({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      issue_number: issueNumber,
      body: `**상태**: ${approved ? '승인됨' : '반려됨'}\n**코멘트**: ${comment}`,
    });

    // Microsoft Teams 알림 전송
    const message = approved
      ? `작업 승인됨: \n이슈 번호: ${issueNumber}\n코멘트: ${comment}`
      : `작업 반려됨: \n이슈 번호: ${issueNumber}\n코멘트: ${comment}`;

    await fetch(process.env.TEAMS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });

    return { statusCode: 200, body: JSON.stringify({ message: '승인/반려 처리 완료' }) };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
