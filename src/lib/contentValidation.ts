export interface ContentIssue {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export function validateContentQuality(content: string): ContentIssue[] {
  const issues: ContentIssue[] = [];
  
  // Check for AI apology patterns
  if (content.includes('I apologize') || content.includes('As an AI')) {
    issues.push({
      type: 'ai_apology',
      message: 'Content contains AI apology patterns',
      severity: 'high'
    });
  }
  
  // Check for excessive repetition
  const sentences = content.split(/[.!?]+/);
  const repeatedPhrases: { [key: string]: number } = {};
  sentences.forEach(sentence => {
    const trimmed = sentence.trim().toLowerCase();
    if (trimmed.length > 10) {
      repeatedPhrases[trimmed] = (repeatedPhrases[trimmed] || 0) + 1;
    }
  });
  
  const repetitions = Object.entries(repeatedPhrases).filter(([_, count]) => count > 2);
  if (repetitions.length > 3) {
    issues.push({
      type: 'repetition',
      message: 'Excessive repetition detected',
      severity: 'medium'
    });
  }
  
  // Check for forbidden phrases
  const forbiddenPhrases = ['furthermore', 'moreover', 'in conclusion', 'additionally', 'thus'];
  const foundForbidden = forbiddenPhrases.filter(phrase =>
    content.toLowerCase().includes(phrase)
  );
  if (foundForbidden.length > 0) {
    issues.push({
      type: 'forbidden_phrases',
      message: `Forbidden phrases found: ${foundForbidden.join(', ')}`,
      severity: 'medium'
    });
  }
  
  // Check for extremely long paragraphs
  const paragraphs = content.split(/\n\s*\n/);
  const longParagraphs = paragraphs.filter(p => p.split(/\s+/).length > 40);
  if (longParagraphs.length > 0) {
    issues.push({
      type: 'paragraph_length',
      message: `Extremely long paragraphs detected: ${longParagraphs.length} paragraphs over 40 words`,
      severity: 'high'
    });
  }

  // Check for minimum heading requirements
  const headingCount = (content.match(/<h[1-6]/g) || []).length;
  if (headingCount < 5) {
    issues.push({
      type: 'insufficient_headings',
      message: `Insufficient headings detected: ${headingCount} found, minimum 5 required`,
      severity: 'high'
    });
  }

  // Check for bullet point usage
  const bulletPointCount = (content.match(/^\s*[-*+]\s+/gm) || []).length;
  if (bulletPointCount < 2) {
    issues.push({
      type: 'insufficient_bullets',
      message: `Insufficient bullet points detected: ${bulletPointCount} found, minimum 2 required`,
      severity: 'medium'
    });
  }

  // Check for paragraph distribution
  const shortParagraphs = paragraphs.filter(p => p.split(/\s+/).length < 20);
  if (shortParagraphs.length / paragraphs.length > 0.7) {
    issues.push({
      type: 'poor_paragraph_distribution',
      message: 'Too many very short paragraphs detected',
      severity: 'medium'
    });
  }
  
  return issues;
}

export function calculateQualityScore(content: string): number {
  let score = 100;
  const issues = validateContentQuality(content);
  
  issues.forEach(issue => {
    switch (issue.severity) {
      case 'high': score -= 20; break;
      case 'medium': score -= 10; break;
      case 'low': score -= 5; break;
    }
  });
  
  return Math.max(0, score);
}