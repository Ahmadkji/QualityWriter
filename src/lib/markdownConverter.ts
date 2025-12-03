import { marked } from 'marked';

/**
 * Get CSS classes for different heading levels
 */
function getHeadingClasses(level: number): string {
  const baseClasses = 'font-bold';
  
  switch (level) {
    case 1:
      return `${baseClasses} text-2xl mb-4 mt-6`;
    case 2:
      return `${baseClasses} text-xl mb-3 mt-5`;
    case 3:
      return `${baseClasses} text-lg mb-2 mt-4`;
    case 4:
      return `${baseClasses} text-base mb-2 mt-3`;
    case 5:
      return `${baseClasses} text-sm mb-2 mt-3`;
    case 6:
      return `${baseClasses} text-sm mb-2 mt-3`;
    default:
      return `${baseClasses} text-lg mb-2 mt-4`;
  }
}

/**
 * Convert Markdown content to HTML with proper styling
 */
export function convertMarkdownToHTML(content: string): string {
  try {
    // Convert Markdown to HTML using marked
    let html = marked(content, {
      // Enable GitHub Flavored Markdown
      gfm: true,
      breaks: true
    });
    
    // Ensure html is a string (marked might return Promise in some versions)
    if (typeof html !== 'string') {
      html = String(html);
    }
    
    // Post-process to add proper CSS classes to headings
    html = html.replace(/<h([1-6])([^>]*)>/g, (match, level, attrs) => {
      const cssClasses = getHeadingClasses(parseInt(level));
      return `<h${level} class="${cssClasses}"${attrs}>`;
    });
    
    // Post-process to add CSS classes to paragraphs
    html = html.replace(/<p([^>]*)>/g, '<p$1 class="mb-4">');
    
    // Post-process to add CSS classes to lists
    html = html.replace(/<ul([^>]*)>/g, '<ul$1 class="list-disc mb-4 ml-6">');
    html = html.replace(/<ol([^>]*)>/g, '<ol$1 class="list-decimal mb-4 ml-6">');
    html = html.replace(/<li([^>]*)>/g, '<li$1 class="ml-4 mb-1">');
    
    // Post-process to add CSS classes to tables
    html = html.replace(/<table([^>]*)>/g, '<div class="overflow-x-auto mb-6"><table$1 class="w-full border-collapse border border-gray-300">');
    html = html.replace(/<\/table>/g, '</table></div>');
    html = html.replace(/<th([^>]*)>/g, '<th$1 class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">');
    html = html.replace(/<td([^>]*)>/g, '<td$1 class="border border-gray-300 px-4 py-3 text-gray-700">');
    
    // Post-process to add CSS classes to blockquotes
    html = html.replace(/<blockquote([^>]*)>/g, '<blockquote$1 class="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 italic text-gray-700">');
    
    // Post-process to ensure proper spacing between elements
    html = html
      // Add spacing between different elements
      .replace(/<\/h([1-6])>/g, '</h$1>\n')
      .replace(/<\/(ul|ol)>/g, '</$1>\n')
      .replace(/<\/table>/g, '</table></div>\n')
      .replace(/<\/p>/g, '</p>\n')
      // Clean up excessive whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    return html;
  } catch (error) {
    console.error('Markdown conversion error:', error);
    // Fallback to basic conversion if marked fails
    return fallbackMarkdownConversion(content);
  }
}

/**
 * Fallback Markdown conversion for basic elements
 */
function fallbackMarkdownConversion(content: string): string {
  return content
    // Convert headings
    .replace(/^#{1,6}\s+(.+)$/gm, (match, heading) => {
      const level = match.match(/^#+/)?.[0].length || 1;
      const cssClasses = getHeadingClasses(level);
      return `<h${level} class="${cssClasses}">${heading}</h${level}>`;
    })
    // Convert bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Convert italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Convert line breaks to paragraphs
    .replace(/\n\s*\n/g, '</p><p class="mb-4">')
    // Wrap in paragraph
    .replace(/^/, '<p class="mb-4">')
    .replace(/$/, '</p>');
}

/**
 * Extract plain text from HTML for content analysis
 */
export function extractTextFromHTML(html: string): string {
  return html
    // Replace block-level elements with spaces to maintain sentence boundaries
    .replace(/<(h[1-6]|p|div|section|article|br|hr)[^>]*>/gi, ' ')
    // Remove inline formatting tags but keep their content
    .replace(/<(strong|em|b|i|span|a|small)[^>]*>/gi, '')
    .replace(/<\/(strong|em|b|i|span|a|small)>/gi, '')
    // Remove other HTML tags
    .replace(/<[^>]*>/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Validate that content has proper HTML headings
 */
export function validateHTMLHeadings(html: string): {
  hasHeadings: boolean;
  headingCount: number;
  headingLevels: number[];
} {
  const headingRegex = /<h([1-6])[^>]*>/gi;
  const matches = html.match(headingRegex) || [];
  
  return {
    hasHeadings: matches.length > 0,
    headingCount: matches.length,
    headingLevels: matches.map(match => parseInt(match.match(/<h([1-6])/)?.[1] || '1'))
  };
}