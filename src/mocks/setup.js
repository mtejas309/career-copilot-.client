import MockAdapter from 'axios-mock-adapter'
import api from '../api/axios'

const mock = new MockAdapter(api, { delayResponse: 700 })

const MOCK_USER = { id: 1, name: 'Tejas M', email: 'tejas@demo.com' }
const MOCK_TOKEN = 'mock-token-abc123'

// ── AUTH ──────────────────────────────────────────────────────────────────────

mock.onPost('/auth/signup').reply(201, { token: MOCK_TOKEN, user: MOCK_USER })

mock.onPost('/auth/login').reply((config) => {
  const { email, password } = JSON.parse(config.data)
  if (email && password?.length >= 6)
    return [200, { token: MOCK_TOKEN, user: { ...MOCK_USER, email } }]
  return [401, { error: 'Invalid email or password' }]
})

mock.onGet('/auth/me').reply(200, {
  ...MOCK_USER,
  createdAt: new Date().toISOString(),
})

// ── PROFILE ───────────────────────────────────────────────────────────────────

const mockProfile = {
  id: 1,
  userId: 1,
  education: 'B.Tech Computer Science',
  skills: ['JavaScript', 'React', 'Node.js', 'Python'],
  interests: ['AI', 'Web Dev', 'Open Source'],
  careerGoal: 'Senior Full-Stack Engineer at a product company',
  salaryGoal: 1200000,
  dailyStudyHours: 2,
}

mock.onGet('/profile').reply(200, mockProfile)
mock.onPut('/profile').reply((config) => {
  const body = JSON.parse(config.data)
  Object.assign(mockProfile, body)
  return [200, { ...mockProfile, ...body }]
})

// ── RESUME ────────────────────────────────────────────────────────────────────

const mockResume = {
  id: 1,
  userId: 1,
  fileUrl: 'uploads/mock-resume.pdf',
  rawText: 'Tejas M — Software Engineer with 2 years experience...',
  analysisJson: {
    skills: ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS', 'Git', 'REST APIs'],
    missingSkills: ['TypeScript', 'Docker', 'AWS', 'System Design', 'GraphQL'],
    experience: '2 years of full-stack web development experience across freelance and internship roles.',
    strengths: [
      'Strong React and frontend fundamentals',
      'Good problem solving and DSA foundation',
      'Experience shipping real production projects',
    ],
    weaknesses: [
      'Limited cloud and DevOps exposure',
      'No TypeScript in production projects',
      'System design knowledge needs growth',
    ],
    recommendations: [
      'Learn TypeScript — most senior roles require it',
      'Build 1–2 projects using AWS or Docker to fill the DevOps gap',
      'Practice system design with Grokking the System Design Interview',
      'Contribute to open source to strengthen your GitHub profile',
    ],
  },
  createdAt: new Date().toISOString(),
}

mock.onPost('/resume/upload').reply(201, mockResume)
mock.onGet('/resume/analysis').reply(200, mockResume)

// ── ROADMAP ───────────────────────────────────────────────────────────────────

const mockRoadmap = {
  id: 1,
  userId: 1,
  title: 'Senior Full-Stack Engineer Roadmap',
  goal: 'Land a senior full-stack role in 3 months',
  duration: 12,
  generatedAt: new Date().toISOString(),
  weeks: [
    {
      id: 1,
      weekNumber: 1,
      theme: 'TypeScript Foundations',
      resources: ['TypeScript Handbook', 'Total TypeScript', 'Matt Pocock YouTube'],
      goals: [
        { id: 1, title: 'Complete TypeScript basics course (types, interfaces, generics)', completed: false, completedAt: null },
        { id: 2, title: 'Migrate one personal project to TypeScript', completed: false, completedAt: null },
        { id: 3, title: 'Read: TypeScript Deep Dive chapters 1–4', completed: false, completedAt: null },
      ],
    },
    {
      id: 2,
      weekNumber: 2,
      theme: 'Advanced React Patterns',
      resources: ['TanStack Query docs', 'Patterns.dev', 'Kent C. Dodds blog'],
      goals: [
        { id: 4, title: 'Learn React Query for server state management', completed: false, completedAt: null },
        { id: 5, title: 'Build a data-fetching layer using React Query', completed: false, completedAt: null },
        { id: 6, title: 'Study compound components and render props patterns', completed: false, completedAt: null },
      ],
    },
    {
      id: 3,
      weekNumber: 3,
      theme: 'Node.js & Backend Depth',
      resources: ['Node.js docs', 'Bulletproof Node.js Architecture', 'TestingJavaScript.com'],
      goals: [
        { id: 7, title: 'Build a REST API with Express + TypeScript', completed: false, completedAt: null },
        { id: 8, title: 'Add JWT authentication and role-based access', completed: false, completedAt: null },
        { id: 9, title: 'Write integration tests with Jest + Supertest', completed: false, completedAt: null },
      ],
    },
    {
      id: 4,
      weekNumber: 4,
      theme: 'Docker & Cloud Basics',
      resources: ['Docker docs', 'AWS free tier', 'Fireship Docker course'],
      goals: [
        { id: 10, title: 'Dockerize your Node.js application', completed: false, completedAt: null },
        { id: 11, title: 'Deploy to AWS EC2 with a basic CI/CD pipeline', completed: false, completedAt: null },
        { id: 12, title: 'Set up monitoring with CloudWatch', completed: false, completedAt: null },
      ],
    },
  ],
}

