// API service functions for admin operations

export interface LoginCredentials {
  email: string
  password: string
}

export interface EventData {
  title: string
  description: string
  date: string
  location: string
  attendees?: number
  images?: string[] // URLs returned from /api/upload, now served from MongoDB GridFS
  eventType?: 'previous' | 'upcoming' // Type of event
  registrationLink?: string // Registration link for upcoming events
}

// Authentication
export async function loginAdmin(credentials: LoginCredentials) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  return response.json()
}

// Image Upload
export async function uploadImages(files: File[]) {
  const formData = new FormData()
  
  files.forEach((file) => {
    formData.append('files', file)
  })

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  const result = await response.json()
  
  // Extract URLs from the response for backward compatibility
  if (result.success && result.files) {
    result.urls = result.files.map((file: { url: string; id: string; filename: string }) => file.url)
  }
  
  return result
}

// Specification book (PDF) upload
export async function uploadSpecificationBook(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/upload/specification', {
    method: 'POST',
    body: formData,
  })

  return response.json()
}

// Events API
export async function getEvents() {
  const response = await fetch('/api/events')
  const data = await response.json()
  return data
}

export async function createEvent(eventData: EventData) {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  })

  return response.json()
}

export async function deleteEvent(id: string) {
  const response = await fetch(`/api/events/${id}`, {
    method: 'DELETE',
  })

  return response.json()
}

// Members API
export interface MemberData {
  firstName: string
  lastName: string
  email: string
  xp?: number
}

export async function getMembers() {
  const response = await fetch('/api/members')
  return response.json()
}

export async function getMember(id: string) {
  const response = await fetch(`/api/members/${id}`)
  return response.json()
}

export async function createMember(memberData: MemberData) {
  const response = await fetch('/api/members', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(memberData),
  })
  return response.json()
}

export async function updateMember(id: string, memberData: Partial<MemberData>) {
  const response = await fetch(`/api/members/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(memberData),
  })
  return response.json()
}

export async function deleteMember(id: string) {
  const response = await fetch(`/api/members/${id}`, {
    method: 'DELETE',
  })
  return response.json()
}

export async function addXP(id: string, xpToAdd: number, reason?: string, eventName?: string) {
  const response = await fetch(`/api/members/${id}/xp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ xpToAdd, reason, eventName }),
  })
  return response.json()
}

export async function loginMember(email: string, password: string) {
  const response = await fetch('/api/members/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  return response.json()
}

export async function changeMemberPassword(id: string, currentPassword: string, newPassword: string) {
  const response = await fetch(`/api/members/${id}/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  return response.json()
}

// Projects Hub API (assignments: assign available projects to members)
export interface ProjectAssignmentData {
  availableProjectId: string
  deadline: string
  memberIds?: string[]
}

export async function getProjects(memberId?: string) {
  const url = memberId ? `/api/projects?memberId=${memberId}` : '/api/projects'
  const response = await fetch(url)
  return response.json()
}

export async function getProject(id: string) {
  const response = await fetch(`/api/projects/${id}`)
  return response.json()
}

export async function createProject(projectData: ProjectAssignmentData) {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  })
  return response.json()
}

export async function updateProject(id: string, projectData: Partial<ProjectAssignmentData>) {
  const response = await fetch(`/api/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  })
  return response.json()
}

export async function deleteProject(id: string) {
  const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
  return response.json()
}

export async function submitProject(projectId: string, memberId: string, githubRepo: string) {
  const response = await fetch(`/api/projects/${projectId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberId, githubRepo }),
  })
  return response.json()
}

// XP Guide API
export async function getXPGuide() {
  const response = await fetch('/api/xp-guide')
  return response.json()
}

export async function updateXPGuide(content: string) {
  const response = await fetch('/api/xp-guide', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  })
  return response.json()
}

// Rewards API
export interface RewardData {
  requiredXP: number
  title: string
  description?: string
  icon?: string
  order?: number
}

export async function getRewards() {
  const response = await fetch('/api/rewards')
  return response.json()
}

export async function createReward(data: RewardData) {
  const response = await fetch('/api/rewards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateReward(id: string, data: Partial<RewardData>) {
  const response = await fetch(`/api/rewards/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteReward(id: string) {
  const response = await fetch(`/api/rewards/${id}`, { method: 'DELETE' })
  return response.json()
}

// Available Projects API (for members to browse - open projects to work on)
export type AvailableProjectCategory = 'web_development' | 'mobile_development' | 'software_engineering'

export interface AvailableProjectData {
  category: AvailableProjectCategory
  title: string
  overview: string
  technologies?: string[] | string
  domain?: string
  estimatedTime?: string
  specificationBook?: string
}

export async function getAvailableProjects(category?: AvailableProjectCategory) {
  const url = category ? `/api/available-projects?category=${category}` : '/api/available-projects'
  const response = await fetch(url)
  return response.json()
}

export async function createAvailableProject(data: AvailableProjectData) {
  const response = await fetch('/api/available-projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateAvailableProject(id: string, data: Partial<AvailableProjectData>) {
  const response = await fetch(`/api/available-projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteAvailableProject(id: string) {
  const response = await fetch(`/api/available-projects/${id}`, { method: 'DELETE' })
  return response.json()
}

// Excom (Executive Committee) API
export interface ExcomMemberData {
  name: string
  position: string
  image?: string | null
  facebook?: string
  email?: string
  linkedin?: string
  order?: number
  mandate?: string | null
}

export async function getExcomMembers() {
  const response = await fetch('/api/excom')
  return response.json()
}

export async function createExcomMember(data: ExcomMemberData) {
  const response = await fetch('/api/excom', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function updateExcomMember(id: string, data: Partial<ExcomMemberData>) {
  const response = await fetch(`/api/excom/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return response.json()
}

export async function deleteExcomMember(id: string) {
  const response = await fetch(`/api/excom/${id}`, { method: 'DELETE' })
  return response.json()
} 