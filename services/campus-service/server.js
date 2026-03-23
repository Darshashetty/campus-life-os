import express from "express"
import cors from "cors"

const app = express()
const PORT = process.env.PORT || 4005

app.use(cors())
app.use(express.json())

let lostFoundItems = [
  {
    id: 1,
    title: "Blue Water Bottle",
    description: "Blue insulated water bottle with college sticker",
    location: "Library 2nd Floor",
    date: "2026-01-03",
    type: "lost",
    category: "Personal Items",
    contactName: "Rahul S.",
  },
  {
    id: 2,
    title: "Scientific Calculator",
    description: "Casio fx-991EX calculator in black pouch",
    location: "Engineering Block",
    date: "2026-01-02",
    type: "found",
    category: "Electronics",
    contactName: "Priya P.",
  },
  {
    id: 3,
    title: "Red Backpack",
    description: "Red Nike backpack with laptop compartment",
    location: "Cafeteria",
    date: "2026-01-04",
    type: "found",
    category: "Bags",
    contactName: "Amit K.",
  },
]

let lostFoundContactRequests = []

const directoryPeople = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    role: "Professor",
    department: "Computer Science",
    email: "sarah.johnson@campus.edu",
    phone: "(555) 123-4567",
    office: "Engineering Block A, Room 305",
    type: "faculty",
  },
  {
    id: "2",
    name: "Alex Kumar",
    role: "Student",
    department: "Computer Science",
    email: "alex.kumar@campus.edu",
    phone: "(555) 234-5678",
    type: "student",
  },
  {
    id: "3",
    name: "Prof. Michael Chen",
    role: "Associate Professor",
    department: "Mathematics",
    email: "michael.chen@campus.edu",
    phone: "(555) 345-6789",
    office: "Science Building, Room 201",
    type: "faculty",
  },
  {
    id: "4",
    name: "Emma Wilson",
    role: "Student",
    department: "Engineering",
    email: "emma.wilson@campus.edu",
    phone: "(555) 456-7890",
    type: "student",
  },
  {
    id: "5",
    name: "Dr. Robert Taylor",
    role: "Department Head",
    department: "Physics",
    email: "robert.taylor@campus.edu",
    phone: "(555) 567-8901",
    office: "Physics Building, Room 401",
    type: "faculty",
  },
  {
    id: "6",
    name: "Priya Patel",
    role: "Student",
    department: "Business",
    email: "priya.patel@campus.edu",
    phone: "(555) 678-9012",
    type: "student",
  },
]

const campusLocations = [
  {
    id: "1",
    name: "Computer Science Department",
    building: "Engineering Block A",
    room: "Room 301",
    category: "academic",
    description: "CS labs, faculty offices, and classrooms",
    coordinates: { x: 30, y: 40 },
  },
  {
    id: "2",
    name: "Main Library",
    building: "Central Library",
    category: "library",
    description: "Study halls, book collections, digital resources",
    coordinates: { x: 50, y: 30 },
  },
  {
    id: "3",
    name: "Student Cafeteria",
    building: "Food Court",
    category: "dining",
    description: "Multiple food stalls and seating areas",
    coordinates: { x: 60, y: 60 },
  },
  {
    id: "4",
    name: "Sports Complex",
    building: "Sports Building",
    category: "sports",
    description: "Gym, basketball court, swimming pool",
    coordinates: { x: 70, y: 50 },
  },
  {
    id: "5",
    name: "Auditorium",
    building: "Main Building",
    room: "Hall 1",
    category: "events",
    description: "Large auditorium for events and ceremonies",
    coordinates: { x: 40, y: 70 },
  },
  {
    id: "6",
    name: "Medical Center",
    building: "Health Services",
    category: "services",
    description: "Campus health clinic and pharmacy",
    coordinates: { x: 20, y: 60 },
  },
]

let rides = [
  {
    id: "1",
    driver: "Alex Kumar",
    from: "Campus Main Gate",
    to: "City Center",
    date: "2026-03-20",
    time: "5:00 PM",
    seats: 3,
    price: "₹150",
    status: "available",
  },
  {
    id: "2",
    driver: "Sarah Chen",
    from: "Campus Dorms",
    to: "Airport",
    date: "2026-03-22",
    time: "6:30 AM",
    seats: 2,
    price: "₹450",
    status: "available",
  },
]

let notes = [
  {
    id: 1,
    title: "Data Structures Complete Notes",
    subject: "Computer Science",
    contributor: "Alex Chen",
    downloads: 245,
    rating: 4.8,
    description: "Comprehensive notes covering arrays, linked lists, trees, and graphs",
    fileType: "PDF",
    uploadDate: "2026-01-15",
  },
  {
    id: 2,
    title: "Calculus II Revision Guide",
    subject: "Mathematics",
    contributor: "Sarah Johnson",
    downloads: 189,
    rating: 4.6,
    description: "Integration techniques, series, and applications",
    fileType: "PDF",
    uploadDate: "2026-01-12",
  },
]

