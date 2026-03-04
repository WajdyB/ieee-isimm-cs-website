# IEEE Computer Society ISIMM Website

A modern, full-featured website for the IEEE Computer Society ISIMM Student Branch, built with Next.js 16 and MongoDB. This platform serves as the digital hub for the chapter, showcasing activities, managing events, tracking member engagement through XP gamification, and coordinating projects via the Projects Hub.

---

## 🌟 Overview

The IEEE CS ISIMM website is designed to inspire, engage, and empower students in computer science and engineering. It provides a professional online presence while offering powerful administrative tools and member engagement features.

---

## ✨ Key Features

### Public-Facing Features
- **Dynamic Homepage** - Hero section with mission statement, "CS ISIMM in Numbers" stats (+40 members, +3 awards, +30 events/year, +100 participants), focus areas, and recent events
- **About Page** - Interactive strategic roadmap with mission, vision, core values; "Get Involved" links to recruitment form
- **Our Activities** - Browse events in two categories: **Upcoming** (with registration links) and **Previous** (with photo galleries)
- **Executive Committee** - Meet the leadership team with social media links
- **Projects Portfolio** - Showcase chapter projects with GitHub and live demo links
- **Responsive Design** - Fully optimized for mobile, tablet, and desktop devices

### Admin Dashboard (`/admin`)
- **Event Management** - Create events as "Previous" or "Upcoming"; upcoming events require a registration link; previous events track attendees
- **Image Storage** - MongoDB GridFS integration for scalable media handling
- **XP System Management** - Complete member gamification platform (leaderboard, add/edit members, award XP)
- **Projects Hub** - Create projects with deadline, assign members from XP system, track GitHub repo submissions
- **Secure Authentication** - Password-protected admin access

### Member Portal (`/member`)
- **Personal Dashboard** - Track XP, level, and achievements
- **Leaderboard** - See global rankings and compare progress
- **Activity History** - Review all XP gains and milestones
- **Achievement System** - Unlock badges for reaching goals
- **Password Change** - Replace temporary password with a personal one
- **My Projects** - View assigned projects from Projects Hub, submit GitHub repo links before deadline

---

## 🏆 XP Gamification System

A comprehensive system to boost member engagement and reward participation in chapter activities.

### Core Concepts

- **Experience Points (XP)** - Earned through event attendance and contributions
- **Levels** - Automatic progression (100 XP = 1 Level)
- **Achievements** - Unlock badges at XP and level milestones
- **Leaderboard** - Real-time member rankings
- **Rewards** - Track and redeem benefits

### For Administrators

**Member Management:**
1. Navigate to `/admin` and login
2. Go to "XP System" tab
3. Click "Add Member" to create new profiles
4. System generates secure temporary password
5. Copy credentials and send to member

**Awarding XP:**
1. Find member in leaderboard
2. Click "Add XP" button
3. Enter XP amount and reason
4. Optionally specify event name
5. System automatically:
   - Updates member level
   - Unlocks achievements
   - Logs activity history

**Suggested XP Values:**
- Workshop Attendance: 50 XP
- Event Participation: 100 XP
- Competition Entry: 150 XP
- Competition Win: 300 XP
- Project Contribution: 200 XP
- Presentation/Talk: 150 XP

### For Members

**Accessing Your Dashboard:**
1. Click "Member Portal" in website header
2. Login with credentials from admin
3. View personal stats and achievements
4. Track progress to next level
5. See your ranking on leaderboard

**Dashboard Features:**
- Current level with progress bar
- Total XP earned
- Global rank position
- Unlocked achievements showcase
- Complete activity history
- Top 10 leaderboard view

### Achievement System

**XP Milestones:**
- 🎯 **First Steps** (100 XP)
- ⭐ **Getting Started** (500 XP)
- 🏆 **Committed Member** (1,000 XP)
- 💎 **Dedicated** (2,000 XP)
- 👑 **Legend** (5,000 XP)

**Level Milestones:**
- 🌟 **Rising Star** (Level 5)
- 🎖️ **Expert** (Level 10)
- 🏅 **Master** (Level 20)
- 👑 **Grandmaster** (Level 50)

Achievements unlock automatically when thresholds are reached!

---

## 📂 Projects Hub

A project management system for tracking member contributions and code submissions.

### For Administrators

**Creating Projects:**
1. Navigate to Admin → "Projects Hub" tab
2. Click "Add Project"
3. Enter title, description, and deadline
4. Select members to assign (from XP system)
5. Members see assigned projects in their dashboard

**Tracking Submissions:**
- View which members have submitted their GitHub repos
- Click links to view submitted repositories
- Edit or delete projects as needed

### For Members

**Submitting Work:**
1. Log in to Member Dashboard
2. Scroll to "My Projects"
3. For each assigned project, paste your GitHub repo URL
4. Click "Submit" before the deadline
5. Update submission by submitting again (overwrites previous)

**Notes:**
- Only valid `https://github.com/...` URLs are accepted
- Submissions are locked after the deadline
- One submission per member per project

---

## 📅 Events & Our Activities

Events are categorized into two types:

**Upcoming Events**
- Created by admin with event type "Upcoming"
- Require a registration link (e.g., Google Forms)
- Display "Register Now" button linking to registration
- No photo gallery (event hasn't happened yet)

**Previous Events**
- Created by admin with event type "Previous"
- Include attendee count
- Click to open lightbox with photo gallery
- Backward compatible: existing events without type default to "Previous"

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript + React 18
- **Database:** MongoDB with GridFS
- **Styling:** Tailwind CSS + shadcn/ui
- **Forms:** React Hook Form + Zod validation
- **Authentication:** bcryptjs for password hashing
- **Notifications:** Sonner toast library
- **Icons:** Lucide React

---

## 🎨 Design System

- **Primary Color:** Orange (#f97316)
- **Font:** Inter (Google Fonts)
- **Components:** shadcn/ui with Radix UI primitives
- **Animations:** Custom CSS animations with Intersection Observer
- **Theme:** Light mode optimized for accessibility


---


## 🤝 Contributing

This is an internal project for IEEE CS ISIMM Student Branch. For suggestions or bug reports, contact the chapter webmaster.

---

## 📄 License

All rights reserved by IEEE Computer Society ISIMM Student Branch.

---

## 👥 Current Executive Committee (2025-2026)

- **Chairwoman:** Yosr Hadj Ali
- **Vice Chair:** Mariem Ben Nasr
- **Secretary:** Yessine Choieche
- **Treasurer:** Ahmed Brahem
- **Webmaster:** Yassine Mansour

---

## 📧 Contact

- **Website:** [https://cs-isimm.org](https://cs-isimm.org)
- **Facebook:** [IEEE CS ISIMM](https://www.facebook.com/ieee.cs.isimm)
- **Instagram:** [@ieee.cs.isimm](https://www.instagram.com/ieee.cs.isimm)
- **Email:** contact@cs-isimm.org

---

Built with ❤️ by IEEE CS ISIMM | Empowering Students in Computer Science
