# Moodelix

A todo app that also tracks your mood. Built with Next.js, TypeScript, and Tailwind CSS.

## What it does

- **Todos**: Add, complete, delete tasks
- **Mood tracking**: Log how you're feeling each day
- **Simple analytics**: See your mood patterns over time
- **Local storage**: Your data stays in your browser
- **Responsive**: Works on desktop and mobile

## Getting started

### Prerequisites
- Node.js 18+ 
- Basic knowledge of HTML/CSS/JS

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the dev server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser

## Project structure

```
moodelix/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind config
├── tsconfig.json          # TypeScript config
└── README.md              # This file
```

## Key concepts

### Next.js App Router
- `app/` directory: New way to organize Next.js apps
- `layout.tsx`: Wraps all pages
- `page.tsx`: Page content

### React Hooks
- `useState`: Manages component state
- `useEffect`: Handles side effects

### TypeScript
- Interfaces define data shapes
- Catches errors before runtime

### Tailwind CSS
- Utility classes for quick styling
- Responsive design with breakpoints

## How it works

1. User input updates React state
2. State changes trigger localStorage saves
3. Page loads restore data from localStorage
4. UI re-renders with new data

## Ideas to try

- Add due dates to todos
- Create mood categories
- Add data export
- Implement dark mode
- Add todo priorities

## Next steps

- Add a real database
- User authentication
- API routes
- Deploy to Vercel/Netlify

## Contributing

This is a learning project. Feel free to:
- Ask questions
- Suggest improvements
- Experiment with features
- Share what you learn

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org/docs)

---

Built with Next.js, TypeScript, and Tailwind CSS. Happy coding!
