import { GoogleGenerativeAI } from '@google/generative-ai';
import { ParsedTask } from '../types/Task';

// Initialize the Gemini API with the API key from environment variables
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

// Get the Gemini Flash 2.0 model
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

export interface GeminiTaskParseResponse {
  name: string;
  assignee: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  dueDate?: string;
  description?: string;
}

export class GeminiService {
  /**
   * Parse natural language input into structured task data using Gemini Flash 2.0
   */
  static async parseTaskWithAI(input: string): Promise<ParsedTask> {
    try {
      const currentYear = new Date().getFullYear();
      const currentDate = new Date().toISOString().split('T')[0];
      
      const prompt = `
You are an advanced AI assistant specialized in parsing natural language into structured task data. You excel at understanding context, implied meanings, and complex sentence structures.

Parse the following task description into a JSON object, being intelligent about interpreting:
- Implied actions and requirements
- Complex or unclear language
- Informal expressions and abbreviations
- Context clues for assignees and deadlines
- Priority indicators in the text

Return a JSON object with these fields:
- name: Clear, actionable task description (string)
- assignee: Person assigned (string, "Unassigned" if unclear)
- priority: "P1" (urgent), "P2" (important), "P3" (normal), "P4" (low)
- dueDate: ISO format date (string, optional)
- description: Additional context (string, optional)

DATE PROCESSING RULES:
- Current date: ${currentDate}
- Current year: ${currentYear}
- DEFAULT to current year (${currentYear}) for all dates unless explicitly specified otherwise
- NEVER use past dates - if a date would be in the past, move it to current year
- Only use next year if explicitly mentioned (e.g., "next year", "2025")
- "tomorrow" = next day, "next week" = +7 days
- Weekdays without year = next occurrence in current year
- Month/day without year = current year (${currentYear})
- If current year date is past, then use next year

PRIORITY INTELLIGENCE:
- Urgent words (ASAP, urgent, critical, emergency) = P1
- Important projects/deadlines = P2
- Regular tasks = P3
- Nice-to-have items = P4

EXAMPLES:
- "need to call john asap about the project" → P1 priority, clear action
- "marketing thing for sarah by friday" → task for Sarah, due next Friday
- "review docs when you get a chance" → P4 priority, flexible timing

Task description: "${input}"

Return ONLY valid JSON object. No markdown, no explanations.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response to ensure it's valid JSON
      const cleanedText = text.replace(/```json\n?|```\n?/g, '').trim();
      
      console.log('Single task - Gemini API raw response:', text);
      console.log('Single task - Cleaned response for parsing:', cleanedText);
      
      try {
        const parsed: GeminiTaskParseResponse = JSON.parse(cleanedText);
        console.log('Single task - Successfully parsed JSON:', parsed);
        return this.validateAndTransformTask(parsed, input);
      } catch (parseError) {
        console.error('Failed to parse Gemini response as JSON:', parseError);
        console.error('Raw response:', text);
        
        // Fallback to basic parsing
        return this.fallbackParse(input);
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Fallback to basic parsing
      return this.fallbackParse(input);
    }
  }

  /**
   * Fallback parsing method when AI fails
   */
  private static fallbackParse(input: string): ParsedTask {
    return {
      name: input,
      assignee: 'Unassigned',
      priority: 'P3'
    };
  }

  /**
   * Parse natural language input that may contain multiple tasks
   */
  static async parseMultipleTasksWithAI(input: string): Promise<ParsedTask[]> {
    try {
      const currentYear = new Date().getFullYear();
      const currentDate = new Date().toISOString().split('T')[0];
      
      const prompt = `
You are an advanced AI assistant specialized in parsing natural language into structured task data. You excel at understanding context, implied meanings, and complex sentence structures.

Analyze the following text and extract ALL tasks mentioned, no matter how complex or unclear the language is. Be intelligent about interpreting:
- Implied tasks and actions
- Complex sentence structures
- Informal language and abbreviations
- Multiple tasks in single sentences
- Context clues for assignees and deadlines

Return a JSON array of task objects with these fields:
- name: Clear, actionable task description (string)
- assignee: Person assigned (string, "Unassigned" if unclear)
- priority: "P1" (urgent), "P2" (important), "P3" (normal), "P4" (low)
- dueDate: ISO format date (string, optional)
- description: Additional context (string, optional)

DATE PROCESSING RULES:
- Current date: ${currentDate}
- Current year: ${currentYear}
- NEVER use past dates
- "tomorrow" = next day, "next week" = +7 days
- Weekdays without year = next occurrence
- Ambiguous dates = reasonable future interpretation

PRIORITY INTELLIGENCE:
- Urgent words (ASAP, urgent, critical) = P1
- Important projects/deadlines = P2
- Regular tasks = P3
- Nice-to-have items = P4

EXAMPLES OF COMPLEX PARSING:
- "need john to handle the client thing by friday" → task for John, due next Friday
- "marketing deck review tonight plus follow up tomorrow" → 2 tasks with different dates
- "urgent: fix the bug, also update docs when you can" → P1 and P4 tasks

Text to analyze: "${input}"

CRITICAL INSTRUCTIONS:
- You MUST return a JSON array, even for single tasks
- Look for ALL possible tasks, actions, and assignments
- Split compound sentences into separate tasks
- If you see multiple people mentioned, create separate tasks
- If you see multiple actions/verbs, create separate tasks
- ALWAYS return an array format: [{...}, {...}] not just {...}

Return ONLY valid JSON array. No markdown, no explanations, no extra text.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response to ensure it's valid JSON
      const cleanedText = text.replace(/```json\n?|```\n?/g, '').trim();
      
      console.log('Gemini API raw response:', text);
      console.log('Cleaned response for parsing:', cleanedText);
      
      try {
        let parsed: any = JSON.parse(cleanedText);
        console.log('Successfully parsed JSON:', parsed);
        
        // Handle case where AI returns a single object instead of array
        if (!Array.isArray(parsed)) {
          console.log('AI returned single object, wrapping in array');
          parsed = [parsed];
        }
        
        // Ensure we have valid task objects
        const validTasks = parsed.filter((task: any) => 
          task && typeof task === 'object' && (task.name || task.description)
        );
        
        console.log('Valid tasks found:', validTasks.length);
        
        // Validate and transform each task
         const validatedTasks: ParsedTask[] = validTasks.map((task, index) => 
          this.validateAndTransformTask(task, `${input} (task ${index + 1})`)
        );
        
        return validatedTasks;
      } catch (parseError) {
        console.error('Failed to parse Gemini multiple tasks response as JSON:', parseError);
        console.error('Raw response:', text);
        
        // Fallback to single task parsing
        const singleTask = await this.parseTaskWithAI(input);
        return [singleTask];
      }
    } catch (error) {
      console.error('Error calling Gemini API for multiple tasks:', error);
      
      // Fallback to single task parsing
      const singleTask = this.fallbackParse(input);
      return [singleTask];
    }
  }

