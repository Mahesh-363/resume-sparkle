import * as pdfjsLib from 'pdfjs-dist';

// Use the bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const textParts: string[] = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => item.str)
          .join(' ');
        textParts.push(pageText);
      } catch (pageErr) {
        console.warn(`Failed to extract text from page ${i}, skipping...`, pageErr);
        textParts.push('');
      }
    }
    
    const fullText = textParts.join('\n').trim();
    
    if (!fullText) {
      throw new Error(
        'No text could be extracted. This PDF may be scanned or image-based. ' +
        'Please try a text-based PDF, or copy-paste your resume text into the job description field as a workaround.'
      );
    }
    
    return fullText;
  } catch (err: any) {
    if (err.message?.includes('No text could be extracted')) {
      throw err;
    }
    throw new Error(
      `Failed to parse PDF: ${err.message || 'Unknown error'}. ` +
      'The file may be corrupted or password-protected. Please try another file.'
    );
  }
}