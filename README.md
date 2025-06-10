# Supabase Onboarding Demo

A simple landing page with an onboarding flow built with Next.js and Supabase.

## Features

- 🎨 Modern landing page with hero section
- 🔐 Authentication with Supabase Auth
- 📝 User onboarding flow
- 💾 Data persistence with Supabase Database
- ⚡ Server-side rendering with Next.js 13+
- 🎭 Beautiful UI with Tailwind CSS
- 📱 Responsive design

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API and copy your project URL and anon key
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set up Database

Run this SQL in your Supabase SQL editor to create the profiles table:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  company text,
  role text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policy to allow users to see their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

-- Create policy to allow users to update their own profile
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Create policy to allow users to insert their own profile
create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
├── app/                  # Next.js 13+ app directory
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── onboarding/      # Onboarding flow pages
├── components/          # Reusable components
│   ├── providers/       # Context providers
│   ├── ui/             # UI components
│   └── ...             # Page components
├── lib/                # Utility functions
│   ├── supabase.ts     # Supabase client
│   └── utils.ts        # Helper functions
└── ...
```

## Features Overview

### Landing Page
- Hero section with compelling copy
- Feature highlights
- Call-to-action buttons
- Responsive design

### Authentication
- Email/password signup
- Magic link authentication
- Social auth (Google, GitHub)
- Protected routes

### Onboarding Flow
- Welcome step
- Profile information collection
- Company details
- Role selection
- Preferences setup

### User Dashboard
- Profile overview
- Settings management
- Data visualization

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/supabase-onboarding-demo)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE). 