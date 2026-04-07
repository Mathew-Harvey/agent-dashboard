#!/usr/bin/env node

/**
 * Generate Application Packages (Google Docs format)
 * Creates cover letters and CVs as .docx files
 */

const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');

const MEMORY_DIR = path.join(process.env.HOME, '.openclaw/workspace/memory/skye-job-search');
const PACKAGES_DIR = path.join(MEMORY_DIR, 'application-packages');

function selectCV(job) {
  const title = job.title.toLowerCase();
  const description = job.description.toLowerCase();
  
  const eventKeywords = ['event', 'community', 'fundraising', 'sports', 'experience manager'];
  const isEvent = eventKeywords.some(kw => title.includes(kw) || description.includes(kw));
  
  return isEvent ? 'event' : 'digital-pm';
}

function extractRequirements(text) {
  const lower = text.toLowerCase();
  const requirements = [];
  
  if (lower.includes('agile') || lower.includes('scrum')) requirements.push({ type: 'skill', value: 'agile methodologies' });
  if (lower.includes('stakeholder')) requirements.push({ type: 'skill', value: 'stakeholder management' });
  if (lower.includes('budget')) requirements.push({ type: 'skill', value: 'budget management' });
  if (lower.includes('risk')) requirements.push({ type: 'skill', value: 'risk management' });
  if (lower.includes('change management')) requirements.push({ type: 'skill', value: 'change management' });
  if (lower.includes('transformation')) requirements.push({ type: 'skill', value: 'digital transformation' });
  if (lower.includes('product owner') || lower.includes('product management')) requirements.push({ type: 'skill', value: 'product ownership' });
  
  if (lower.includes('healthcare') || lower.includes('health')) requirements.push({ type: 'industry', value: 'healthcare' });
  if (lower.includes('government') || lower.includes('public sector')) requirements.push({ type: 'industry', value: 'government' });
  
  if (lower.includes('remote') || lower.includes('work from home')) requirements.push({ type: 'arrangement', value: 'remote' });
  
  return requirements;
}

function generateCoverLetterText(job) {
  const cvType = selectCV(job);
  const today = new Date().toISOString().split('T')[0];
  const companyName = job.company || 'Hiring Team';
  
  const requirements = extractRequirements(job.description + ' ' + job.title);
  const skills = requirements.filter(r => r.type === 'skill').map(r => r.value);
  const isRemote = requirements.some(r => r.type === 'arrangement');
  const industry = requirements.find(r => r.type === 'industry')?.value;
  
  let paragraphs = [];
  
  // Header
  paragraphs.push(`Skye Harvey`);
  paragraphs.push(`20 Eldora Crescent`);
  paragraphs.push(`Falcon, WA 6210`);
  paragraphs.push(`skye.a.harvey@gmail.com`);
  paragraphs.push(`0419 646 398`);
  paragraphs.push(``);
  paragraphs.push(today);
  paragraphs.push(``);
  paragraphs.push(`Dear ${companyName} Hiring Team,`);
  paragraphs.push(``);
  
  // Opening
  paragraphs.push(`I'm writing to express my interest in the ${job.title} role. With over 8 years of experience delivering digital projects and events across government, healthcare, and community sectors, I'm excited by the opportunity to contribute to your team.`);
  paragraphs.push(``);
  
  // Experience paragraph
  if (cvType === 'digital-pm') {
    let expPara = `In my current role as Senior Project Manager at Equilibrium Interactive (EQ), I lead strategic digital delivery across diverse client portfolios. Previously, as Digital Project Manager at EUSO Digital, I managed end-to-end delivery of digital transformation projects for multiple concurrent clients, building cross-functional teams and translating business requirements into actionable roadmaps. `;
    
    if (industry === 'healthcare') {
      expPara += `My portfolio includes healthcare sector projects where I've navigated regulatory requirements and stakeholder engagement across clinical and administrative teams. `;
    } else if (industry === 'government') {
      expPara += `I have extensive experience delivering government projects, managing compliance requirements and engaging diverse stakeholder groups. `;
    }
    
    expPara += `My experience spans agile delivery, stakeholder management, and change implementation across healthcare, government, and commercial sectors.`;
    paragraphs.push(expPara);
  } else {
    paragraphs.push(`With 7 years of national event management experience, including my role as National Events Manager for a leading aged care provider, I've delivered complex multi-state conferences and successfully transitioned programs from in-person to hybrid and fully digital formats. I combine strategic planning with hands-on logistics management, ensuring seamless execution from concept through to post-event evaluation.`);
  }
  paragraphs.push(``);
  
  // Value proposition
  let valuePara = `What makes me particularly suited to this role is my ability to bridge technical and non-technical stakeholders, ensuring clear communication and alignment throughout project lifecycles. `;
  
  if (job.location.toLowerCase().includes('perth') || job.location.toLowerCase().includes(' wa')) {
    valuePara += `As a Perth-based professional with deep roots in WA's business community, I bring both local knowledge and extensive networks across government and commercial sectors. `;
  }
  
  if (isRemote || job.location.toLowerCase().includes('remote')) {
    valuePara += `I'm well-equipped for remote work, having successfully managed distributed teams and client relationships across Australia. `;
  }
  
  if (skills.length > 0) {
    const skillList = skills.slice(0, 3).join(', ').replace(/, ([^,]*)$/, ', and $1');
    valuePara += `Your requirements for ${skillList} align directly with my proven track record delivering successful outcomes in similar roles.`;
  } else {
    valuePara += `I'm confident my experience managing complex projects and building strong stakeholder relationships will enable me to make an immediate impact.`;
  }
  
  paragraphs.push(valuePara);
  paragraphs.push(``);
  
  // Closing
  paragraphs.push(`Thank you for considering my application. I've attached my CV and would be glad to provide more details or connect for a conversation.`);
  paragraphs.push(``);
  paragraphs.push(`Warm regards,`);
  paragraphs.push(`Skye Harvey`);
  
  return paragraphs;
}

