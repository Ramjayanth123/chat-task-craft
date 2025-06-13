# Welcome to your Lovable project

# 🚀 AI Meeting Minutes to Task Converter

> **Transform Meeting Notes into Actionable Tasks with AI**

AI Meeting Minutes to Task Converter is an intelligent task management application that transforms natural language meeting notes into organized, actionable tasks using Google's Gemini AI. Whether you're processing meeting minutes or creating quick tasks, our app understands context, assigns priorities, and extracts multiple tasks from complex conversations.

![AI Meeting Minutes to Task Converter](https://img.shields.io/badge/Status-Active-brightgreen) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

## 📸 Application Screenshots

### Meeting Minutes Input & AI Task Extraction
![Meeting Minutes Processing](https://github.com/user-attachments/assets/meeting-input-screenshot.png)
*The app intelligently processes meeting notes and extracts multiple tasks with assignees, priorities, and due dates*

### Extracted Tasks Preview
![Task Extraction Results](https://github.com/user-attachments/assets/task-extraction-screenshot.png)
*AI-powered task extraction showing parsed tasks with priorities (P1-P4), assignees, and smart date processing*

### Task Management Dashboard
![Task Management](https://github.com/user-attachments/assets/task-dashboard-screenshot.png)
*Clean, organized task list with filtering, search, and priority-based organization*

## ✨ Features

### 🤖 AI-Powered Task Extraction
- **Gemini AI Integration**: Leverages Google's advanced AI for intelligent task parsing
- **Multi-Task Detection**: Automatically identifies and separates multiple tasks from complex input
- **Smart Context Understanding**: Recognizes assignees, priorities, and due dates from natural language
- **Intelligent Date Processing**: Defaults to current year, handles relative dates ("tomorrow", "next week")

### 📝 Dual Input Modes
- **Meeting Minutes Mode**: Process entire meeting transcripts and extract all actionable items
- **Single Task Mode**: Quick task creation with AI-powered suggestions
- **Real-time Preview**: See parsed tasks before adding them to your list

### 🎯 Smart Task Management
- **Priority Intelligence**: Automatic priority assignment (P1-P4) based on urgency keywords
- **Assignee Detection**: Identifies who should handle each task
- **Due Date Parsing**: Understands various date formats and relative time expressions
- **Task Filtering & Search**: Advanced filtering by priority, assignee, and due date

### 🎨 Modern UI/UX
- **Beautiful Interface**: Clean, modern design with gradient backgrounds
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Instant task preview and validation
- **Intuitive Controls**: Easy-to-use buttons and forms

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with custom gradients and animations
- **UI Components**: shadcn/ui for consistent, accessible components
- **AI Integration**: Google Gemini API for natural language processing
- **Icons**: Lucide React for beautiful, consistent icons

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key (for AI features)

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd chat-task-craft

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Gemini API key to .env:
# VITE_GEMINI_API_KEY=your_api_key_here

# Start development server
npm run dev
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Getting a Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and paste it into your `.env` file

## 📖 Usage Examples

### Meeting Minutes Processing

**Input:**
```
Aman you take the landing page tomorrow by 10am. P1
Harika prepare dinner by 9pm today. P2
Ram book flight tickets on june 27th P4
```

**AI Output:**
- ✅ **Task 1**: Take the landing page | Assignee: Aman | Due: 6/14/2025, 10:00:00 AM | Priority: P1
- ✅ **Task 2**: Prepare dinner | Assignee: Harika | Due: 6/13/2025, 9:00:00 PM | Priority: P2  
- ✅ **Task 3**: Book flight tickets | Assignee: Ram | Due: 6/27/2025, 5:30:00 AM | Priority: P4

### Real-Time Task Management

The application provides:
- **Instant Preview**: See extracted tasks before adding them
- **Smart Filtering**: Filter by priority, assignee, or due date
- **Task Organization**: Automatic sorting and categorization
- **Progress Tracking**: Visual indicators for task completion
## 🎯 Key Features in Detail

### Intelligent Priority Assignment
- **P1 (Urgent)**: Keywords like "urgent", "ASAP", "critical"
- **P2 (Important)**: Project deadlines, important meetings
- **P3 (Normal)**: Regular tasks and assignments
- **P4 (Low)**: Nice-to-have items, future considerations

### Smart Date Processing
- **Current Year Default**: All dates default to current year unless specified
- **Relative Dates**: "tomorrow", "next week", "in 3 days"
- **Natural Language**: "by Friday", "end of month", "next Monday"
- **Explicit Dates**: "June 15th", "2024-12-25", "Dec 1st"

### Advanced Text Processing
- **Multi-sentence Parsing**: Extracts multiple tasks from complex sentences
- **Context Awareness**: Understands pronouns and implicit references
- **Abbreviation Handling**: Recognizes common abbreviations and informal language
- **Compound Task Splitting**: Separates "do X and Y" into separate tasks

## 🔧 Development

### Project Structure

```
src/
├── components/          # React components
│   ├── TaskInputForm.tsx   # Main input interface with dual modes
│   ├── TaskList.tsx        # Task display and management
│   ├── TaskCard.tsx        # Individual task component
│   ├── TaskManager.tsx     # Main task management container
│   ├── TaskEditModal.tsx   # Task editing functionality
│   ├── FilterBar.tsx       # Advanced filtering controls
│   ├── PriorityBadge.tsx   # Priority display component
│   └── ui/                 # shadcn/ui components
├── services/
│   └── geminiService.ts    # AI integration service
├── utils/
│   ├── taskParser.ts       # Basic task parsing utilities
│   └── meetingParser.ts    # Meeting transcript processing
├── types/
│   └── Task.ts            # TypeScript type definitions
├── hooks/                 # Custom React hooks
│   ├── use-mobile.tsx     # Mobile detection hook
│   └── use-toast.ts       # Toast notification hook
├── pages/
│   ├── Index.tsx          # Main application page
│   └── NotFound.tsx       # 404 error page
└── lib/
    └── utils.ts           # Utility functions
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🌐 Deployment

### Lovable Platform
Simply open [Lovable](https://lovable.dev/projects/171990e7-6c90-4bfd-b4a4-9e11c8ae658e) and click on Share → Publish.

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy the dist/ folder to your hosting platform
# (Vercel, Netlify, GitHub Pages, etc.)
```

### Environment Variables for Production
Make sure to set your environment variables in your hosting platform:
- `VITE_GEMINI_API_KEY`: Your Google Gemini API key

## 🔒 Security & Privacy

- **API Key Security**: Environment variables keep your API keys secure
- **No Data Storage**: Tasks are processed locally, no data sent to external servers
- **Privacy First**: Your meeting content and tasks remain private

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🎉 Acknowledgments

- Google Gemini AI for powerful natural language processing
- shadcn/ui for beautiful, accessible components
- Tailwind CSS for rapid styling
- The React and TypeScript communities

---

**Made with ❤️ by the AI Meeting Minutes to Task Converter Team**
