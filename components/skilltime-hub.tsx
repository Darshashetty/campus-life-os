"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PlusIcon, SearchIcon, AwardIcon, ClockIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Student {
  id: number
  name: string
  department: string
  skills: string[]
  timeCredits: number
  badges: string[]
}

export function SkillTimeHub() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Rahul Sharma",
      department: "Computer Science",
      skills: ["Python", "React", "Machine Learning"],
      timeCredits: 15,
      badges: ["Helper"],
    },
    {
      id: 2,
      name: "Priya Patel",
      department: "Electronics",
      skills: ["Arduino", "Circuit Design", "PCB Layout"],
      timeCredits: 22,
      badges: ["Expert", "Mentor"],
    },
    {
      id: 3,
      name: "Amit Kumar",
      department: "Mechanical",
      skills: ["CAD", "3D Printing", "Simulation"],
      timeCredits: 18,
      badges: ["Helper"],
    },
    {
      id: 4,
      name: "Sneha Reddy",
      department: "Computer Science",
      skills: ["Java", "Spring Boot", "Database Design"],
      timeCredits: 25,
      badges: ["Expert"],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [open, setOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [helpDialogOpen, setHelpDialogOpen] = useState(false)

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addSkill = () => {
    if (newSkill.trim()) {
      // This would add skill to current user's profile
      console.log("Adding skill:", newSkill)
      setNewSkill("")
      setOpen(false)
    }
  }

  const requestHelp = (student: Student) => {
    setSelectedStudent(student)
    setHelpDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SkillTime Hub</h1>
          <p className="text-muted-foreground mt-1">Discover peer skills and share your expertise</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusIcon className="size-4" />
              Register Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register Your Skill</DialogTitle>
              <DialogDescription>Share your expertise with fellow students</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="skill">Skill Name</Label>
                <Input
                  id="skill"
                  placeholder="e.g., Python Programming"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                />
              </div>
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <ClockIcon className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Time Credit System</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {"Earn time credits by helping others learn your skills. Use credits to learn from peers!"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={addSkill}>
                Register Skill
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, skill, or department..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active in skill sharing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Skills Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(students.flatMap((s) => s.skills)).size}</div>
            <p className="text-xs text-muted-foreground mt-1">Unique skills to learn</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Your Time Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Hours available to learn</p>
          </CardContent>
        </Card>
      </div>

      {/* Student Directory */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Skill Directory</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.department}</p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {student.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="size-3" />
                        <span>{student.timeCredits} credits</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {student.badges.map((badge, i) => (
                          <Badge key={i} variant="outline" className="text-xs gap-1">
                            <AwardIcon className="size-3" />
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="mt-3 w-full bg-transparent"
                      variant="outline"
                      onClick={() => requestHelp(student)}
                    >
                      Request Help
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Help Request Dialog */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Help from {selectedStudent?.name}</DialogTitle>
            <DialogDescription>
              Connect with {selectedStudent?.name} to learn their skills. This will use your time credits.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="font-medium mb-2">Available Skills:</div>
              <div className="flex flex-wrap gap-2">
                {selectedStudent?.skills.map((skill, i) => (
                  <Badge key={i} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>• Session will cost 2 time credits per hour</p>
              <p>• You currently have 12 credits available</p>
              <p>
                • {selectedStudent?.name} has earned {selectedStudent?.timeCredits} credits helping others
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => setHelpDialogOpen(false)}>
              Send Request
            </Button>
            <Button variant="outline" onClick={() => setHelpDialogOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