const marketplaceContacts = []

const getHelpBotResponse = (message) => {
  const msg = String(message || "").toLowerCase()

  if (msg.includes("form") || msg.includes("submit") || msg.includes("portal")) {
    return {
      text: "For form submissions, open the Forms & Portal Helper. You can track pending forms, see deadlines, and mark completed submissions there.",
      topic: "forms",
    }
  }

  if (msg.includes("deadline") || msg.includes("assignment") || msg.includes("exam") || msg.includes("fee")) {
    return {
      text: "Check the Deadline Manager for assignments, exams, and fee reminders. It keeps all important due dates in one place.",
      topic: "deadlines",
    }
  }

  if (msg.includes("skill") || msg.includes("learn") || msg.includes("peer")) {
    return {
      text: "Use SkillTime Hub to find peers who can teach a skill or to share your own expertise with other students.",
      topic: "skills",
    }
  }

  if (msg.includes("lost") || msg.includes("found") || msg.includes("item")) {
    return {
      text: "Open Lost & Found to report missing items, browse found items, and contact the listed student directly from the app.",
      topic: "lost-found",
    }
  }

  if (msg.includes("book") || msg.includes("appointment") || msg.includes("office") || msg.includes("queue")) {
    return {
      text: "Use Queue Booking to reserve campus service slots such as academic support, administration, or counselling visits.",
      topic: "booking",
    }
  }

  if (msg.includes("ride") || msg.includes("transport") || msg.includes("car")) {
    return {
      text: "Ride Sharing lets you search rides, request a seat, or post your own trip for other students.",
      topic: "rides",
    }
  }

  if (msg.includes("map") || msg.includes("building") || msg.includes("location") || msg.includes("where")) {
    return {
      text: "Campus Map can help you search buildings and navigate to academic blocks, dining areas, sports facilities, and services.",
      topic: "map",
    }
  }

  if (msg.includes("note") || msg.includes("study material") || msg.includes("pdf")) {
    return {
      text: "Use Notes Sharing to discover study materials from other students or upload your own notes for others.",
      topic: "notes",
    }
  }

  return {
    text: "I can help with forms, deadlines, skills, lost & found, rides, map navigation, notes, and bookings. Ask about any campus feature.",
    topic: "general",
  }
}

app.get("/health", (_req, res) => {
  res.json({ service: "campus-service", status: "ok" })
})

app.get("/api/lost-found/items", (req, res) => {
  const search = String(req.query.search || "").toLowerCase()
  const type = String(req.query.type || "all")

  const filtered = lostFoundItems.filter((item) => {
    const typeMatch = type === "all" || item.type === type
    const searchMatch =
      !search ||
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.location.toLowerCase().includes(search)

    return typeMatch && searchMatch
  })

  res.json(filtered)
})

app.post("/api/lost-found/items", (req, res) => {
  const { title, description, location, category = "General", type = "lost", contactName = "You" } = req.body || {}

  if (!title || !description || !location) {
    return res.status(400).json({ message: "title, description and location are required" })
  }

  const item = {
    id: Date.now(),
    title,
    description,
    location,
    category,
    type,
    contactName,
    date: new Date().toISOString().split("T")[0],
  }

  lostFoundItems.unshift(item)
  return res.status(201).json(item)
})

app.post("/api/lost-found/contact", (req, res) => {
  const { itemId, message, senderName = "You" } = req.body || {}
  if (!itemId || !message) {
    return res.status(400).json({ message: "itemId and message are required" })
  }

  const item = lostFoundItems.find((entry) => entry.id === Number(itemId))
  if (!item) {
    return res.status(404).json({ message: "Item not found" })
  }

  const contactRequest = {
    id: Date.now(),
    itemId: Number(itemId),
    itemTitle: item.title,
    recipientName: item.contactName,
    senderName,
    message,
    status: "sent",
    createdAt: new Date().toISOString(),
  }

  lostFoundContactRequests.unshift(contactRequest)

  return res.status(201).json({
    status: "sent",
    message: "Contact request submitted",
    request: contactRequest,
  })
})

app.get("/api/lost-found/contact-requests", (req, res) => {
  const senderName = String(req.query.senderName || "").toLowerCase()

  const filtered = lostFoundContactRequests.filter((request) => {
    if (!senderName) return true
    return String(request.senderName).toLowerCase() === senderName
  })

  return res.json(filtered)
})

