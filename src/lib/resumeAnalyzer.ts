// Resume Analyzer — TF-IDF based matching engine

export interface AnalysisResult {
  mode: 'resume' | 'match';
  matchScore: number;
  tfidfScore: number;
  skillScore: number;
  matchedKeywords: string[];
  missingSkills: string[];
  suggestions: string[];
  keywordFrequencies: Record<string, { resume: number; job: number }>;
  detectedSections: string[];
  keywordStrength: number;
  actionVerbCount: number;
}

const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by',
  'from','is','are','was','were','be','been','being','have','has','had','do',
  'does','did','will','would','could','should','may','might','shall','can',
  'this','that','these','those','i','you','he','she','it','we','they','me',
  'him','her','us','them','my','your','his','its','our','their','what','which',
  'who','whom','when','where','why','how','all','each','every','both','few',
  'more','most','other','some','such','no','not','only','own','same','so',
  'than','too','very','just','about','above','after','again','also','as',
  'because','before','between','during','into','through','under','until',
  'while','etc','using','used','use','work','working','experience','years',
  'well','new','able','including','ensure','within','across','strong',
]);

const SKILL_PATTERNS: Record<string, string[]> = {
  'JavaScript': ['javascript', 'js', 'es6', 'es2015'],
  'TypeScript': ['typescript', 'ts'],
  'React': ['react', 'reactjs', 'react.js'],
  'Angular': ['angular', 'angularjs'],
  'Vue.js': ['vue', 'vuejs', 'vue.js'],
  'Node.js': ['node', 'nodejs', 'node.js'],
  'Python': ['python', 'py'],
  'Java': ['java'],
  'C++': ['c++', 'cpp'],
  'C#': ['c#', 'csharp'],
  'Go': ['golang', 'go'],
  'Rust': ['rust'],
  'Ruby': ['ruby'],
  'PHP': ['php'],
  'Swift': ['swift'],
  'Kotlin': ['kotlin'],
  'SQL': ['sql', 'mysql', 'postgresql', 'postgres'],
  'MongoDB': ['mongodb', 'mongo'],
  'AWS': ['aws', 'amazon web services', 'ec2', 's3', 'lambda'],
  'Azure': ['azure', 'microsoft azure'],
  'GCP': ['gcp', 'google cloud'],
  'Docker': ['docker', 'containerization'],
  'Kubernetes': ['kubernetes', 'k8s'],
  'CI/CD': ['ci/cd', 'cicd', 'jenkins', 'github actions', 'gitlab ci'],
  'Git': ['git', 'github', 'gitlab', 'bitbucket'],
  'REST API': ['rest', 'restful', 'api'],
  'GraphQL': ['graphql'],
  'Machine Learning': ['machine learning', 'ml', 'deep learning', 'neural network'],
  'Data Science': ['data science', 'data analysis', 'analytics'],
  'DevOps': ['devops'],
  'Agile': ['agile', 'scrum', 'kanban'],
  'TDD': ['tdd', 'test driven', 'unit testing'],
  'HTML/CSS': ['html', 'css', 'sass', 'scss', 'tailwind'],
  'Figma': ['figma'],
  'Redux': ['redux'],
  'Next.js': ['next', 'nextjs', 'next.js'],
  'Django': ['django'],
  'Flask': ['flask'],
  'Spring': ['spring', 'spring boot'],
  'Express': ['express', 'expressjs'],
  'Terraform': ['terraform', 'iac', 'infrastructure as code'],
  'Linux': ['linux', 'unix', 'bash', 'shell'],
  'Microservices': ['microservices', 'micro-services'],
  'Communication': ['communication', 'presentation', 'public speaking'],
  'Leadership': ['leadership', 'team lead', 'management'],
  'Problem Solving': ['problem solving', 'analytical', 'critical thinking'],
};

const SECTION_PATTERNS: Record<string, RegExp> = {
  'Skills': /\b(skills|technical skills|core competencies|technologies)\b/i,
  'Experience': /\b(experience|work experience|employment|professional experience)\b/i,
  'Education': /\b(education|academic|university|degree|bachelor|master|phd)\b/i,
  'Projects': /\b(projects|personal projects|portfolio)\b/i,
  'Summary': /\b(summary|objective|profile|about me)\b/i,
  'Certifications': /\b(certifications?|certified|licenses?)\b/i,
  'Awards': /\b(awards?|honors?|achievements?)\b/i,
  'Languages': /\b(languages)\b/i,
  'Contact': /\b(contact|email|phone|address|linkedin|github)\b/i,
};

