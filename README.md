# Student Progress Tracker

An app that allows teachers to track student progress through time. The app helps teachers and parents know how their child is doing with certain criteria, and where they need to grow more. 

🔗 **Live demo:** https://student-progress-app-eight.vercel.app/

![Dashboard](.src/assets/student-progress-app.png)



## What this project demonstrates
Full-stack app with authentication, row-level security, and a data-driven dashboard.

## The problem I solved: 60 hours per teacher


The big problem I solved for our school is the current manual progress reporting process for parent interviews and our lack of a system for how kids are doing academically :
~2 hours per day
Sustained over ~1 month per cycle
Total: ~60 hours per teacher per cycle
Includes work during normal hours when available, plus ~1 hour after work each day
Boss/principal also contributes time during the day
Before building, I conducted informal user research with a licensed kindergarten teacher at my school to understand the current workflow. She revealed the manual reporting process consumed roughly 2 hours per day over a month-long cycle — ~60 hours per teacher per student interview cycle. This baseline metric will be measured against post-deployment usage to quantify time savings.

## Architecture and notable decisions
Append-only by design, enforced at the database. Only SELECT and INSERT — no UPDATE or DELETE policies exist — so evaluation history is structurally impossible to destroy, even by a buggy client.
Rating forgery prevention, verified. RLS with check (`auth.uid() = user_id`) means a teacher can't submit a rating as another teacher — tested by attempting an insert as a real second user and getting a  `42501`  policy violation.
Chose not to build multi-teacher averaging. User research showed our school converges on a shared judgment, so last-write-wins already fit. 
Derived state over stored state — current rating is computed from the append-only log, not stored.
Custom hooks ( `useFetch<T>`, `useRateStudent`) separating data/logic from UI.


## Stack

React, TypeScript, Vite, Tailwind CSS, Supabase, deployed on Vercel.

## Local setup

```bash
git clone https://github.com/MatthewRSouth/student-progress-app
cd student-progress-app
npm install
```

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_KEY=your_anon_key
```

```bash
npm run dev
```



## Planned for v2
-Better UX/UI for auth and sign-in
-Admins to add students and criteria by themselves
-AI summaries of the students progress
-Student pages where they can see graphs of their progress over time
-An improved modal window for teachers to add scores 

## What I learned

**Plan before coding.** Planning what you're going to do before any coding is the most valuable use of time. I'd plan the project and think it through, but in individual coding sessions I'd often sit down and start with a mediocre plan. With this app I planned every session — mapping data, thinking the UI through, and most importantly really planning the auth.

**Reusable components and data.** This dashboard has many colors that get used repeatedly, and building it taught me the value of the DRY principle and how to map over objects to reuse them. I planned for reusable components from day one, having learned from my previous app to make a component reusable if you'll use it more than once.

**Small slices.** Splitting the app into the smallest slices I could was the most valuable lesson. This was a blank canvas a few weeks ago and it seemed like a gigantic undertaking. I started with the smallest snippet I could think of and kept building small pieces every day, and slowly the app took shape and became something genuinely usable for my school.


