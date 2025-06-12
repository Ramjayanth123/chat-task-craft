
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
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
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative bg-card border border-border rounded-2xl shadow-lg">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a task... e.g., 'Finish landing page Aman by 11pm 20th June'"
            className="w-full px-6 py-4 pr-14 bg-transparent border-none resize-none focus:outline-none text-lg placeholder:text-muted-foreground"
            rows={1}
            style={{ minHeight: '60px' }}
          />
          
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-4 bottom-4 p-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>

      {/* Preview */}
      {preview && (
        <div className="mt-4 p-4 bg-muted rounded-xl border border-border">
          <div className="text-sm text-muted-foreground mb-2">Preview:</div>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center px-3 py-1 bg-card rounded-lg border">
              <span className="text-sm font-medium">{preview.name}</span>
            </span>
            <span className="inline-flex items-center px-3 py-1 bg-card rounded-lg border">
              <span className="text-sm">👤 {preview.assignee}</span>
            </span>
            {preview.dueDate && (
              <span className="inline-flex items-center px-3 py-1 bg-card rounded-lg border">
                <span className="text-sm">📅 {new Date(preview.dueDate).toLocaleString()}</span>
              </span>
            )}
            <span className={`inline-flex items-center px-3 py-1 rounded-lg priority-${preview.priority.toLowerCase()}`}>
              <span className="text-sm font-medium">{preview.priority}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
