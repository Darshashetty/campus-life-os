const gatewayBaseUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "https://campus-life-os.onrender.com"

export interface AuthLoginResponse {
  token: string
  user: {
    id: number
    email: string
    name: string
    role: string
  }
}

export interface DashboardSummaryResponse {
  profile?: {
    id: number
    name: string
    email: string
    level: string
    department: string
    gpa: number
    enrolledCourses: string[]
  }
  activityStats: Array<{ label: string; value: number; color: string }>
  upcomingDeadlines: Array<{ id: number; title: string; date: string; priority: string }>
  reminders?: Array<{ id: number; message: string; priority: string; type: string }>
  recentActivity?: Array<{ action: string; time: string }>
  source: string
}

export interface ServiceHealthItem {
  service: string
  status: string
}

export interface ServicesHealthResponse {
  gateway: ServiceHealthItem
  services: ServiceHealthItem[]
}

export interface LostFoundItem {
  id: number
  title: string
  description: string
  location: string
  date: string
  type: "lost" | "found"
  category: string
  contactName: string
}

export interface DirectoryPerson {
  id: string
  name: string
  role: string
  department: string
  email: string
  phone: string
  office?: string
  type: "student" | "faculty"
}

export interface GpaCourse {
  id: number
  name: string
  credits: number
  grade: string
}

export interface AttendanceCourse {
  id: number
  name: string
  totalClasses: number
  attended: number
  code: string
}

export interface CampusLocation {
  id: string
  name: string
  building: string
  room?: string
  category: string
  description: string
  coordinates: { x: number; y: number }
}

export interface RideItem {
  id: string
  driver: string
  from: string
  to: string
  date: string
  time: string
  seats: number
  price: string
  status: "available" | "requested" | "booked"
}

export interface NoteItem {
  id: number
  title: string
  subject: string
  contributor: string
  downloads: number
  rating: number
  description: string
  fileType: string
  uploadDate: string
}

export interface MealPlanResponse {
  mealSwipes: number
  mealSwipesUsed: number
  diningDollars: number
  diningDollarsUsed: number
  daysRemaining: number
  history: Array<{
    date: string
    location: string
    type: string
    amount?: string
    time: string
  }>
}

export interface HelpBotChatResponse {
  reply: string
  topic: string
  timestamp: string
}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${gatewayBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body?.message || `Request failed: ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export const registerViaGateway = async (
  name: string,
  email: string,
  password: string,
  role = "student",
): Promise<AuthLoginResponse> => {
  return request<AuthLoginResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, role }),
  })
}

export const loginViaGateway = async (email: string, password: string): Promise<AuthLoginResponse> => {
  return request<AuthLoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export const refreshTokenViaGateway = async (refreshToken: string): Promise<{ token: string; user: AuthLoginResponse["user"] }> => {
  return request("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  })
}

export const getMeViaGateway = async (token: string): Promise<AuthLoginResponse["user"]> => {
  return request("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const fetchDashboardSummaryViaGateway = async (): Promise<DashboardSummaryResponse> => {
  return request<DashboardSummaryResponse>("/api/dashboard-summary")
}

export const fetchServicesHealthViaGateway = async (): Promise<ServicesHealthResponse> => {
  return request<ServicesHealthResponse>("/api/services/health")
}

export const fetchRemindersViaGateway = async () => {
  return request<Array<{ id: number; message: string; priority: string; type: string }>>("/api/notifications/reminders")
}

export const fetchLostFoundItemsViaGateway = async (search = "", type = "all") => {
  const params = new URLSearchParams()
  if (search) params.set("search", search)
  if (type) params.set("type", type)

  return request<LostFoundItem[]>(`/api/lost-found/items?${params.toString()}`)
}

export const createLostFoundItemViaGateway = async (item: Omit<LostFoundItem, "id" | "date">) => {
  return request<LostFoundItem>("/api/lost-found/items", {
    method: "POST",
    body: JSON.stringify(item),
  })
}

export const contactLostFoundViaGateway = async (itemId: number, message: string) => {
  return request<{ status: string; message: string }>("/api/lost-found/contact", {
    method: "POST",
    body: JSON.stringify({ itemId, message }),
  })
}

export const fetchDirectoryPeopleViaGateway = async (search = "", type = "all") => {
  const params = new URLSearchParams()
  if (search) params.set("search", search)
  if (type) params.set("type", type)

  return request<DirectoryPerson[]>(`/api/directory/people?${params.toString()}`)
}

export const fetchGpaCoursesViaGateway = async () => {
  return request<GpaCourse[]>("/api/students/gpa/courses")
}

export const addGpaCourseViaGateway = async (course: Omit<GpaCourse, "id">) => {
  return request<GpaCourse>("/api/students/gpa/courses", {
    method: "POST",
    body: JSON.stringify(course),
  })
}

export const deleteGpaCourseViaGateway = async (id: number) => {
  return request<void>(`/api/students/gpa/courses/${id}`, {
    method: "DELETE",
  })
}

export const fetchAttendanceViaGateway = async () => {
  return request<AttendanceCourse[]>("/api/students/attendance")
}

export const markAttendanceViaGateway = async (id: number, present: boolean) => {
  return request<AttendanceCourse>(`/api/students/attendance/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ present }),
  })
}

export const fetchCampusLocationsViaGateway = async (search = "") => {
  const params = new URLSearchParams()
  if (search) params.set("search", search)
  return request<CampusLocation[]>(`/api/campus/locations?${params.toString()}`)
}

export const fetchRidesViaGateway = async (from = "", to = "") => {
  const params = new URLSearchParams()
  if (from) params.set("from", from)
  if (to) params.set("to", to)
  return request<RideItem[]>(`/api/rides?${params.toString()}`)
}

export const createRideViaGateway = async (ride: Omit<RideItem, "id" | "status"> & { status?: RideItem["status"] }) => {
  return request<RideItem>("/api/rides", {
    method: "POST",
    body: JSON.stringify(ride),
  })
}

export const requestRideViaGateway = async (rideId: string) => {
  return request<RideItem>(`/api/rides/${rideId}/request`, {
    method: "PATCH",
  })
}

export const cancelRideViaGateway = async (rideId: string) => {
  return request<void>(`/api/rides/${rideId}`, {
    method: "DELETE",
  })
}

export const fetchNotesViaGateway = async (search = "", subject = "") => {
  const params = new URLSearchParams()
  if (search) params.set("search", search)
  if (subject && subject !== "all") params.set("subject", subject)
  return request<NoteItem[]>(`/api/notes?${params.toString()}`)
}

export const createNoteViaGateway = async (note: Omit<NoteItem, "id" | "downloads" | "rating" | "uploadDate">) => {
  return request<NoteItem>("/api/notes", {
    method: "POST",
    body: JSON.stringify(note),
  })
}

export const incrementNoteDownloadViaGateway = async (id: number) => {
  return request<NoteItem>(`/api/notes/${id}/download`, {
    method: "PATCH",
  })
}

export const fetchMealPlanViaGateway = async () => {
  return request<MealPlanResponse>("/api/students/meal-plan")
}

export const useMealSwipeViaGateway = async () => {
  return request<MealPlanResponse>("/api/students/meal-plan/swipe", {
    method: "POST",
  })
}

export const spendDiningRupeesViaGateway = async (amount: number) => {
  return request<MealPlanResponse>("/api/students/meal-plan/dining-dollars", {
    method: "POST",
    body: JSON.stringify({ amount }),
  })
}

export const sendHelpBotMessageViaGateway = async (message: string) => {
  return request<HelpBotChatResponse>("/api/helpbot/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  })
}