const ACTION_VERBS = [
  'achieved','built','created','delivered','designed','developed','drove',
  'engineered','established','generated','implemented','improved','increased',
  'launched','led','managed','optimized','orchestrated','reduced','resolved',
  'scaled','spearheaded','streamlined','transformed','architected','automated',
  'collaborated','coordinated','deployed','executed','facilitated','initiated',
  'integrated','maintained','mentored','migrated','monitored','negotiated',
  'organized','oversaw','pioneered','planned','produced','refactored',
  'researched','restructured','revamped','supervised','tested','trained',
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOP_WORDS.has(w));
}

function computeTF(tokens: string[]): Record<string, number> {
  const freq: Record<string, number> = {};
  tokens.forEach(t => { freq[t] = (freq[t] || 0) + 1; });
  const max = Math.max(...Object.values(freq), 1);
  const tf: Record<string, number> = {};
  for (const [word, count] of Object.entries(freq)) {
    tf[word] = count / max;
  }
  return tf;
}

export function extractSkills(text: string): Set<string> {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const [skill, patterns] of Object.entries(SKILL_PATTERNS)) {
    for (const p of patterns) {
      if (lower.includes(p)) { found.add(skill); break; }
    }
  }
  return found;
}

export function analyzeResumeOnly(resumeText: string): AnalysisResult {
  const resumeTokens = tokenize(resumeText);
  const resumeSkills = extractSkills(resumeText);
  const lower = resumeText.toLowerCase();

  // Detect sections
  const detectedSections: string[] = [];
  for (const [section, pattern] of Object.entries(SECTION_PATTERNS)) {
    if (pattern.test(resumeText)) detectedSections.push(section);
  }

  // Action verb count
  const actionVerbCount = ACTION_VERBS.filter(v => lower.includes(v)).length;

  // Keyword strength: ratio of non-stopword meaningful tokens
  const uniqueTokens = new Set(resumeTokens);
  const keywordStrength = Math.min(Math.round((uniqueTokens.size / Math.max(resumeTokens.length, 1)) * 100), 100);

  // Resume quality score components
  const sectionScore = Math.min(detectedSections.length / 6, 1); // 6 key sections
  const skillsScore = Math.min(resumeSkills.size / 8, 1); // at least 8 skills
  const verbScore = Math.min(actionVerbCount / 10, 1); // at least 10 action verbs
  const lengthScore = Math.min(resumeText.length / 2000, 1); // decent length

  const qualityScore = Math.round(
    (sectionScore * 0.3 + skillsScore * 0.3 + verbScore * 0.2 + lengthScore * 0.2) * 100
  );

  // Suggestions
  const suggestions: string[] = [];
  if (!detectedSections.includes('Summary')) suggestions.push('Add a professional summary or objective section at the top of your resume.');
  if (!detectedSections.includes('Skills')) suggestions.push('Add a dedicated Skills section listing your technical and soft skills.');
  if (!detectedSections.includes('Projects')) suggestions.push('Add a Projects section to showcase your practical work and portfolio.');
  if (!detectedSections.includes('Education')) suggestions.push('Include an Education section with your degrees and certifications.');
  if (!detectedSections.includes('Experience')) suggestions.push('Add a Work Experience section detailing your professional history.');
  if (actionVerbCount < 5) suggestions.push('Use more action verbs like "built", "designed", "implemented", "optimized" to describe your achievements.');
  if (resumeText.length < 800) suggestions.push('Your resume seems short. Add more detail about your experience, projects, and accomplishments.');
  if (!/\d+%|\d+\s*(users|clients|projects|revenue|growth)/i.test(resumeText)) suggestions.push('Add measurable achievements with numbers, percentages, and metrics (e.g., "increased performance by 40%").');
  if (resumeSkills.size < 5) suggestions.push('Strengthen your skills section — list more relevant technical skills and tools.');
  if (!detectedSections.includes('Certifications')) suggestions.push('Consider adding relevant certifications to boost your ATS score.');

  return {
    mode: 'resume',
    matchScore: Math.min(qualityScore, 100),
    tfidfScore: 0,
    skillScore: Math.round((skillsScore) * 100),
    matchedKeywords: [...resumeSkills],
    missingSkills: [],
    suggestions,
    keywordFrequencies: {},
    detectedSections,
    keywordStrength,
    actionVerbCount,
  };
}

