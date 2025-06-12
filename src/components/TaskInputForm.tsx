
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, FileText, X } from 'lucide-react';
import { parseNaturalLanguage } from '../utils/taskParser';
import { parseMeetingTranscript } from '../utils/meetingParser';
import { ParsedTask } from '../types/Task';

interface TaskInputFormProps {
  onAddTask: (task: ParsedTask) => void;
  onAddTasks: (tasks: ParsedTask[]) => void;
}

type InputMode = 'single' | 'meeting';

export const TaskInputForm: React.FC<TaskInputFormProps> = ({ onAddTask, onAddTasks }) => {
  const [mode, setMode] = useState<InputMode>('single');
  const [singleInput, setSingleInput] = useState('');
  const [meetingInput, setMeetingInput] = useState('');
  const [preview, setPreview] = useState<ParsedTask | null>(null);
  const [extractedTasks, setExtractedTasks] = useState<ParsedTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const meetingTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (mode === 'single' && singleInput.trim()) {
      const debounceTimer = setTimeout(() => {
        const parsed = parseNaturalLanguage(singleInput);
        setPreview(parsed);
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setPreview(null);
    }
  }, [singleInput, mode]);

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleInput.trim()) return;

    setIsLoading(true);
    try {
      const parsed = parseNaturalLanguage(singleInput);
      onAddTask(parsed);
      setSingleInput('');
      setPreview(null);
      textareaRef.current?.focus();
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingInput.trim()) return;

    setIsLoading(true);
    try {
      const tasks = parseMeetingTranscript(meetingInput);
      setExtractedTasks(tasks);
      setShowPreview(true);
    } catch (error) {
      console.error('Error extracting tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAllTasks = () => {
    onAddTasks(extractedTasks);
    setMeetingInput('');
    setExtractedTasks([]);
    setShowPreview(false);
    meetingTextareaRef.current?.focus();
  };

  const handleClearMeeting = () => {
    setMeetingInput('');
    setExtractedTasks([]);
    setShowPreview(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (mode === 'single') {
        handleSingleSubmit(e);
      } else {
        handleMeetingSubmit(e);
      }
    }
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, mode === 'meeting' ? 300 : 200)}px`;
  };

  useEffect(() => {
    if (textareaRef.current && mode === 'single') {
      adjustTextareaHeight(textareaRef.current);
    }
  }, [singleInput, mode]);

  useEffect(() => {
    if (meetingTextareaRef.current && mode === 'meeting') {
      adjustTextareaHeight(meetingTextareaRef.current);
    }
  }, [meetingInput, mode]);

  return (
    <div className="w-full">
      {/* Tab System */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setMode('single')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            mode === 'single'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
              : 'bg-white/80 text-slate-600 hover:bg-white/90'
          }`}
        >
          <Sparkles className="h-5 w-5 inline mr-2" />
          Single Task
        </button>
        <button
          onClick={() => setMode('meeting')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            mode === 'meeting'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
              : 'bg-white/80 text-slate-600 hover:bg-white/90'
          }`}
        >
          <FileText className="h-5 w-5 inline mr-2" />
          Meeting Minutes
        </button>
      </div>

      {mode === 'single' ? (
        <form onSubmit={handleSingleSubmit} className="relative">
          <div className="relative">
            <div className="absolute left-6 top-6 z-10">
              <Sparkles className="h-6 w-6 text-indigo-500 animate-pulse" />
            </div>
            
            <textarea
              ref={textareaRef}
              value={singleInput}
              onChange={(e) => setSingleInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your task naturally... e.g., 'Finish the marketing presentation for Sarah by Friday 3pm P1'"
              className="w-full pl-16 pr-20 py-6 bg-white/90 backdrop-blur-sm border-2 border-indigo-200/50 rounded-2xl resize-none focus:outline-none text-lg placeholder:text-slate-400 input-glow shadow-xl transition-all duration-300"
              rows={1}
              style={{ minHeight: '80px' }}
            />
            
            <button
              type="submit"
              disabled={!singleInput.trim() || isLoading}
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
      ) : (
        <form onSubmit={handleMeetingSubmit} className="relative">
          <div className="relative">
            <div className="absolute left-6 top-6 z-10">
              <FileText className="h-6 w-6 text-indigo-500" />
            </div>
            
            <textarea
              ref={meetingTextareaRef}
              value={meetingInput}
              onChange={(e) => setMeetingInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste your meeting transcript here... e.g., 'Aman you take the landing page by 10pm tomorrow. Rajeev you take care of client follow-up by Wednesday. Shreya please review the marketing deck tonight.'"
              className="w-full pl-16 pr-20 py-6 bg-white/90 backdrop-blur-sm border-2 border-indigo-200/50 rounded-2xl resize-none focus:outline-none text-lg placeholder:text-slate-400 input-glow shadow-xl transition-all duration-300"
              rows={6}
              style={{ minHeight: '180px' }}
            />
            
            <div className="absolute right-4 bottom-4 flex gap-2">
              {meetingInput && (
                <button
                  type="button"
                  onClick={handleClearMeeting}
                  className="p-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 shadow-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              <button
                type="submit"
                disabled={!meetingInput.trim() || isLoading}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none font-semibold"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
                ) : null}
                Extract Tasks
              </button>
            </div>
          </div>
          
          {meetingInput && (
            <div className="absolute right-4 bottom-[-40px] text-sm text-slate-500">
              Characters: {meetingInput.length}
            </div>
          )}
        </form>
      )}

      {/* Single Task Preview */}
      {preview && mode === 'single' && (
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

      {/* Meeting Tasks Preview */}
      {showPreview && extractedTasks.length > 0 && (
        <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200/50 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              <span className="text-lg font-semibold text-indigo-700">
                Extracted Tasks ({extractedTasks.length} found)
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAllTasks}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold"
              >
                Add All Tasks
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {extractedTasks.map((task, index) => (
              <div key={index} className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-md">
                <div className="flex flex-wrap gap-3">
                  <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-md">
                    <span className="text-sm font-semibold text-slate-700">📝 {task.name}</span>
                  </div>
                  <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-md">
                    <span className="text-sm text-slate-600">👤 {task.assignee}</span>
                  </div>
                  {task.dueDate && (
                    <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-md">
                      <span className="text-sm text-slate-600">📅 {new Date(task.dueDate).toLocaleString()}</span>
                    </div>
                  )}
                  <div className={`inline-flex items-center px-4 py-2 rounded-xl priority-${task.priority.toLowerCase()} shadow-md`}>
                    <span className="text-sm font-semibold">{task.priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showPreview && extractedTasks.length === 0 && !isLoading && (
        <div className="mt-6 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200/50 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-orange-500" />
            <span className="text-lg font-semibold text-orange-700">No Tasks Found</span>
          </div>
          <p className="text-orange-600">
            No actionable tasks detected. Please check your transcript format and try again.
          </p>
        </div>
      )}
    </div>
  );
};
