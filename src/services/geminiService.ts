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
You are an AI assistant that helps parse natural language task descriptions into structured data.

Parse the following task description and return a JSON object with these fields:
- name: The main task description (string)
- assignee: The person assigned to the task (string, default to "Unassigned" if not specified)
- priority: Task priority ("P1", "P2", "P3", or "P4", default to "P3" if not specified)
- dueDate: Due date in ISO format (string, optional)
- description: Additional details (string, optional)

IMPORTANT DATE RULES:
- Current date: ${currentDate}
- Current year: ${currentYear}
- NEVER assign dates in the past
- If no year is specified, use ${currentYear} or ${currentYear + 1} if the date would be in the past
- For relative dates like "tomorrow", "next week", calculate from today
- For weekdays without year, use the next occurrence of that weekday

Priority guidelines:
- P1: Urgent and important
- P2: Important but not urgent
- P3: Normal priority (default)
- P4: Low priority

Task description: "${input}"

Return only valid JSON without any markdown formatting or additional text.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response to ensure it's valid JSON
      const cleanedText = text.replace(/```json\n?|```\n?/g, '').trim();
      
      try {
        const parsed: GeminiTaskParseResponse = JSON.parse(cleanedText);
        
        // Validate and transform the response
        let validatedDueDate: string | undefined = undefined;
        
        if (parsed.dueDate) {
          const parsedDate = new Date(parsed.dueDate);
          const now = new Date();
          
          // Ensure the date is not in the past
          if (parsedDate < now) {
            // If it's a past date, move it to next year
            parsedDate.setFullYear(now.getFullYear() + 1);
          }
          
          validatedDueDate = parsedDate.toISOString();
        }
        
        const taskData: ParsedTask = {
          name: parsed.name || input,
          assignee: parsed.assignee || 'Unassigned',
          priority: parsed.priority || 'P3',
          dueDate: validatedDueDate,
          description: parsed.description
        };
        
        return taskData;
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