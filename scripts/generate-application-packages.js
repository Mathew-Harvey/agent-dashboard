#!/usr/bin/env node

/**
 * Generate Application Packages
 * Creates cover letters, tailored CVs, and selection criteria for standout jobs
 */

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const MEMORY_DIR = path.join(process.env.HOME, '.openclaw/workspace/memory/skye-job-search');
const TEMPLATES_PATH = path.join(MEMORY_DIR, 'application-templates.md');
const PROFILE_PATH = path.join(MEMORY_DIR, 'skye-profile.md');
const PACKAGES_DIR = path.join(MEMORY_DIR, 'application-packages');

// Load templates and profile
const profile = fs.readFileSync(PROFILE_PATH, 'utf8');

function selectCV(job) {
  const title = job.title.toLowerCase();
  const description = job.description.toLowerCase();
  
  const eventKeywords = ['event', 'community', 'fundraising', 'sports', 'experience manager'];
  const isEvent = eventKeywords.some(kw => title.includes(kw) || description.includes(kw));
  
  if (isEvent) {
    return {
      type: 'event',
      path: path.join(MEMORY_DIR, 'reference-docs/cv-senior-event-manager.pdf')
    };
  } else {
    return {
      type: 'digital-pm',
      path: path.join(MEMORY_DIR, 'reference-docs/cv-digital-pm-wapha.pdf')
    };
  }
}

function extractRequirements(text) {
  const lower = text.toLowerCase();
  const requirements = [];
  
  // Technical skills
  if (lower.includes('agile') || lower.includes('scrum') || lower.includes('kanban')) {
    requirements.push({ type: 'skill', value: 'agile methodologies' });
  }
  if (lower.includes('stakeholder')) {
    requirements.push({ type: 'skill', value: 'stakeholder management' });
  }
  if (lower.includes('budget')) {
    requirements.push({ type: 'skill', value: 'budget management' });
  }
  if (lower.includes('risk')) {
    requirements.push({ type: 'skill', value: 'risk management' });
  }
  if (lower.includes('change management')) {
    requirements.push({ type: 'skill', value: 'change management' });
  }
  if (lower.includes('transformation')) {
    requirements.push({ type: 'skill', value: 'digital transformation' });
  }
  if (lower.includes('product owner') || lower.includes('product management')) {
    requirements.push({ type: 'skill', value: 'product ownership' });
  }
  
  // Experience levels
  const yearMatch = text.match(/(\d+)\+?\s*years?/i);
  if (yearMatch) {
    requirements.push({ type: 'experience', value: `${yearMatch[1]}+ years` });
  }
  
  // Industry
  if (lower.includes('healthcare') || lower.includes('health')) {
    requirements.push({ type: 'industry', value: 'healthcare' });
  }
  if (lower.includes('government') || lower.includes('public sector')) {
    requirements.push({ type: 'industry', value: 'government' });
  }
  if (lower.includes('nfp') || lower.includes('not-for-profit') || lower.includes('nonprofit')) {
    requirements.push({ type: 'industry', value: 'NFP' });
  }
  
  // Work arrangement
  if (lower.includes('remote') || lower.includes('work from home') || lower.includes('wfh')) {
    requirements.push({ type: 'arrangement', value: 'remote' });
  }
  if (lower.includes('hybrid')) {
    requirements.push({ type: 'arrangement', value: 'hybrid' });
  }
  
  return requirements;
}

