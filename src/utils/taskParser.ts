import { ParsedTask, Priority } from '../types/Task';

export const parseNaturalLanguage = (input: string): ParsedTask => {
  console.log('Parsing input:', input);
  
  // Initialize result with defaults
  let result: ParsedTask = {
    name: '',
    assignee: 'Unassigned',
    priority: 'P3'
  };

  // Extract priority (P1, P2, P3, P4)
  const priorityMatch = input.match(/\b(P[1-4])\b/i);
  if (priorityMatch) {
    result.priority = priorityMatch[1].toUpperCase() as Priority;
    input = input.replace(priorityMatch[0], '').trim();
  }

  // Extract time and date patterns
  const timePatterns = [
    // Time formats: 11pm, 5:30pm, 17:00
    /\b(\d{1,2}):?(\d{2})?\s*(am|pm|AM|PM)\b/,
    /\b(\d{1,2}):(\d{2})\b/
  ];

  const datePatterns = [
    // Absolute dates: 20th June, June 20, 2024-06-20
    /\b(\d{1,2})(st|nd|rd|th)?\s+(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i,
    /\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})(st|nd|rd|th)?\b/i,
    /\b\d{4}-\d{2}-\d{2}\b/,
    // Relative dates: tomorrow, next week, in 2 days
    /\b(tomorrow|today)\b/i,
    /\bnext\s+(week|month|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
    /\bin\s+(\d+)\s+(days?|weeks?|months?)\b/i,
    /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i
  ];

  let timeMatch = null;
  let dateMatch = null;

  // Find time
  for (const pattern of timePatterns) {
    timeMatch = input.match(pattern);
    if (timeMatch) break;
  }

  // Find date
  for (const pattern of datePatterns) {
    dateMatch = input.match(pattern);
    if (dateMatch) break;
  }

  // Parse date and time
  if (dateMatch || timeMatch) {
    let targetDate = new Date();

    // Handle date parsing
    if (dateMatch) {
      const dateStr = dateMatch[0].toLowerCase();
      
      if (dateStr === 'tomorrow') {
        targetDate.setDate(targetDate.getDate() + 1);
      } else if (dateStr === 'today') {
        // Keep current date
      } else if (dateStr.includes('next week')) {
        targetDate.setDate(targetDate.getDate() + 7);
      } else if (dateStr.includes('next')) {
        targetDate.setDate(targetDate.getDate() + 7); // Default to next week
      } else if (dateStr.includes('in')) {
        const numberMatch = dateStr.match(/(\d+)/);
        if (numberMatch) {
          const num = parseInt(numberMatch[1]);
          if (dateStr.includes('day')) {
            targetDate.setDate(targetDate.getDate() + num);
          } else if (dateStr.includes('week')) {
            targetDate.setDate(targetDate.getDate() + (num * 7));
          }
        }
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
      } else {
        // Try to parse as actual date with current year
        try {
          const currentYear = new Date().getFullYear();
          let parsed = new Date(dateStr);
          
          // If the parsed date doesn't have a year or has an old year, use current year
          if (!isNaN(parsed.getTime())) {
            // If the date appears to be in the past, assume it's for next year
            if (parsed.getFullYear() < currentYear || 
                (parsed.getFullYear() === currentYear && parsed < new Date())) {
              parsed.setFullYear(currentYear + 1);
            }
            targetDate = parsed;
          }
        } catch (e) {
          console.warn('Could not parse date:', dateStr);
        }
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

    // Validate that the target date is not in the past
    const now = new Date();
    if (targetDate < now) {
      // If the date is in the past, move it to next occurrence
      if (dateMatch && dateMatch[0].match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i)) {
        // For weekdays, get next occurrence
        const dayName = dateMatch[0].toLowerCase();
        const dayMap = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
        const targetDay = dayMap[dayName as keyof typeof dayMap];
        if (targetDay !== undefined) {
          targetDate = getNextWeekday(now, targetDay);
        }
      } else {
        // For other dates, add a year
        targetDate.setFullYear(targetDate.getFullYear() + 1);
      }
    }

    result.dueDate = targetDate.toISOString();

    // Remove date/time from input
    if (dateMatch) input = input.replace(dateMatch[0], '');
    if (timeMatch) input = input.replace(timeMatch[0], '');
  }

  // Extract assignee (look for common names or words that could be names)
  const words = input.split(/\s+/).filter(word => word.trim().length > 0);
  const commonPrepositions = ['by', 'for', 'with', 'to', 'from', 'at', 'on', 'in'];
  const commonVerbs = ['finish', 'complete', 'call', 'email', 'send', 'review', 'update', 'create'];
  
  // Look for potential names (capitalized words that aren't common words)
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isCapitalized = word[0]?.toUpperCase() === word[0];
    const isCommonWord = commonPrepositions.includes(word.toLowerCase()) || 
                        commonVerbs.includes(word.toLowerCase());
    
    if (isCapitalized && !isCommonWord && word.length > 1) {
      result.assignee = word;
      // Remove assignee from input
      input = input.replace(new RegExp(`\\b${word}\\b`, 'g'), '');
      break;
    }
  }

  // Clean up the remaining text as task name
  result.name = input
    .replace(/\s+/g, ' ')
    .replace(/\bby\b/gi, '')
    .trim() || 'Untitled Task';

  console.log('Parsed result:', result);
  return result;
};

const getNextWeekday = (date: Date, targetDay: number): Date => {
  const currentDay = date.getDay();
  const daysUntilTarget = (targetDay - currentDay + 7) % 7;
  const result = new Date(date);
  result.setDate(date.getDate() + (daysUntilTarget === 0 ? 7 : daysUntilTarget));
  return result;
};