export function analyzeResume(resumeText: string, jobDescription: string): AnalysisResult {
  if (!jobDescription.trim()) return analyzeResumeOnly(resumeText);

  const resumeTokens = tokenize(resumeText);
  const jobTokens = tokenize(jobDescription);

  const resumeTF = computeTF(resumeTokens);
  const jobTF = computeTF(jobTokens);

  // Skills extraction
  const resumeSkills = extractSkills(resumeText);
  const jobSkills = extractSkills(jobDescription);

  const matchedKeywords = [...jobSkills].filter(s => resumeSkills.has(s));
  const missingSkills = [...jobSkills].filter(s => !resumeSkills.has(s));

  // TF-IDF cosine similarity on shared vocabulary
  const allWords = new Set([...Object.keys(resumeTF), ...Object.keys(jobTF)]);
  let dotProduct = 0, magA = 0, magB = 0;
  allWords.forEach(w => {
    const a = resumeTF[w] || 0;
    const b = jobTF[w] || 0;
    dotProduct += a * b;
    magA += a * a;
    magB += b * b;
  });
  const cosineSim = (magA && magB) ? dotProduct / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;

  // Skill match ratio
  const skillScore = jobSkills.size > 0 ? matchedKeywords.length / jobSkills.size : 0;

  // Combined score: 40% cosine similarity + 60% skill match
  const matchScore = Math.round((cosineSim * 0.4 + skillScore * 0.6) * 100);

  // Build keyword frequencies
  const keywordFrequencies: Record<string, { resume: number; job: number }> = {};
  const topJobWords = Object.entries(jobTF).sort((a, b) => b[1] - a[1]).slice(0, 20);
  topJobWords.forEach(([word]) => {
    keywordFrequencies[word] = {
      resume: resumeTokens.filter(t => t === word).length,
      job: jobTokens.filter(t => t === word).length,
    };
  });

  // Suggestions
  const suggestions: string[] = [];
  if (matchScore < 95) {
    if (missingSkills.length > 0) {
      suggestions.push(`Add these missing skills to your resume: ${missingSkills.join(', ')}`);
    }
    if (matchScore < 50) {
      suggestions.push('Your resume needs significant rework to match this job. Consider tailoring your experience section to highlight relevant projects.');
    }
    if (matchScore < 70) {
      suggestions.push('Use more keywords from the job description naturally throughout your resume.');
    }
    if (matchScore < 80) {
      suggestions.push('Quantify your achievements — use numbers, percentages, and metrics.');
    }
    if (matchScore < 90) {
      suggestions.push('Consider adding a skills summary section at the top that mirrors the job requirements.');
    }
    suggestions.push('Tailor your professional summary to directly address the role requirements.');
    if (resumeText.length < 500) {
      suggestions.push('Your resume seems short. Add more detail about your experience and projects.');
    }
  }

  // Detect sections
  const detectedSections: string[] = [];
  for (const [section, pattern] of Object.entries(SECTION_PATTERNS)) {
    if (pattern.test(resumeText)) detectedSections.push(section);
  }
  const actionVerbCount = ACTION_VERBS.filter(v => resumeText.toLowerCase().includes(v)).length;
  const uniqueTokens = new Set(resumeTokens);
  const keywordStrength = Math.min(Math.round((uniqueTokens.size / Math.max(resumeTokens.length, 1)) * 100), 100);

  return {
    mode: 'match',
    matchScore: Math.min(matchScore, 100),
    tfidfScore: Math.round(cosineSim * 100),
    skillScore: Math.round(skillScore * 100),
    matchedKeywords,
    missingSkills,
    suggestions,
    keywordFrequencies,
    detectedSections,
    keywordStrength,
    actionVerbCount,
  };
}