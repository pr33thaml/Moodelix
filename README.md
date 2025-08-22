# Moodelix 🎯✨

A beautiful and modern web application that combines todo management with mood tracking. Built with Next.js, React, TypeScript, and Tailwind CSS.

## ✨ Features

- **📝 Todo Management**: Add, complete, and delete todos with a clean interface
- **😊 Mood Tracking**: Track your daily moods with beautiful icons and notes
- **📊 Mood Analytics**: Visual representation of your mood patterns
- **💾 Local Storage**: Data persists in your browser
- **📱 Responsive Design**: Works perfectly on all devices
- **🎨 Modern UI**: Beautiful gradients, smooth animations, and intuitive design

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed on your machine
- Basic understanding of HTML, CSS, and JavaScript (we'll learn the rest!)

### Installation

1. **Install dependencies** (this downloads all the packages we need):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and go to `http://localhost:3000`

## 🏗️ Project Structure

```
moodelix/
├── app/                    # Next.js app directory (new App Router)
│   ├── globals.css        # Global styles with Tailwind CSS
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── package.json           # Project dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file!
```

## 🎓 Learning Concepts

### 1. **Next.js App Router**
- **`app/` directory**: New way to organize Next.js apps
- **`layout.tsx`**: Wraps all pages (like a template)
- **`page.tsx`**: The actual page content

### 2. **React Hooks**
- **`useState`**: Manages component state (todos, moods, input fields)
- **`useEffect`**: Handles side effects (loading/saving data)

### 3. **TypeScript**
- **Interfaces**: Define data shapes (Todo, MoodEntry)
- **Type safety**: Catch errors before running the app

### 4. **Tailwind CSS**
- **Utility classes**: Quick styling without writing custom CSS
- **Responsive design**: `lg:grid-cols-2` means "2 columns on large screens"

### 5. **Local Storage**
- **Browser persistence**: Data stays between page refreshes
- **JSON serialization**: Convert objects to strings for storage

## 🔧 How It Works

### Data Flow
1. **User Input** → React state updates
2. **State Change** → useEffect saves to localStorage
3. **Page Load** → useEffect loads from localStorage
4. **UI Updates** → React re-renders with new data

### Key Functions
- **`addTodo()`**: Creates new todo, updates state
- **`toggleTodo()`**: Marks todo as complete/incomplete
- **`addMood()`**: Records new mood entry
- **`getMoodStats()`**: Calculates mood percentages

## 🎨 Customization Ideas

Try these modifications to learn more:

1. **Add due dates** to todos
2. **Create mood categories** (work, personal, health)
3. **Add data export** functionality
4. **Implement dark mode** toggle
5. **Add todo priority levels**

## 📚 Next Steps

After understanding this project, explore:

- **Backend Development**: Add a real database (PostgreSQL, MongoDB)
- **Authentication**: User login/signup with NextAuth.js
- **API Routes**: Create REST endpoints in `app/api/`
- **Deployment**: Deploy to Vercel, Netlify, or AWS

## 🤝 Contributing

This is a learning project! Feel free to:
- Ask questions about any part of the code
- Suggest improvements
- Experiment with different features
- Share what you've learned

## 📖 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Happy coding! 🚀** 

Remember: The best way to learn is to build, break, and rebuild. Don't be afraid to experiment!