async function createCoverLetterDocx(job, outputPath) {
  const paragraphs = generateCoverLetterText(job);
  
  const docParagraphs = paragraphs.map(text => {
    if (text === '') {
      return new Paragraph({ text: '' });
    } else if (text === 'Skye Harvey') {
      return new Paragraph({
        children: [new TextRun({ text, bold: true, size: 28 })],
        spacing: { after: 100 }
      });
    } else if (text.startsWith('Dear ')) {
      return new Paragraph({
        children: [new TextRun({ text })],
        spacing: { before: 200 }
      });
    } else if (text.startsWith('Warm regards,') || text.startsWith('Sincerely,')) {
      return new Paragraph({
        children: [new TextRun({ text })],
        spacing: { before: 200 }
      });
    } else {
      return new Paragraph({
        children: [new TextRun({ text })],
        spacing: { after: 150 }
      });
    }
  });
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: docParagraphs
    }]
  });
  
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

async function createCVDocx(job, outputPath, cvType) {
  // For CV, we'll create a simple title page that says to use the PDF CV
  // In a real implementation, you'd parse the PDF and convert it
  // For now, let's create a placeholder
  
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [new TextRun({ text: 'Skye Harvey', bold: true, size: 32 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Digital Project Manager & Product Owner', size: 24 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Please note: Full CV available in PDF format.', italics: true })],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: `This application is for: ${job.title} at ${job.company}` })],
          spacing: { after: 400 }
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Contact:', bold: true })],
          spacing: { after: 100 }
        }),
        new Paragraph({ text: 'Email: skye.a.harvey@gmail.com' }),
        new Paragraph({ text: 'Phone: 0419 646 398' }),
        new Paragraph({ text: 'Location: Falcon, WA 6210' }),
      ]
    }]
  });
  
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

function sanitizeFilename(str) {
  return str.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').substring(0, 50);
}

async function generatePackage(job) {
  const today = new Date().toISOString().split('T')[0];
  const jobDir = path.join(PACKAGES_DIR, today);
  
  if (!fs.existsSync(jobDir)) {
    fs.mkdirSync(jobDir, { recursive: true });
  }

  const companySlug = sanitizeFilename(job.company);
  const roleSlug = sanitizeFilename(job.title);
  
  console.log(`[PACKAGE] Generating for: ${job.title} at ${job.company}`);

  // Generate cover letter
  const coverLetterPath = path.join(jobDir, `${companySlug}-${roleSlug}-CoverLetter.docx`);
  await createCoverLetterDocx(job, coverLetterPath);
  console.log(`  ✓ Cover letter: ${path.basename(coverLetterPath)}`);

  // Generate CV placeholder
  const cvType = selectCV(job);
  const cvPath = path.join(jobDir, `${companySlug}-${roleSlug}-CV.docx`);
  await createCVDocx(job, cvPath, cvType);
  console.log(`  ✓ CV: ${path.basename(cvPath)} (${cvType})`);

  return {
    coverLetter: coverLetterPath,
    cv: cvPath
  };
}

async function main() {
  if (process.argv.length < 3) {
    console.error('Usage: node generate-application-packages-docx.js <daily-results-file.json>');
    process.exit(1);
  }

  const resultsFile = process.argv[2];
  
  if (!fs.existsSync(resultsFile)) {
    console.error(`Results file not found: ${resultsFile}`);
    process.exit(1);
  }

  const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
  const standouts = results.jobs.filter(j => j.score >= 5).slice(0, 5);

  console.log(`[PACKAGE GENERATOR] Found ${standouts.length} standout jobs`);
  console.log('');

  const packages = [];

  for (const job of standouts) {
    try {
      const pkg = await generatePackage(job);
      packages.push({ job, files: pkg });
    } catch (err) {
      console.error(`[PACKAGE] Error generating for ${job.title}:`, err.message);
    }
    console.log('');
  }

  console.log(`[PACKAGE GENERATOR] Complete. Generated ${packages.length} packages.`);
  
  const today = new Date().toISOString().split('T')[0];
  const manifestPath = path.join(PACKAGES_DIR, today, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify({ packages, generated_at: new Date().toISOString() }, null, 2));
  console.log(`[PACKAGE GENERATOR] Manifest saved: ${manifestPath}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