  /**
   * Helper method to validate and transform a single task
   */
  private static validateAndTransformTask(parsed: GeminiTaskParseResponse, fallbackName: string): ParsedTask {
    let validatedDueDate: string | undefined = undefined;
    
    if (parsed.dueDate) {
      const parsedDate = new Date(parsed.dueDate);
      const now = new Date();
      
      // If the parsed date doesn't have a year or is in the past, adjust it
      if (parsedDate < now) {
        // Check if the original date string had a year
        const hasYear = /\d{4}/.test(parsed.dueDate);
        
        if (!hasYear) {
          // No year specified, try current year first
          const currentYearDate = new Date(parsedDate);
          currentYearDate.setFullYear(now.getFullYear());
          
          if (currentYearDate >= now) {
            // Current year works
            validatedDueDate = currentYearDate.toISOString();
          } else {
            // Current year is past, use next year
            currentYearDate.setFullYear(now.getFullYear() + 1);
            validatedDueDate = currentYearDate.toISOString();
          }
        } else {
          // Year was specified but it's in the past, move to next year
          parsedDate.setFullYear(now.getFullYear() + 1);
          validatedDueDate = parsedDate.toISOString();
        }
      } else {
        validatedDueDate = parsedDate.toISOString();
      }
    }
    
    return {
      name: parsed.name || fallbackName,
      assignee: parsed.assignee || 'Unassigned',
      priority: parsed.priority || 'P3',
      dueDate: validatedDueDate,
      description: parsed.description
    };
  }

  /**
   * Generate task suggestions based on user input
   */
  static async generateTaskSuggestions(input: string): Promise<string[]> {
    try {
      const prompt = `
Based on the following task description, suggest 3-5 related subtasks or follow-up tasks that might be needed.

Task: "${input}"

Return a JSON array of strings, each representing a suggested task. Keep suggestions practical and actionable.
Return only valid JSON without any markdown formatting or additional text.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedText = text.replace(/```json\n?|```\n?/g, '').trim();
      
      try {
        const suggestions: string[] = JSON.parse(cleanedText);
        return Array.isArray(suggestions) ? suggestions : [];
      } catch (parseError) {
        console.error('Failed to parse suggestions:', parseError);
        return [];
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [];
    }
  }

  /**
   * Check if the Gemini API is properly configured
   */
  static isConfigured(): boolean {
    return !!(import.meta.env.VITE_GEMINI_API_KEY);
  }
}