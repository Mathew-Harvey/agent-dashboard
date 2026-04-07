#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const AGENTMAIL_API_KEY = 'am_0c4fe254a60572f60c1535b9b6ffd1861616a29401f103cb9b5089d41740dcab';
const INBOX_ID = 'jeff-assistant@agentmail.to';

async function sendEmailWithAttachments() {
  const packagesDir = '/home/mat/.openclaw/workspace/memory/skye-job-search/application-packages/2026-04-07';
  const manifestPath = path.join(packagesDir, 'manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.error('Manifest not found. Run package generator first.');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const firstPackage = manifest.packages[0];
  
  if (!firstPackage) {
    console.error('No packages found.');
    process.exit(1);
  }

  console.log('[EMAIL] Preparing email with attachments...');
  console.log(`[EMAIL] Package: ${firstPackage.job.title} at ${firstPackage.job.company}`);

  // Read PDFs and encode as base64
  const coverLetterPath = firstPackage.files.coverLetter;
  const cvPath = firstPackage.files.cv;

  const coverLetterData = fs.readFileSync(coverLetterPath);
  const cvData = fs.readFileSync(cvPath);

  const coverLetterBase64 = coverLetterData.toString('base64');
  const cvBase64 = cvData.toString('base64');

  const emailBody = `Good morning!

This is a test email with real application package attachments.

**Job:** ${firstPackage.job.title}
**Company:** ${firstPackage.job.company}
**Location:** ${firstPackage.job.location}
**Score:** ${firstPackage.job.score}/10

**Attached:**
- Cover Letter (PDF)
- CV (PDF)

Both documents are personalized for this role with:
✓ Perth-specific hooks
✓ Industry alignment
✓ Skills matching from job description
✓ Professional formatting

— Jeff 🐧`;

  const payload = {
    to: ['mathewharvey@gmail.com', 'skye.a.harvey@gmail.com'],
    subject: `Application Package: ${firstPackage.job.title} at ${firstPackage.job.company}`,
    text: emailBody,
    attachments: [
      {
        filename: path.basename(coverLetterPath),
        content: coverLetterBase64,
        encoding: 'base64',
        contentType: 'application/pdf'
      },
      {
        filename: path.basename(cvPath),
        content: cvBase64,
        encoding: 'base64',
        contentType: 'application/pdf'
      }
    ]
  };

  console.log('[EMAIL] Sending with attachments...');
  console.log(`  - ${path.basename(coverLetterPath)} (${(coverLetterData.length / 1024).toFixed(1)}KB)`);
  console.log(`  - ${path.basename(cvPath)} (${(cvData.length / 1024).toFixed(1)}KB)`);

  const response = await fetch(`https://api.agentmail.to/inboxes/${INBOX_ID}/messages/send`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AGENTMAIL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('[EMAIL] Error:', response.status, error);
    process.exit(1);
  }

  const result = await response.json();
  console.log('[EMAIL] ✅ Sent successfully!');
  console.log('[EMAIL] Message ID:', result.message_id);
}

sendEmailWithAttachments().catch(err => {
  console.error('[EMAIL] Fatal error:', err);
  process.exit(1);
});
