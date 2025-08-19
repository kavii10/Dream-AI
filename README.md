# Dream Mentor AI

An end-to-end skill/roadmap generator for any career dream using ESCO data (React frontend + FastAPI backend).

## Features

- Type any dream/target job, get matching official roles.
- Click to see a detailed, stepwise, expandable skill and knowledge roadmap.
- Clean, modern, responsive UI.

## Quickstart

1. Start the backend:
    ```
    cd backend
    uvicorn app:app --reload
    ```
2. Start the frontend:
    ```
    cd frontend
    npm install
    npm start
    ```
3. Open http://localhost:3000

## Folder Structure

- `/backend`: Python FastAPI backend, loads and serves ESCO data.
- `/frontend`: React, Axios-powered UI.
- `/esco_data`: Your ESCO CSV files.

## Customize

- Add your dataset or map ESCO IDs to Indian standards for better localization.
- Style using Tailwind, Chakra UI, or your preferred package.
- Deploy easily to Render, Vercel, Heroku, etc.