// track goal state in memory for toggling
const goalMap = {}
mockRoadmap.weeks.forEach((w) => w.goals.forEach((g) => { goalMap[g.id] = g }))

mock.onGet('/roadmap').reply(404, { error: 'No roadmap found' })
mock.onPost('/roadmap/generate').reply(201, mockRoadmap)
mock.onPatch(/\/roadmap\/goals\/\d+/).reply((config) => {
  const id = Number(config.url.split('/').pop())
  const goal = goalMap[id]
  if (!goal) return [404, { error: 'Goal not found' }]
  goal.completed = !goal.completed
  goal.completedAt = goal.completed ? new Date().toISOString() : null
  return [200, { ...goal }]
})

// ── CHAT ──────────────────────────────────────────────────────────────────────

const chatHistory = []
let chatIdCounter = 1

const REPLIES = {
  week:      'This week focus on **TypeScript Foundations** (Week 1 of your roadmap). You have 3 goals pending. Start with the TypeScript Handbook — about 3 hrs total. At 2 hrs/day you can finish in 2 days!',
  focus:     'This week focus on **TypeScript Foundations** (Week 1 of your roadmap). You have 3 goals pending. Start with the TypeScript Handbook — about 3 hrs total. At 2 hrs/day you can finish in 2 days!',
  gap:       'Your biggest skill gaps are **TypeScript**, **Docker/AWS**, and **System Design**. TypeScript is highest ROI right now — most senior roles require it and it makes your existing React/Node skills much stronger.',
  skill:     'Your biggest skill gaps are **TypeScript**, **Docker/AWS**, and **System Design**. TypeScript is highest ROI right now — most senior roles require it and it makes your existing React/Node skills much stronger.',
  progress:  "You're at Week 1 of your 12-week roadmap with 0 goals completed so far. Your goal is Senior Full-Stack Engineer. The first milestone is TypeScript — you're well-positioned since you already know JavaScript deeply. Want a plan for today?",
  roadmap:   "You're at Week 1 of your 12-week roadmap with 0 goals completed so far. Your goal is Senior Full-Stack Engineer. The first milestone is TypeScript — you're well-positioned since you already know JavaScript deeply. Want a plan for today?",
  resource:  'Top free resources for your goal: **TypeScript Handbook** (official), **Matt Pocock YouTube** (best practical TS content), **Fireship.io** for Docker basics. Want a day-by-day Week 1 schedule?',
  suggest:   'Top free resources for your goal: **TypeScript Handbook** (official), **Matt Pocock YouTube** (best practical TS content), **Fireship.io** for Docker basics. Want a day-by-day Week 1 schedule?',
  motivat:   "You've got this! You already have real shipping experience — that's rare and valuable. The gap between you and a senior role is mostly TypeScript + cloud exposure, and that's 100% learnable in 12 weeks. What's blocking you?",
  stuck:     "You've got this! You already have real shipping experience — that's rare and valuable. The gap between you and a senior role is mostly TypeScript + cloud exposure, and that's 100% learnable in 12 weeks. What's blocking you?",
}

const DEFAULT_REPLY = "Based on your profile and roadmap, I'd suggest focusing on TypeScript this week — it's the biggest gap between your current skills and your senior engineer goal. Want me to break down a study plan for it?"

mock.onGet('/chat/history').reply(200, chatHistory)

mock.onPost('/chat/message').reply((config) => {
  const { content } = JSON.parse(config.data)

  const userMsg = { id: chatIdCounter++, role: 'user', content, createdAt: new Date().toISOString() }
  chatHistory.push(userMsg)

  const lower = content.toLowerCase()
  const replyText = Object.entries(REPLIES).find(([key]) => lower.includes(key))?.[1] ?? DEFAULT_REPLY

  const assistantMsg = { id: chatIdCounter++, role: 'assistant', content: replyText, createdAt: new Date().toISOString() }
  chatHistory.push(assistantMsg)

  return [200, assistantMsg]
})

mock.onDelete('/chat/history').reply(() => {
  chatHistory.length = 0
  return [200, { message: 'Chat history cleared' }]
})

console.log('[Mock API] Active — all requests intercepted locally')
