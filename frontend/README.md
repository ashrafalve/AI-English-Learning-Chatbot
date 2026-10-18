# BRIMSEL AI English Learning Chatbot — Frontend

An interactive, accessibility-focused English learning companion for children under 7, built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## 🌟 Key Features

1. **Progressive Learning Engine**:
   - Level 1 (Beginner): Alphabet, colors, numbers, animals, everyday objects.
   - Level 2 (Elementary): Sentences, verbs, questions, plural forms.
   - Level 3 (Story & Comprehension): Simple storytelling and polite conversation.
2. **Four Mode-Aware Experiences**:
   - `LEARNING`: Lesson questions, multiple choice buttons, hints, and explanations.
   - `CONVERSATION`: Natural, playful dialogue with Buddy.
   - `ENGAGEMENT`: Interactive language games and animal guessing activities.
   - `SUPPORT`: Gentle, reassuring language and emotional comfort.
3. **Child-Friendly Design & Mascot**:
   - Original vector mascot **Buddy** with dynamic emotions (happy, thinking, excited, supportive).
   - High-contrast, warm cream palette (`#FFFDF7`) with sky blue, coral, and amber accents.
4. **Speech & Audio (Text-to-Speech)**:
   - Browser-native speech synthesis with pause/play controls, calibrated for gentle and slow English pronunciation.
5. **Progress & Persistence**:
   - Client-side `localStorage` caching with safe hydration.
   - Progress reset modal with confirmation.
6. **Graceful Fallback & Fast Latency**:
   - Fully functional even when offline or without external AI keys.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ or 20+
- Running backend on `http://127.0.0.1:8000`

### 2. Environment Configuration
Create `.env.local` inside `frontend/`:
```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

### 3. Install & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🌐 Deployment (Vercel)
1. Push repository to GitHub.
2. Import `frontend/` project into Vercel.
3. Add environment variable:
   - `NEXT_PUBLIC_API_BASE_URL`: URL of your deployed FastAPI backend (e.g., `https://your-backend.onrender.com`).
4. Ensure your backend has `CORS_ORIGINS` configured to include your Vercel deployment URL.