app.get("/api/directory/people", (req, res) => {
  const search = String(req.query.search || "").toLowerCase()
  const type = String(req.query.type || "all")

  const filtered = directoryPeople.filter((person) => {
    const typeMatch = type === "all" || person.type === type
    const searchMatch =
      !search ||
      person.name.toLowerCase().includes(search) ||
      person.department.toLowerCase().includes(search) ||
      person.email.toLowerCase().includes(search)

    return typeMatch && searchMatch
  })

  res.json(filtered)
})

app.get("/api/campus/locations", (req, res) => {
  const search = String(req.query.search || "").toLowerCase()

  const filtered = campusLocations.filter(
    (location) =>
      !search ||
      location.name.toLowerCase().includes(search) ||
      location.building.toLowerCase().includes(search),
  )

  res.json(filtered)
})

app.get("/api/rides", (req, res) => {
  const searchFrom = String(req.query.from || "").toLowerCase()
  const searchTo = String(req.query.to || "").toLowerCase()

  const filtered = rides.filter((ride) => {
    const matchesFrom = !searchFrom || ride.from.toLowerCase().includes(searchFrom)
    const matchesTo = !searchTo || ride.to.toLowerCase().includes(searchTo)
    return matchesFrom && matchesTo
  })

  res.json(filtered)
})

app.post("/api/rides", (req, res) => {
  const { driver = "You", from, to, date, time, seats, price } = req.body || {}

  if (!from || !to || !date || !time || !seats || !price) {
    return res.status(400).json({ message: "from, to, date, time, seats and price are required" })
  }

  const ride = {
    id: Date.now().toString(),
    driver,
    from,
    to,
    date,
    time,
    seats: Number(seats),
    price,
    status: "available",
  }

  rides.unshift(ride)
  return res.status(201).json(ride)
})

app.patch("/api/rides/:id/request", (req, res) => {
  const ride = rides.find((item) => item.id === req.params.id)
  if (!ride) {
    return res.status(404).json({ message: "Ride not found" })
  }

  if (ride.seats > 0) {
    ride.seats -= 1
    ride.status = ride.seats === 0 ? "booked" : "requested"
  }

  return res.json(ride)
})

app.delete("/api/rides/:id", (req, res) => {
  rides = rides.filter((ride) => ride.id !== req.params.id)
  return res.status(204).send()
})

app.get("/api/notes", (req, res) => {
  const search = String(req.query.search || "").toLowerCase()
  const subject = String(req.query.subject || "all")

  const filtered = notes.filter((note) => {
    const matchesSearch =
      !search ||
      note.title.toLowerCase().includes(search) ||
      note.subject.toLowerCase().includes(search)
    const matchesSubject = subject === "all" || note.subject === subject
    return matchesSearch && matchesSubject
  })

  res.json(filtered)
})

app.post("/api/notes", (req, res) => {
  const { title, subject, description, contributor = "You", fileType = "PDF" } = req.body || {}
  if (!title || !subject || !description) {
    return res.status(400).json({ message: "title, subject and description are required" })
  }

  const note = {
    id: Date.now(),
    title,
    subject,
    contributor,
    downloads: 0,
    rating: 4.5,
    description,
    fileType,
    uploadDate: new Date().toISOString().split("T")[0],
  }

  notes.unshift(note)
  return res.status(201).json(note)
})

app.patch("/api/notes/:id/download", (req, res) => {
  const note = notes.find((item) => item.id === Number(req.params.id))
  if (!note) {
    return res.status(404).json({ message: "Note not found" })
  }

  note.downloads += 1
  return res.json(note)
})

app.post("/api/marketplace/contact", (req, res) => {
  const { seller, itemTitle, message, sender = "Current Student" } = req.body || {}

  if (!seller || !itemTitle || !message) {
    return res.status(400).json({ message: "seller, itemTitle and message are required" })
  }

  const contactRequest = {
    id: Date.now(),
    seller,
    itemTitle,
    message,
    sender,
    status: "sent",
    createdAt: new Date().toISOString(),
  }

  marketplaceContacts.unshift(contactRequest)

  return res.status(201).json({
    status: "sent",
    message: `Message sent to ${seller}`,
    contactId: contactRequest.id,
  })
})

app.post("/api/helpbot/chat", (req, res) => {
  const { message } = req.body || {}
  if (!message || !String(message).trim()) {
    return res.status(400).json({ message: "message is required" })
  }

  const reply = getHelpBotResponse(message)
  return res.status(201).json({
    reply: reply.text,
    topic: reply.topic,
    timestamp: new Date().toISOString(),
  })
})

app.listen(PORT, () => {
  console.log(`campus-service running on port ${PORT}`)
})