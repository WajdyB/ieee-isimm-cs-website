"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Upload, Eye, EyeOff, Loader2 } from "lucide-react"
import Image from "next/image"
import { loginAdmin, getEvents, createEvent, deleteEvent, uploadImages, type EventData } from "@/lib/api"

// Add local Event type for MongoDB
interface Event {
  _id: string
  title: string
  description: string
  date: string
  location: string
  attendees: number
  images: string[]
  created_at: string
  updated_at: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState<EventData>({
    title: "",
    description: "",
    date: "",
    location: "",
    attendees: 0,
    images: [],
  })

  // Load events on authentication
  useEffect(() => {
    if (isAuthenticated) {
      loadEvents()
    }
  }, [isAuthenticated])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const response = await getEvents()
      if (response.success) {
        setEvents(response.data)
      } else {
        console.error('Failed to load events:', response.message)
      }
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password")
      return
    }

    try {
      setLoading(true)
      const response = await loginAdmin({ email, password })
      
      if (response.success) {
        setIsAuthenticated(true)
        setEmail("")
        setPassword("")
      } else {
        alert(response.message || "Login failed")
      }
    } catch (error) {
      console.error('Login error:', error)
      alert("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setEvents([])
  }

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.location) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      const response = await createEvent(newEvent)
      
      if (response.success) {
        setEvents([response.data, ...events])
        setNewEvent({
          title: "",
          description: "",
          date: "",
          location: "",
          attendees: 0,
          images: [],
        })
        alert("Event created successfully!")
      } else {
        alert(response.message || "Failed to create event")
      }
    } catch (error) {
      console.error('Error creating event:', error)
      alert("Failed to create event. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return
    }

    try {
      setLoading(true)
      const response = await deleteEvent(id)
      
      if (response.success) {
        setEvents(events.filter((e) => e._id !== id))
        alert("Event deleted successfully!")
      } else {
        alert(response.message || "Failed to delete event")
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      alert("Failed to delete event. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (files: FileList | null, isEditing = false) => {
    if (!files || files.length === 0) return

    try {
      setLoading(true)
      
      // Convert FileList to Array
      const fileArray = Array.from(files)
      
      // Upload images to server
      const uploadResponse = await uploadImages(fileArray)
      
      if (uploadResponse.success) {
        // Extract URLs from the response
        const uploadedUrls = uploadResponse.files.map((file: { url: string; path: string }) => file.url)
        
        setNewEvent({
          ...newEvent,
          images: [...(newEvent.images || []), ...uploadedUrls],
        })
      } else {
        alert('Failed to upload images: ' + uploadResponse.message)
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Failed to upload images. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const removeImage = (index: number) => {
    setNewEvent({
      ...newEvent,
      images: (newEvent.images || []).filter((_, i) => i !== index),
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cs-isimm.org"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enter admin password"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button onClick={handleLogin} className="w-full bg-orange-500 hover:bg-orange-600" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
            Logout
          </Button>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="bg-white">
            <TabsTrigger value="events" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">Manage Events</TabsTrigger>
            <TabsTrigger value="add-event" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">Add New Event</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Events</CardTitle>
                <CardDescription>Manage your existing events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event._id} className="border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                        <div className="text-sm text-gray-500">
                          <span>
                            {event.date} • {event.location} • {event.attendees} attendees
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={() => handleDeleteEvent(event._id)} size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-event">
            <Card>
              <CardHeader>
                <CardTitle>Add New Event</CardTitle>
                <CardDescription>Create a new event for the CS community</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Enter event title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Enter event description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      placeholder="Enter event location"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attendees">Number of Attendees</Label>
                  <Input
                    id="attendees"
                    type="number"
                    value={newEvent.attendees}
                    onChange={(e) => setNewEvent({ ...newEvent, attendees: Number.parseInt(e.target.value) || 0 })}
                    placeholder="Enter number of attendees"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Event Images</Label>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {(newEvent.images || []).map((image, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`New event image ${index + 1}`}
                          width={200}
                          height={150}
                          className="w-full h-24 object-cover rounded"
                        />
                        <Button
                          onClick={() => removeImage(index)}
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="flex-1"
                      disabled={loading}
                    />
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-orange-600" />
                    ) : (
                      <Upload className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {loading ? 'Uploading images...' : 'Upload multiple images for your event gallery'}
                  </p>
                </div>
                <Button onClick={handleAddEvent} className="w-full bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