function generateCoverLetter(job) {
  const cv = selectCV(job);
  const today = new Date().toISOString().split('T')[0];
  const companyName = job.company || 'Hiring Team';
  
  // Extract requirements from job description
  const requirements = extractRequirements(job.description + ' ' + job.title);
  const skills = requirements.filter(r => r.type === 'skill').map(r => r.value);
  const isRemote = requirements.some(r => r.type === 'arrangement' && r.value === 'remote');
  const industry = requirements.find(r => r.type === 'industry')?.value;
  
  // Generate cover letter text
  let letter = `Skye Harvey
20 Eldora Crescent
Falcon, WA 6210
skye.a.harvey@gmail.com
0419 646 398

${today}

Dear ${companyName} Hiring Team,

I'm writing to express my interest in the ${job.title} role. With over 8 years of experience delivering digital projects and events across government, healthcare, and community sectors, I'm excited by the opportunity to contribute to your team.

`;

  // Relevant experience paragraph
  if (cv.type === 'digital-pm') {
    letter += `In my current role as Digital Project Manager at EUSO Digital, I lead end-to-end delivery of digital transformation projects for multiple concurrent clients. I manage cross-functional teams, translate business requirements into actionable roadmaps, and ensure projects are delivered on time and within budget. `;
    
    // Add industry-specific experience if relevant
    if (industry) {
      if (industry === 'healthcare') {
        letter += `My portfolio includes healthcare sector projects where I've navigated regulatory requirements and stakeholder engagement across clinical and administrative teams. `;
      } else if (industry === 'government') {
        letter += `I have extensive experience delivering government projects, managing compliance requirements and engaging diverse stakeholder groups. `;
      }
    }
    
    letter += `My experience spans agile delivery, stakeholder management, and change implementation across healthcare, government, and commercial sectors.\n\n`;
  } else {
    letter += `With 7 years of national event management experience, including my role as National Events Manager for a leading aged care provider, I've delivered complex multi-state conferences and successfully transitioned programs from in-person to hybrid and fully digital formats. I combine strategic planning with hands-on logistics management, ensuring seamless execution from concept through to post-event evaluation.\n\n`;
  }

  // Unique value paragraph with specific skills
  letter += `What makes me particularly suited to this role is my ability to bridge technical and non-technical stakeholders, ensuring clear communication and alignment throughout project lifecycles. `;
  
  // Location-specific hook
  if (job.location.toLowerCase().includes('perth') || job.location.toLowerCase().includes(' wa')) {
    letter += `As a Perth-based professional with deep roots in WA's business community, I bring both local knowledge and extensive networks across government and commercial sectors. `;
  }
  
  if (isRemote || job.location.toLowerCase().includes('remote')) {
    letter += `I'm well-equipped for remote work, having successfully managed distributed teams and client relationships across Australia. `;
  }
  
  // Skills alignment
  if (skills.length > 0) {
    const skillList = skills.slice(0, 3).join(', ').replace(/, ([^,]*)$/, ', and $1');
    letter += `Your requirements for ${skillList} align directly with my proven track record delivering successful outcomes in similar roles.\n\n`;
  } else {
    letter += `I'm confident my experience managing complex projects and building strong stakeholder relationships will enable me to make an immediate impact.\n\n`;
  }

  // Closing
  letter += `Thank you for considering my application. I've attached my CV and would be glad to provide more details or connect for a conversation.

Warm regards,
Skye Harvey`;

  return letter;
}

function createPDF(content, outputPath, title) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 72, bottom: 72, left: 72, right: 72 }
    });

    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Add content
    doc.fontSize(12);
    doc.font('Helvetica');

    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (line.trim() === '') {
        doc.moveDown(0.5);
      } else if (line.startsWith('Skye Harvey') && index === 0) {
        doc.font('Helvetica-Bold').fontSize(14).text(line);
        doc.font('Helvetica').fontSize(12);
      } else if (line.startsWith('Dear ')) {
        doc.moveDown(1);
        doc.text(line);
      } else if (line.startsWith('Warm regards,') || line.startsWith('Sincerely,')) {
        doc.moveDown(1);
        doc.text(line);
      } else {
        doc.text(line, { align: 'left', lineGap: 2 });
      }
    });

    doc.end();

    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}

function sanitizeFilename(str) {
  return str.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').substring(0, 50);
}

async function generatePackage(job) {
  const today = new Date().toISOString().split('T')[0];
  const jobDir = path.join(PACKAGES_DIR, today);
  
  // Create directory
  if (!fs.existsSync(jobDir)) {
    fs.mkdirSync(jobDir, { recursive: true });
  }

  const companySlug = sanitizeFilename(job.company);
  const roleSlug = sanitizeFilename(job.title);
  
  console.log(`[PACKAGE] Generating for: ${job.title} at ${job.company}`);

  // 1. Generate cover letter
  const coverLetterText = generateCoverLetter(job);
  const coverLetterPath = path.join(jobDir, `${companySlug}-${roleSlug}-CoverLetter.pdf`);
  await createPDF(coverLetterText, coverLetterPath, 'Cover Letter');
  console.log(`  ✓ Cover letter: ${path.basename(coverLetterPath)}`);

  // 2. Copy appropriate CV
  const cv = selectCV(job);
  const cvDestPath = path.join(jobDir, `${companySlug}-${roleSlug}-CV.pdf`);
  
  if (fs.existsSync(cv.path)) {
    fs.copyFileSync(cv.path, cvDestPath);
    console.log(`  ✓ CV: ${path.basename(cvDestPath)} (${cv.type})`);
  } else {
    console.log(`  ⚠ CV source not found: ${cv.path}`);
  }

  return {
    coverLetter: coverLetterPath,
    cv: cvDestPath,
    selectionCriteria: null // TODO: Implement if job has criteria
  };
}

async function main() {
  if (process.argv.length < 3) {
    console.error('Usage: node generate-application-packages.js <daily-results-file.json>');
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
      packages.push({
        job,
        files: pkg
      });
    } catch (err) {
      console.error(`[PACKAGE] Error generating for ${job.title}:`, err.message);
    }
    console.log('');
  }

  console.log(`[PACKAGE GENERATOR] Complete. Generated ${packages.length} packages.`);
  
  // Save manifest
  const today = new Date().toISOString().split('T')[0];
  const manifestPath = path.join(PACKAGES_DIR, today, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify({ packages, generated_at: new Date().toISOString() }, null, 2));
  console.log(`[PACKAGE GENERATOR] Manifest saved: ${manifestPath}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
