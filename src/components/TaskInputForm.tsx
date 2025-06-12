
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { parseNaturalLanguage } from '../utils/taskParser';
import { ParsedTask } from '../types/Task';

interface TaskInputFormProps {
  onAddTask: (task: ParsedTask) => void;
}

export const TaskInputForm: React.FC<TaskInputFormProps> = ({ onAddTask }) => {
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState<ParsedTask | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (input.trim()) {
      const debounceTimer = setTimeout(() => {
        const parsed = parseNaturalLanguage(input);
        setPreview(parsed);
        console.log('Parsed preview:', parsed);
      }, 300);

      return () => clearTimeout(debounceTimer);
    } else {
      setPreview(null);
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const parsed = parseNaturalLanguage(input);
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
            placeholder="Describe your task naturally... e.g., 'Finish the marketing presentation for Sarah by Friday 3pm P1'"
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

      {/* Enhanced Preview */}
      {preview && (
        <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200/50 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <span className="text-sm font-semibold text-indigo-700">AI Preview</span>
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
        </div>
      )}
    </div>
  );
};
