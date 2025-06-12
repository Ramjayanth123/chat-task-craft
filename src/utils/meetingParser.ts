import { ParsedTask, Priority } from '../types/Task';

export const parseMeetingTranscript = (transcript: string): ParsedTask[] => {
  console.log('Parsing meeting transcript:', transcript);
  
  const tasks: ParsedTask[] = [];
  
  // Split by sentences and periods, but keep meaningful chunks
  const sentences = transcript
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 10); // Filter out very short fragments
  
  for (const sentence of sentences) {
    const extractedTask = extractTaskFromSentence(sentence);
    if (extractedTask) {
      tasks.push(extractedTask);
    }
  }
  
  console.log('Extracted tasks from meeting:', tasks);
  return tasks;
};

const extractTaskFromSentence = (sentence: string): ParsedTask | null => {
  // Task assignment patterns to look for
  const patterns = [
    // "Aman you take the landing page"
    /\b([A-Z][a-z]+)\s+you\s+(.*?)(?:\s+by\s+|\s+before\s+|$)/i,
    // "Aman take care of client follow-up"
    /\b([A-Z][a-z]+)\s+take care of\s+(.*?)(?:\s+by\s+|\s+before\s+|$)/i,
    // "Aman please review the marketing deck"
    /\b([A-Z][a-z]+)\s+please\s+(.*?)(?:\s+by\s+|\s+before\s+|$)/i,
    // "Aman handle the budget review"
    /\b([A-Z][a-z]+)\s+handle\s+(.*?)(?:\s+by\s+|\s+before\s+|$)/i,
    // "Ask Aman to finish the presentation"
    /ask\s+([A-Z][a-z]+)\s+to\s+(.*?)(?:\s+by\s+|\s+before\s+|$)/i,
    // "Aman can you prepare the presentation"
    /\b([A-Z][a-z]+)[,]?\s+can you\s+(.*?)(?:\s+by\s+|\s+before\s+|$)/i,
    // "Let's have Aman do the landing page"
    /let'?s have\s+([A-Z][a-z]+)\s+(do|handle|take care of)?\s*(.*?)(?:\s+by\s+|\s+before\s+|$)/i,
  ];

  for (const pattern of patterns) {
    const match = sentence.match(pattern);
    if (match) {
      const assignee = match[1];
      let taskName = match[2] || match[3] || '';
      
      // Clean up task name
      taskName = cleanTaskName(taskName);
      
      if (taskName.length < 3) continue; // Skip if task name is too short
      
      // Extract due date and priority from the original sentence
      const dueDate = extractDueDate(sentence);
      const priority = extractPriority(sentence);
      
      return {
        name: taskName,
        assignee: assignee,
        dueDate: dueDate,
        priority: priority
      };
    }
  }
  
  return null;
};

const cleanTaskName = (taskName: string): string => {
  return taskName
    .replace(/^(the|a|an)\s+/i, '') // Remove articles at the beginning
    .replace(/\s+(by|before|until)\s+.*$/i, '') // Remove deadline info
    .replace(/\s+(P[1-4])\s*$/i, '') // Remove priority
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
};

const extractDueDate = (sentence: string): string | undefined => {
  // Time patterns
  const timePatterns = [
    /\b(\d{1,2}):?(\d{2})?\s*(am|pm|AM|PM)\b/,
    /\b(\d{1,2}):(\d{2})\b/
  ];

  // Date patterns
  const datePatterns = [
    /\b(\d{1,2})(st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i,
    /\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})(st|nd|rd|th)?\b/i,
    /\b\d{4}-\d{2}-\d{2}\b/,
    /\b(tomorrow|today|tonight)\b/i,
    /\bnext\s+(week|month|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
    /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
    /\bend of (week|month)\b/i,
    /\bby (end of )?(week|month)\b/i
  ];

  let timeMatch = null;
  let dateMatch = null;

  // Find time
  for (const pattern of timePatterns) {
    timeMatch = sentence.match(pattern);
    if (timeMatch) break;
  }

  // Find date
  for (const pattern of datePatterns) {
    dateMatch = sentence.match(pattern);
    if (dateMatch) break;
  }

  if (dateMatch || timeMatch) {
    let targetDate = new Date();

    // Handle date parsing
    if (dateMatch) {
      const dateStr = dateMatch[0].toLowerCase();
      
      if (dateStr === 'tomorrow') {
        targetDate.setDate(targetDate.getDate() + 1);
      } else if (dateStr === 'today') {
        // Keep current date
      } else if (dateStr === 'tonight') {
        targetDate.setHours(20, 0, 0, 0); // Default to 8 PM
      } else if (dateStr.includes('next week')) {
        targetDate.setDate(targetDate.getDate() + 7);
      } else if (dateStr.includes('end of week')) {
        const daysUntilFriday = (5 - targetDate.getDay() + 7) % 7;
        targetDate.setDate(targetDate.getDate() + daysUntilFriday);
        targetDate.setHours(17, 0, 0, 0); // End of work day
      } else if (dateStr.includes('monday')) {
        targetDate = getNextWeekday(targetDate, 1);
      } else if (dateStr.includes('tuesday')) {
        targetDate = getNextWeekday(targetDate, 2);
      } else if (dateStr.includes('wednesday')) {
        targetDate = getNextWeekday(targetDate, 3);
      } else if (dateStr.includes('thursday')) {
        targetDate = getNextWeekday(targetDate, 4);
      } else if (dateStr.includes('friday')) {
        targetDate = getNextWeekday(targetDate, 5);
      } else if (dateStr.includes('saturday')) {
        targetDate = getNextWeekday(targetDate, 6);
      } else if (dateStr.includes('sunday')) {
        targetDate = getNextWeekday(targetDate, 0);
      }
    }

    // Handle time parsing
    if (timeMatch) {
      const timeStr = timeMatch[0];
      let hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      const meridiem = timeMatch[3]?.toLowerCase();

      if (meridiem === 'pm' && hours !== 12) {
        hours += 12;
      } else if (meridiem === 'am' && hours === 12) {
        hours = 0;
      }

      targetDate.setHours(hours, minutes, 0, 0);
    }

    return targetDate.toISOString();
  }

  return undefined;
};

const extractPriority = (sentence: string): Priority => {
  const priorityMatch = sentence.match(/\b(P[1-4])\b/i);
  if (priorityMatch) {
    return priorityMatch[1].toUpperCase() as Priority;
  }
  return 'P3'; // Default priority
};

const getNextWeekday = (date: Date, targetDay: number): Date => {
  const currentDay = date.getDay();
  const daysUntilTarget = (targetDay - currentDay + 7) % 7;
  const result = new Date(date);
  result.setDate(date.getDate() + (daysUntilTarget === 0 ? 7 : daysUntilTarget));
  return result;
};
