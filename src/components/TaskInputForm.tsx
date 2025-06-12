
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { parseNaturalLanguage } from '../utils/taskParser';
import { GeminiService } from '../services/geminiService';
import { ParsedTask } from '../types/Task';

interface TaskInputFormProps {
  onAddTask: (task: ParsedTask) => void;
}

export const TaskInputForm: React.FC<TaskInputFormProps> = ({ onAddTask }) => {
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState<ParsedTask | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAIEnabled, setIsAIEnabled] = useState(GeminiService.isConfigured());
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (input.trim()) {
      const debounceTimer = setTimeout(async () => {
        if (isAIEnabled) {
          try {
            setIsLoading(true);
            const parsed = await GeminiService.parseTaskWithAI(input);
            setPreview(parsed);
            console.log('AI Parsed preview:', parsed);
          } catch (error) {
            console.error('AI parsing failed, falling back to basic parser:', error);
            const parsed = parseNaturalLanguage(input);
            setPreview(parsed);
          } finally {
            setIsLoading(false);
          }
        } else {
          const parsed = parseNaturalLanguage(input);
          setPreview(parsed);
          console.log('Basic parsed preview:', parsed);
        }
      }, 500);

      return () => clearTimeout(debounceTimer);
    } else {
      setPreview(null);
      setSuggestions([]);
    }
  }, [input, isAIEnabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      let parsed: ParsedTask;
      
      if (isAIEnabled) {
        try {
          parsed = await GeminiService.parseTaskWithAI(input);
          // Generate suggestions for follow-up tasks
          const taskSuggestions = await GeminiService.generateTaskSuggestions(input);
          setSuggestions(taskSuggestions);
        } catch (error) {
          console.error('AI parsing failed, using basic parser:', error);
          parsed = parseNaturalLanguage(input);
        }
      } else {
        parsed = parseNaturalLanguage(input);
      }
      
      onAddTask(parsed);
      setInput('');
      setPreview(null);
      textareaRef.current?.focus();
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* AI Sparkle Icon */}
          <div className="absolute left-6 top-6 z-10">
            <Sparkles className="h-6 w-6 text-indigo-500 animate-pulse" />
          </div>
          
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isAIEnabled ? "Describe your task naturally... AI will understand and organize it perfectly!" : "Describe your task... e.g., 'Finish the marketing presentation for Sarah by Friday 3pm P1'"}
            className="w-full pl-16 pr-20 py-6 bg-white/90 backdrop-blur-sm border-2 border-indigo-200/50 rounded-2xl resize-none focus:outline-none text-lg placeholder:text-slate-400 input-glow shadow-xl transition-all duration-300"
            rows={1}
            style={{ minHeight: '80px' }}
          />
          
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-4 bottom-4 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Send className="h-6 w-6" />
            )}
          </button>
        </div>
      </form>

      {/* AI Status Indicator */}
      {!isAIEnabled && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <span className="text-sm text-amber-700">
            Gemini AI is not configured. Using basic parsing. Add VITE_GEMINI_API_KEY to enable AI features.
          </span>
        </div>
      )}

      {/* Enhanced Preview */}
      {preview && (
        <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200/50 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <span className="text-sm font-semibold text-indigo-700">
              {isAIEnabled ? 'Gemini AI Preview' : 'Basic Preview'}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-md">
              <span className="text-sm font-semibold text-slate-700">📝 {preview.name}</span>
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-md">
              <span className="text-sm text-slate-600">👤 {preview.assignee}</span>
            </div>
            {preview.dueDate && (
              <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-md">
                <span className="text-sm text-slate-600">📅 {new Date(preview.dueDate).toLocaleString()}</span>
              </div>
            )}
            <div className={`inline-flex items-center px-4 py-2 rounded-xl priority-${preview.priority.toLowerCase()} shadow-md`}>
              <span className="text-sm font-semibold">{preview.priority}</span>
            </div>
          </div>
          {preview.description && (
            <div className="mt-3 p-3 bg-white/60 rounded-xl">
              <span className="text-sm text-slate-600">{preview.description}</span>
            </div>
          )}
        </div>
      )}

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">AI Suggestions</span>
          </div>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left p-3 bg-white/80 hover:bg-white rounded-xl border border-green-200/50 text-sm text-slate-700 hover:text-slate-900 transition-all duration-200 hover:shadow-md"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
