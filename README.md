# TaskFlow - AI-Powered Task Management

A modern, intelligent task management application that combines the power of AI with intuitive design to help you organize and manage your tasks efficiently.

## 🚀 Features

### 🤖 AI-Powered Task Creation
- **Gemini AI Integration**: Intelligent task parsing from natural language input
- **Smart Suggestions**: Real-time AI suggestions as you type
- **Date Recognition**: Automatic detection and validation of due dates
- **Priority Assignment**: AI-assisted priority level suggestions

### 📝 Dual Input Modes
- **Single Task Mode**: Create individual tasks with AI assistance
- **Meeting Minutes Mode**: Extract multiple tasks from meeting transcripts
- **Bulk Task Creation**: Process multiple tasks at once from structured text

### 🎯 Task Management
- **Visual Task Cards**: Clean, modern task display with priority indicators
- **Advanced Filtering**: Filter by priority, assignee, status, and due date
- **Search Functionality**: Quick search across all task fields
- **Status Tracking**: Mark tasks as pending, in progress, or completed

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Beautiful Gradients**: Eye-catching gradient backgrounds
- **Smooth Animations**: Polished interactions and transitions
- **Dark/Light Theme**: Adaptive design for any preference

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Gemini API key from Google AI Studio

### Installation

```bash
# Clone the repository
git clone https://github.com/Ramjayanth123/chat-task-craft.git

# Navigate to project directory
cd chat-task-craft

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Setup

Create a `.env` file in the root directory and add your Gemini API key:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

**Getting a Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env` file

### Running the Application

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Technologies Used

This project is built with modern web technologies:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for utility-first styling
- **UI Components**: Custom components with modern design
- **AI Integration**: Google Gemini AI for intelligent task processing
- **State Management**: React hooks for local state management
- **Date Handling**: Advanced date parsing and validation
- **Responsive Design**: Mobile-first approach

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── TaskInputForm.tsx   # Main input form with AI integration
│   ├── TaskManager.tsx     # Task management and display
│   └── TaskCard.tsx        # Individual task card component
├── services/            # External service integrations
│   └── geminiService.ts    # Gemini AI service
├── utils/              # Utility functions
│   ├── dateUtils.ts       # Date parsing and validation
│   └── meetingParser.ts   # Meeting transcript parsing
├── types/              # TypeScript type definitions
│   └── index.ts           # Shared types
└── App.tsx             # Main application component
```

## 🚀 Deployment

The application can be deployed to various platforms:

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build the project
npm run build

# Deploy dist folder to Netlify
```

### GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d dist"

# Build and deploy
npm run build
npm run deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Google Gemini AI for intelligent task processing
- React community for excellent documentation
- Tailwind CSS for beautiful styling utilities
- All contributors who help improve this project
