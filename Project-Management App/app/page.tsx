"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Menu,
  Clock,
  MapPin,
  Users,
  Calendar,
  Pause,
  X,
  Moon,
  Sun,
  Play,
  Volume2,
  VolumeX,
  Trash2,
  Music,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useMobile } from "@/hooks/use-mobile"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const isMobile = useMobile()
  const [isLoaded, setIsLoaded] = useState(false)
  const [showAIPopup, setShowAIPopup] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredEvents, setFilteredEvents] = useState([])
  const [showSidebar, setShowSidebar] = useState(!isMobile)
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [showMusicPlayer, setShowMusicPlayer] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)
  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: "09:00",
    endTime: "10:00",
    color: "bg-rose-500",
    day: new Date().getDay() || 7, // Default to current day (1-7)
    description: "",
    location: "",
    attendees: [],
    organizer: "You",
  })
  const [attendeeInput, setAttendeeInput] = useState("")
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Team Meeting",
      startTime: "09:00",
      endTime: "10:00",
      color: "bg-rose-500",
      day: 1,
      description: "Weekly team sync-up",
      location: "Conference Room A",
      attendees: ["John Doe", "Jane Smith", "Bob Johnson"],
      organizer: "Alice Brown",
    },
    {
      id: 2,
      title: "Lunch with Sarah",
      startTime: "12:30",
      endTime: "13:30",
      color: "bg-emerald-500",
      day: 1,
      description: "Discuss project timeline",
      location: "Cafe Nero",
      attendees: ["Sarah Lee"],
      organizer: "You",
    },
    {
      id: 3,
      title: "Project Review",
      startTime: "14:00",
      endTime: "15:30",
      color: "bg-violet-500",
      day: 3,
      description: "Q2 project progress review",
      location: "Meeting Room 3",
      attendees: ["Team Alpha", "Stakeholders"],
      organizer: "Project Manager",
    },
    {
      id: 4,
      title: "Client Call",
      startTime: "10:00",
      endTime: "11:00",
      color: "bg-amber-500",
      day: 2,
      description: "Quarterly review with major client",
      location: "Zoom Meeting",
      attendees: ["Client Team", "Sales Team"],
      organizer: "Account Manager",
    },
    {
      id: 5,
      title: "Team Brainstorm",
      startTime: "13:00",
      endTime: "14:30",
      color: "bg-indigo-500",
      day: 4,
      description: "Ideation session for new product features",
      location: "Creative Space",
      attendees: ["Product Team", "Design Team"],
      organizer: "Product Owner",
    },
    {
      id: 6,
      title: "Product Demo",
      startTime: "11:00",
      endTime: "12:00",
      color: "bg-pink-500",
      day: 5,
      description: "Showcase new features to stakeholders",
      location: "Demo Room",
      attendees: ["Stakeholders", "Dev Team"],
      organizer: "Tech Lead",
    },
    {
      id: 7,
      title: "Marketing Meeting",
      startTime: "13:00",
      endTime: "14:00",
      color: "bg-teal-500",
      day: 6,
      description: "Discuss Q3 marketing strategy",
      location: "Marketing Office",
      attendees: ["Marketing Team"],
      organizer: "Marketing Director",
    },
    {
      id: 8,
      title: "Code Review",
      startTime: "15:00",
      endTime: "16:00",
      color: "bg-cyan-500",
      day: 7,
      description: "Review pull requests for new feature",
      location: "Dev Area",
      attendees: ["Dev Team"],
      organizer: "Senior Developer",
    },
    {
      id: 9,
      title: "Morning Standup",
      startTime: "08:30",
      endTime: "09:30",
      color: "bg-sky-500",
      day: 2,
      description: "Daily team standup",
      location: "Slack Huddle",
      attendees: ["Development Team"],
      organizer: "Scrum Master",
    },
    {
      id: 10,
      title: "Design Review",
      startTime: "14:30",
      endTime: "15:45",
      color: "bg-purple-400",
      day: 5,
      description: "Review new UI designs",
      location: "Design Lab",
      attendees: ["UX Team", "Product Manager"],
      organizer: "Lead Designer",
    },
    {
      id: 11,
      title: "Investor Meeting",
      startTime: "10:30",
      endTime: "12:00",
      color: "bg-red-400",
      day: 7,
      description: "Quarterly investor update",
      location: "Board Room",
      attendees: ["Executive Team", "Investors"],
      organizer: "CEO",
    },
    {
      id: 12,
      title: "Team Training",
      startTime: "09:30",
      endTime: "11:30",
      color: "bg-emerald-400",
      day: 4,
      description: "New tool onboarding session",
      location: "Training Room",
      attendees: ["All Departments"],
      organizer: "HR",
    },
    {
      id: 13,
      title: "Budget Review",
      startTime: "13:30",
      endTime: "15:00",
      color: "bg-amber-400",
      day: 3,
      description: "Quarterly budget analysis",
      location: "Finance Office",
      attendees: ["Finance Team", "Department Heads"],
      organizer: "CFO",
    },
    {
      id: 14,
      title: "Client Presentation",
      startTime: "11:00",
      endTime: "12:30",
      color: "bg-orange-400",
      day: 6,
      description: "Present new project proposal",
      location: "Client Office",
      attendees: ["Sales Team", "Client Representatives"],
      organizer: "Account Executive",
    },
    {
      id: 15,
      title: "Product Planning",
      startTime: "14:00",
      endTime: "15:30",
      color: "bg-pink-400",
      day: 1,
      description: "Roadmap discussion for Q3",
      location: "Strategy Room",
      attendees: ["Product Team", "Engineering Leads"],
      organizer: "Product Manager",
    },
    {
      id: 16,
      title: "Late Night Coding",
      startTime: "20:00",
      endTime: "22:30",
      color: "bg-indigo-500",
      day: 3,
      description: "Finish the new feature implementation",
      location: "Home Office",
      attendees: ["You"],
      organizer: "You",
    },
    {
      id: 17,
      title: "Evening Workout",
      startTime: "18:30",
      endTime: "19:30",
      color: "bg-emerald-500",
      day: 2,
      description: "Gym session",
      location: "Fitness Center",
      attendees: ["You"],
      organizer: "You",
    },
    {
      id: 18,
      title: "Dinner with Team",
      startTime: "19:00",
      endTime: "21:00",
      color: "bg-rose-500",
      day: 5,
      description: "Team bonding dinner",
      location: "Italian Restaurant",
      attendees: ["Development Team"],
      organizer: "Team Lead",
    },
  ])

  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(
    new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date()),
  )
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [weekDays] = useState(["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"])
  const [weekDates, setWeekDates] = useState(
    Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - date.getDay() + i)
      return date.getDate()
    }),
  )

  // Add keyframes for animations
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
    @keyframes ninja1Move {
      0% { transform: translateX(0) translateY(0); }
      25% { transform: translateX(-20px) translateY(-5px); }
      30% { transform: translateX(40px) translateY(0); }
      50% { transform: translateX(10px) translateY(5px); }
      75% { transform: translateX(-10px) translateY(-3px); }
      100% { transform: translateX(0) translateY(0); }
    }
    @keyframes ninja2Move {
      0% { transform: translateX(0) translateY(0); }
      25% { transform: translateX(20px) translateY(5px); }
      30% { transform: translateX(-40px) translateY(0); }
      50% { transform: translateX(-10px) translateY(-5px); }
      75% { transform: translateX(10px) translateY(3px); }
      100% { transform: translateX(0) translateY(0); }
    }
    @keyframes attack {
      0% { transform: rotate(0deg); }
      25% { transform: rotate(-20deg); }
      50% { transform: rotate(15deg); }
      75% { transform: rotate(-10deg); }
      100% { transform: rotate(0deg); }
    }
    @keyframes jump {
      0% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
      100% { transform: translateY(0); }
    }
    @keyframes flip {
      0% { transform: rotateY(0deg); }
      100% { transform: rotateY(360deg); }
    }
    @keyframes pulse {
      0% { opacity: 0.7; }
      50% { opacity: 0.3; }
      100% { opacity: 0; }
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
      100% { transform: translateY(0px); }
    }
    @keyframes swoosh {
      0% { width: 0; opacity: 0; }
      50% { width: 40px; opacity: 0.7; }
      100% { width: 0; opacity: 0; }
    }
    @keyframes smoke {
      0% { transform: scale(0); opacity: 0.7; }
      100% { transform: scale(2); opacity: 0; }
    }
  `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  useEffect(() => {
    setIsLoaded(true)

    // Show AI popup after 3 seconds
    const popupTimer = setTimeout(() => {
      setShowAIPopup(true)
    }, 3000)

    return () => clearTimeout(popupTimer)
  }, [])

  // Audio player time update
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime)
      }

      const handleLoadedMetadata = () => {
        setDuration(audio.duration)
      }

      const handleEnded = () => {
        setIsPlaying(false)
      }

      audio.addEventListener("timeupdate", handleTimeUpdate)
      audio.addEventListener("loadedmetadata", handleLoadedMetadata)
      audio.addEventListener("ended", handleEnded)

      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate)
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
        audio.removeEventListener("ended", handleEnded)
      }
    }
  }, [audioRef.current])

  // Update current time indicator every minute
  useEffect(() => {
    const timer = setInterval(() => {
      // Force re-render to update the current time indicator
      setCurrentDate(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEvents(events)
    } else {
      const filtered = events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredEvents(filtered)
    }
  }, [searchQuery, events])

  useEffect(() => {
    // Update month display when current date changes
    setCurrentMonth(new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(currentDate))

    // Calculate the start of the week (Sunday)
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

    // Update week dates
    const newWeekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return date.getDate()
    })
    setWeekDates(newWeekDates)
  }, [currentDate])

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const goToPrevious = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const goToNext = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e) => {
    const newVolume = Number.parseInt(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  const handleSeek = (e) => {
    const seekTime = Number.parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime
      setCurrentTime(seekTime)
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleCreateEvent = () => {
    setShowCreateEvent(true)
  }

  const handleSaveEvent = () => {
    const eventId = events.length + 1
    const newEventWithId = { ...newEvent, id: eventId }
    // In a real app, you would save this to a database
    // For now, we'll just add it to our events array
    setEvents([...events, newEventWithId])
    setShowCreateEvent(false)
    setNewEvent({
      title: "",
      startTime: "09:00",
      endTime: "10:00",
      color: "bg-rose-500",
      day: new Date().getDay() || 7,
      description: "",
      location: "",
      attendees: [],
      organizer: "You",
    })
  }

  const handleAddAttendee = () => {
    if (attendeeInput.trim() !== "") {
      setNewEvent({
        ...newEvent,
        attendees: [...newEvent.attendees, attendeeInput.trim()],
      })
      setAttendeeInput("")
    }
  }

  const handleRemoveAttendee = (index) => {
    const updatedAttendees = [...newEvent.attendees]
    updatedAttendees.splice(index, 1)
    setNewEvent({
      ...newEvent,
      attendees: updatedAttendees,
    })
  }

  const handleEventClick = (event) => {
    setSelectedEvent(event)
  }

  // Sample calendar days for the week view
  const daysInMonth = 31
  const firstDayOffset = 5 // Friday is the first day of the month in this example
  const miniCalendarDays = Array.from({ length: daysInMonth + firstDayOffset }, (_, i) =>
    i < firstDayOffset ? null : i - firstDayOffset + 1,
  )

  // Sample my calendars
  const myCalendars = [
    { name: "My Calendar", color: "bg-rose-500" },
    { name: "Work", color: "bg-emerald-500" },
    { name: "Personal", color: "bg-violet-500" },
    { name: "Family", color: "bg-amber-500" },
  ]

  // Helper function to calculate event position and height
  const calculateEventStyle = (startTime, endTime) => {
    const start = Number.parseInt(startTime.split(":")[0]) + Number.parseInt(startTime.split(":")[1]) / 60
    const end = Number.parseInt(endTime.split(":")[0]) + Number.parseInt(endTime.split(":")[1]) / 60
    
    // Handle events that start before 7 AM
    const adjustedStart = Math.max(start, 7)
    const top = (adjustedStart - 7) * 60 // 60px per hour, starting from 7 AM
    const height = (end - adjustedStart) * 60
    
    return { top: `${top}px`, height: `${height}px` }
  }

  // Function to calculate the position of the current time indicator
  const getCurrentTimePosition = () => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const timeInHours = hours + minutes / 60
    
    // If current time is before 7 AM, position at the top
    if (timeInHours < 7) return 0
    
    return (timeInHours - 7) * 60 // 60px per hour, adjusted to start at 7 AM
  }

  // Time slots starting from 7 AM (7-24 hours)
  const timeSlots = Array.from({ length: 17 }, (_, i) => i + 7)

  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${theme === "dark" ? "dark" : ""}`}>
      {/* Background Image */}
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FaVtivQJukDfyxdvmukQhbYJGz3E6b.png"
        alt="Anime character with mechanical gears background"
        fill
        className="object-cover"
        priority
      />

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/What%20You%20Heard-YatiYP0Frl3Z7q44PmRM8Ma1XhNQvG.mp3"
        loop
      />

      {/* Navigation */}
      <header
        className={`absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 md:px-8 py-6 opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}
        style={{ animationDelay: "0.2s" }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="bg-rose-500/80 hover:bg-rose-600/80 p-2 rounded-full transition-colors"
          >
            <Menu className="h-6 w-6 text-white" />
          </button>
          <span className="text-xl md:text-2xl font-semibold text-white drop-shadow-lg">Calendar</span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-full bg-white/10 backdrop-blur-sm pl-10 pr-4 py-2 text-white placeholder:text-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="bg-amber-500/80 hover:bg-amber-600/80 p-2 rounded-full transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-white drop-shadow-md" />
            ) : (
              <Moon className="h-5 w-5 text-white drop-shadow-md" />
            )}
          </button>
          {/* Settings button removed */}
          <button
            onClick={() => setShowMusicPlayer(!showMusicPlayer)}
            className="bg-emerald-500/80 hover:bg-emerald-600/80 p-2 rounded-full transition-colors"
          >
            <Music className="h-6 w-6 text-white drop-shadow-md" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative h-screen w-full pt-20 flex">
        {/* Sidebar */}
        {showSidebar && (
          <div
            className={`w-64 h-full bg-black/30 dark:bg-white/5 backdrop-blur-lg p-4 shadow-xl border-r border-white/20 rounded-tr-3xl opacity-0 ${
              isLoaded ? "animate-fade-in" : ""
            } flex flex-col justify-between ${isMobile ? "absolute z-30" : ""}`}
            style={{ animationDelay: "0.4s" }}
          >
            <div>
              <button
                className="mb-6 flex items-center justify-center gap-2 rounded-full bg-rose-500 hover:bg-rose-600 px-4 py-3 text-white w-full transition-colors"
                onClick={handleCreateEvent}
              >
                <Plus className="h-5 w-5" />
                <span>Create Event</span>
              </button>

              {/* Mini Calendar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">{currentMonth}</h3>
                  <div className="flex gap-1">
                    <button
                      className="p-1 rounded-full hover:bg-white/20"
                      onClick={() => {
                        const newDate = new Date(currentDate)
                        newDate.setMonth(currentDate.getMonth() - 1)
                        setCurrentDate(newDate)
                      }}
                    >
                      <ChevronLeft className="h-4 w-4 text-white" />
                    </button>
                    <button
                      className="p-1 rounded-full hover:bg-white/20"
                      onClick={() => {
                        const newDate = new Date(currentDate)
                        newDate.setMonth(currentDate.getMonth() + 1)
                        setCurrentDate(newDate)
                      }}
                    >
                      <ChevronRight className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                    <div key={i} className="text-xs text-white/70 font-medium py-1">
                      {day}
                    </div>
                  ))}

                  {miniCalendarDays.map((day, i) => (
                    <div
                      key={i}
                      className={`text-xs rounded-full w-7 h-7 flex items-center justify-center ${
                        day === currentDate.getDate() ? "bg-rose-500 text-white" : "text-white hover:bg-white/20"
                      } ${!day ? "invisible" : ""} cursor-pointer`}
                      onClick={() => {
                        if (day) {
                          const newDate = new Date(currentDate)
                          newDate.setDate(day)
                          setCurrentDate(newDate)
                        }
                      }}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              {/* My Calendars */}
              <div>
                <h3 className="text-white font-medium mb-3">My calendars</h3>
                <div className="space-y-2">
                  {myCalendars.map((cal, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-sm ${cal.color}`}></div>
                      <span className="text-white text-sm">{cal.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Music Player */}
            <div className="mt-6 bg-black/40 dark:bg-white/10 backdrop-blur-lg p-4 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="text-white text-sm font-medium">Now Playing</div>
                <button className="text-white/70 hover:text-white" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>
              <div className="text-white text-xs mb-3 opacity-70">Sonder - What You Heard</div>
              <div className="flex items-center justify-center mb-3">
                <button
                  onClick={togglePlay}
                  className="bg-rose-500 hover:bg-rose-600 rounded-full p-3 text-white transition-colors"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-white">
                <span>{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <span>{duration ? formatTime(duration) : "--:--"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Calendar View */}
        <div
          className={`flex-1 flex flex-col opacity-0 ${isLoaded ? "animate-fade-in" : ""}`}
          style={{ animationDelay: "0.6s" }}
        >
          {/* Calendar Controls */}
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <div className="flex items-center gap-2 md:gap-4">
              <button
                className="px-3 md:px-4 py-2 text-white bg-rose-500 hover:bg-rose-600 rounded-md text-sm transition-colors"
                onClick={goToToday}
              >
                Today
              </button>
              <div className="flex">
                <button
                  className="p-2 text-white bg-violet-500/80 hover:bg-violet-600/80 rounded-l-md transition-colors"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  className="p-2 text-white bg-violet-500/80 hover:bg-violet-600/80 rounded-r-md transition-colors"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-white">
                {new Intl.DateTimeFormat("en-US", {
                  month: "long",
                  day: "numeric",
                  year: currentDate.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
                }).format(currentDate)}
              </h2>
            </div>
          </div>

          {/* Calendar Views */}
          <div className="flex-1 overflow-auto p-4">
            <div className="bg-black/30 dark:bg-white/5 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl h-full">
              {/* Week Header */}
              <div className="grid grid-cols-8 border-b border-white/20">
                <div className="p-2 text-center text-white/50 text-xs"></div>
                {weekDays.map((day, i) => (
                  <div key={i} className="p-2 text-center border-l border-white/20">
                    <div className="text-xs text-white/70 font-medium">{day}</div>
                    <div
                      className={`text-lg font-medium mt-1 text-white ${
                        new Date().getDate() === weekDates[i] && new Date().getMonth() === currentDate.getMonth()
                          ? "bg-rose-500 rounded-full w-8 h-8 flex items-center justify-center mx-auto"
                          : ""
                      }`}
                    >
                      {weekDates[i]}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Grid */}
              <div className="grid grid-cols-8">
                {/* Time Labels - Hidden as per user request */}
                <div className="text-white/70 invisible">
                  {timeSlots.map((time, i) => (
                    <div key={i} className="h-15 border-b border-white/10 pr-2 text-right text-xs">
                      {time === 0 ? "12 AM" : time > 12 ? `${time - 12} PM` : time === 12 ? "12 PM" : `${time} AM`}
                    </div>
                  ))}
                </div>

                {/* Days Columns */}
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <div key={dayIndex} className="border-l border-white/20 relative">
                    {timeSlots.map((_, timeIndex) => (
                      <div
                        key={timeIndex}
                        className="h-15 border-b border-white/10"
                        onClick={() => {
                          // Set up a new event at this time slot
                          const startHour = timeSlots[timeIndex]
                          const startTime = `${startHour < 10 ? "0" + startHour : startHour}:00`
                          const endHour = startHour + 1
                          const endTime = `${endHour < 10 ? "0" + endHour : endHour}:00`

                          setNewEvent({
                            ...newEvent,
                            startTime,
                            endTime,
                            day: dayIndex + 1,
                          })
                          setShowCreateEvent(true)
                        }}
                      ></div>
                    ))}

                    {/* Events */}
                    {(searchQuery.trim() === "" ? events : filteredEvents)
                      .filter((event) => event.day === dayIndex + 1)
                      .map((event, i) => {
                        const eventStyle = calculateEventStyle(event.startTime, event.endTime)
                        return (
                          <div
                            key={i}
                            className={`absolute ${event.color} rounded-md p-2 text-white text-xs shadow-md cursor-pointer transition-all duration-200 ease-in-out hover:translate-y-[-2px] hover:shadow-lg`}
                            style={{
                              ...eventStyle,
                              left: "4px",
                              right: "4px",
                            }}
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="font-medium">{event.title}</div>
                            <div className="opacity-80 text-[10px] mt-1">{`${event.startTime} - ${event.endTime}`}</div>
                          </div>
                        )
                      })}
                  </div>
                ))}

                {/* Current Time Indicator */}
                {(() => {
                  const today = new Date().getDay()
                  const currentTimeTop = getCurrentTimePosition()
                  return (
                    <div
                      className="absolute left-0 right-0 z-10 border-t-2 border-rose-500"
                      style={{
                        top: `${currentTimeTop}px`,
                        left: `${12.5 * (today + 1)}%`, // Position in the correct day column
                        width: "12.5%",
                      }}
                    >
                      <div className="absolute -left-1 -top-2 w-4 h-4 rounded-full bg-rose-500"></div>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* AI Popup with Fighting Stickmen Animation */}
        {showAIPopup && (
          <div className="fixed bottom-8 right-8 z-20">
            <div className="w-[300px] md:w-[450px] relative bg-gradient-to-br from-gray-800/70 via-gray-700/70 to-gray-900/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-600/50 text-white">
              <button
                onClick={() => setShowAIPopup(false)}
                className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Ninja Fight Scene Animation */}
              <div className="flex justify-center items-center py-4">
                <div style={{ position: "relative", width: "100%", height: "150px", overflow: "hidden" }}>
                  {/* Background elements */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "0",
                      left: "0",
                      right: "0",
                      height: "30px",
                      background: "linear-gradient(transparent, rgba(0,0,0,0.5))",
                      borderRadius: "50%",
                      filter: "blur(3px)",
                    }}
                  ></div>

                  {/* Smoke effects */}
                  <div
                    style={{
                      position: "absolute",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.2)",
                      top: "100px",
                      left: "30%",
                      animation: "smoke 1s infinite",
                    }}
                  ></div>

                  <div
                    style={{
                      position: "absolute",
                      width: "15px",
                      height: "15px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.2)",
                      top: "110px",
                      left: "60%",
                      animation: "smoke 1.5s infinite",
                    }}
                  ></div>

                  {/* Ninja 1 - Blue */}
                  <div
                    style={{
                      position: "absolute",
                      left: "20%",
                      bottom: "20px",
                      animation: "ninja1Move 4s infinite",
                      zIndex: "2",
                    }}
                  >
                    <svg width="50" height="70" viewBox="0 0 50 70">
                      {/* Ninja body */}
                      <g style={{ animation: "attack 1.5s infinite" }}>
                        {/* Head with mask */}
                        <circle cx="25" cy="15" r="10" fill="#1E40AF" />
                        <rect x="15" y="15" width="20" height="5" fill="#1E40AF" />
                        <line x1="15" y1="18" x2="35" y2="18" stroke="white" strokeWidth="1" />
                        <circle cx="21" cy="13" r="2" fill="white" />
                        <circle cx="29" cy="13" r="2" fill="white" />

                        {/* Body */}
                        <path d="M15,25 L35,25 L32,45 L18,45 Z" fill="#1E40AF" />

                        {/* Belt */}
                        <rect x="18" y="32" width="14" height="3" fill="#FF0000" />

                        {/* Arms */}
                        <line x1="15" y1="25" x2="5" y2="35" stroke="#1E40AF" strokeWidth="4" strokeLinecap="round" />
                        <line x1="35" y1="25" x2="45" y2="30" stroke="#1E40AF" strokeWidth="4" strokeLinecap="round" />

                        {/* Legs */}
                        <line x1="22" y1="45" x2="18" y2="65" stroke="#1E40AF" strokeWidth="4" strokeLinecap="round" />
                        <line x1="28" y1="45" x2="32" y2="65" stroke="#1E40AF" strokeWidth="4" strokeLinecap="round" />

                        {/* Sword */}
                        <line x1="45" y1="30" x2="55" y2="20" stroke="silver" strokeWidth="2" strokeLinecap="round" />
                        <line x1="45" y1="30" x2="47" y2="32" stroke="#964B00" strokeWidth="2" strokeLinecap="round" />
                      </g>
                    </svg>

                    {/* Swoosh effect */}
                    <div
                      style={{
                        position: "absolute",
                        height: "10px",
                        borderRadius: "5px",
                        background: "rgba(255,255,255,0.5)",
                        top: "25px",
                        right: "-10px",
                        transformOrigin: "left",
                        animation: "swoosh 1s infinite",
                        width: "40px",
                      }}
                    ></div>
                  </div>

                  {/* Ninja 2 - Red */}
                  <div
                    style={{
                      position: "absolute",
                      right: "20%",
                      bottom: "20px",
                      animation: "ninja2Move 4s infinite",
                      zIndex: "1",
                    }}
                  >
                    <svg width="50" height="70" viewBox="0 0 50 70">
                      {/* Ninja body */}
                      <g style={{ animation: "attack 1.5s infinite" }}>
                        {/* Head with mask */}
                        <circle cx="25" cy="15" r="10" fill="#991B1B" />
                        <rect x="15" y="15" width="20" height="5" fill="#991B1B" />
                        <line x1="15" y1="18" x2="35" y2="18" stroke="white" strokeWidth="1" />
                        <circle cx="21" cy="13" r="2" fill="white" />
                        <circle cx="29" cy="13" r="2" fill="white" />

                        {/* Body */}
                        <path d="M15,25 L35,25 L32,45 L18,45 Z" fill="#991B1B" />

                        {/* Belt */}
                        <rect x="18" y="32" width="14" height="3" fill="#000000" />

                        {/* Arms */}
                        <line x1="15" y1="25" x2="5" y2="30" stroke="#991B1B" strokeWidth="4" strokeLinecap="round" />
                        <line x1="35" y1="25" x2="45" y2="35" stroke="#991B1B" strokeWidth="4" strokeLinecap="round" />

                        {/* Legs */}
                        <line x1="22" y1="45" x2="18" y2="65" stroke="#991B1B" strokeWidth="4" strokeLinecap="round" />
                        <line x1="28" y1="45" x2="32" y2="65" stroke="#991B1B" strokeWidth="4" strokeLinecap="round" />

                        {/* Nunchaku */}
                        <line x1="5" y1="30" x2="0" y2="35" stroke="#964B00" strokeWidth="2" strokeLinecap="round" />
                        <line x1="0" y1="35" x2="-5" y2="30" stroke="#964B00" strokeWidth="2" strokeLinecap="round" />
                        <line x1="-5" y1="30" x2="-10" y2="35" stroke="silver" strokeWidth="2" strokeLinecap="round" />
                      </g>
                    </svg>

                    {/* Swoosh effect */}
                    <div
                      style={{
                        position: "absolute",
                        height: "10px",
                        borderRadius: "5px",
                        background: "rgba(255,255,255,0.5)",
                        top: "25px",
                        left: "-10px",
                        transformOrigin: "right",
                        animation: "swoosh 1s infinite",
                        width: "40px",
                      }}
                    ></div>
                  </div>

                  {/* Jumping Ninja - Shadow */}
                  <div
                    style={{
                      position: "absolute",
                      left: "45%",
                      bottom: "20px",
                      animation: "jump 2s infinite, flip 2s infinite",
                      zIndex: "3",
                    }}
                  >
                    <svg width="40" height="60" viewBox="0 0 40 60">
                      {/* Ninja body */}
                      <g>
                        {/* Head with mask */}
                        <circle cx="20" cy="15" r="8" fill="#000000" />
                        <rect x="12" y="15" width="16" height="4" fill="#000000" />
                        <line x1="12" y1="17" x2="28" y2="17" stroke="#444444" strokeWidth="1" />

                        {/* Body */}
                        <path d="M12,23 L28,23 L26,40 L14,40 Z" fill="#000000" />

                        {/* Belt */}
                        <rect x="14" y="30" width="12" height="2" fill="#444444" />

                        {/* Arms in attack position */}
                        <line x1="12" y1="23" x2="5" y2="15" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
                        <line x1="28" y1="23" x2="35" y2="15" stroke="#000000" strokeWidth="3" strokeLinecap="round" />

                        {/* Legs in kick position */}
                        <line x1="18" y1="40" x2="10" y2="50" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
                        <line x1="22" y1="40" x2="30" y2="30" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
                      </g>
                    </svg>
                  </div>

                  {/* Shadow on ground for jumping ninja */}
                  <div
                    style={{
                      position: "absolute",
                      width: "30px",
                      height: "5px",
                      background: "rgba(0,0,0,0.5)",
                      borderRadius: "50%",
                      bottom: "15px",
                      left: "45%",
                      transform: "translateX(-50%)",
                      filter: "blur(2px)",
                      opacity: "0.7",
                    }}
                  ></div>

                  {/* Throwing stars */}
                  <div
                    style={{
                      position: "absolute",
                      width: "8px",
                      height: "8px",
                      background: "silver",
                      clipPath:
                        "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                      top: "40px",
                      left: "30%",
                      animation: "ninja1Move 2s infinite reverse",
                    }}
                  ></div>

                  <div
                    style={{
                      position: "absolute",
                      width: "8px",
                      height: "8px",
                      background: "silver",
                      clipPath:
                        "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                      top: "60px",
                      right: "35%",
                      animation: "ninja2Move 1.5s infinite",
                    }}
                  ></div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={togglePlay}
                  className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors font-medium"
                >
                  Power Up!
                </button>
                <button
                  onClick={() => setShowAIPopup(false)}
                  className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors font-medium"
                >
                  Not Now
                </button>
              </div>
              {isPlaying && (
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <button
                      className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-white text-sm hover:bg-white/20 transition-colors"
                      onClick={togglePlay}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      <span>{isPlaying ? "Pause" : "Play"} Sonder</span>
                    </button>
                    <button className="p-2 rounded-full bg-white/10 hover:bg-white/20" onClick={toggleMute}>
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs">{volume}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Music Player Modal */}
        {showMusicPlayer && (
          <div className="fixed bottom-8 left-8 z-20">
            <div className="w-[300px] md:w-[350px] relative bg-black/40 dark:bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 text-white">
              <button
                onClick={() => setShowMusicPlayer(false)}
                className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex flex-col items-center">
                <div className="text-xl font-medium mb-2">What You Heard</div>
                <div className="text-white/70 text-sm mb-6">Sonder</div>

                <div className="w-full mb-6">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{duration ? formatTime(duration) : "--:--"}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-6">
                  <button onClick={toggleMute} className="text-white/70 hover:text-white p-2">
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={togglePlay}
                    className="bg-rose-500 hover:bg-rose-600 rounded-full p-4 text-white transition-colors"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </button>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${selectedEvent.color} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}>
              <h3 className="text-2xl font-bold mb-4 text-white">{selectedEvent.title}</h3>
              <div className="space-y-3 text-white">
                <p className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  {`${selectedEvent.startTime} - ${selectedEvent.endTime}`}
                </p>
                <p className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  {selectedEvent.location}
                </p>
                <p className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  {`${weekDays[selectedEvent.day - 1]}, ${weekDates[selectedEvent.day - 1]} ${currentMonth}`}
                </p>
                <p className="flex items-start">
                  <Users className="mr-2 h-5 w-5 mt-1" />
                  <span>
                    <strong>Attendees:</strong>
                    <br />
                    {selectedEvent.attendees.join(", ") || "No attendees"}
                  </span>
                </p>
                <p>
                  <strong>Organizer:</strong> {selectedEvent.organizer}
                </p>
                <p>
                  <strong>Description:</strong> {selectedEvent.description}
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  className="bg-white/20 text-white px-4 py-2 rounded hover:bg-white/30 transition-colors"
                  onClick={() => {
                    // Delete the event from our events array
                    const updatedEvents = events.filter((e) => e.id !== selectedEvent.id)
                    setEvents(updatedEvents)
                    setSelectedEvent(null)
                  }}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <button
                  className="bg-white text-gray-800 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedEvent(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Event Modal */}
        {showCreateEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-black/40 dark:bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-xl max-w-md w-full mx-4 border border-white/30">
              <h3 className="text-2xl font-bold mb-4 text-white">Create Event</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full p-2 rounded bg-white/10 border border-white/30 text-white"
                    placeholder="Event title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-1">Start Time</label>
                    <input
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                      className="w-full p-2 rounded bg-white/10 border border-white/30 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-1">End Time</label>
                    <input
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                      className="w-full p-2 rounded bg-white/10 border border-white/30 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-1">Day</label>
                  <select
                    value={newEvent.day}
                    onChange={(e) => setNewEvent({ ...newEvent, day: Number.parseInt(e.target.value) })}
                    className="w-full p-2 rounded bg-white/10 border border-white/30 text-white"
                  >
                    {weekDays.map((day, i) => (
                      <option key={i} value={i + 1}>
                        {day} ({weekDates[i]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full p-2 rounded bg-white/10 border border-white/30 text-white"
                    placeholder="Event location"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full p-2 rounded bg-white/10 border border-white/30 text-white h-20"
                    placeholder="Event description"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-1">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      "bg-rose-500",
                      "bg-emerald-500",
                      "bg-violet-500",
                      "bg-amber-500",
                      "bg-pink-500",
                      "bg-indigo-500",
                      "bg-teal-500",
                      "bg-red-500",
                    ].map((color) => (
                      <div
                        key={color}
                        className={`w-8 h-8 rounded-full cursor-pointer ${color} ${
                          newEvent.color === color ? "ring-2 ring-white" : ""
                        }`}
                        onClick={() => setNewEvent({ ...newEvent, color })}
                      ></div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-1">Attendees</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={attendeeInput}
                      onChange={(e) => setAttendeeInput(e.target.value)}
                      className="flex-1 p-2 rounded bg-white/10 border border-white/30 text-white"
                      placeholder="Add attendee"
                    />
                    <button
                      onClick={handleAddAttendee}
                      className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded transition-colors"
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {newEvent.attendees.map((attendee, i) => (
                      <div
                        key={i}
                        className="bg-white/20 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {attendee}
                        <button onClick={() => handleRemoveAttendee(i)} className="text-white/70 hover:text-white">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
                  onClick={() => setShowCreateEvent(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded transition-colors"
                  onClick={handleSaveEvent}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

