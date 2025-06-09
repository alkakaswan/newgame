"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, Calendar } from "lucide-react"

interface JournalEntryItem {
  id: string
  title: string
  content: string
  date: string // ISO string
  wordCount: number
}
interface JournalEntryProps {
  onEntrySubmit: () => void
}

export function JournalEntry({ onEntrySubmit }: JournalEntryProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [entries, setEntries] = useState<JournalEntryItem[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("journal-entries")
    if (saved) {
      setEntries(JSON.parse(saved))
    }
  }, [])

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return

    const entry = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      date: new Date().toISOString(),
      wordCount: content.trim().split(/\s+/).length,
    }

    const newEntries = [entry, ...entries]
    setEntries(newEntries)
    localStorage.setItem("journal-entries", JSON.stringify(newEntries))

    onEntrySubmit()
    setTitle("")
    setContent("")
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Personal Journal
          </CardTitle>
          <CardDescription>Write about your thoughts, experiences, and reflections</CardDescription>
        </CardHeader>
        <CardContent>
          {!showForm ? (
            <Button onClick={() => setShowForm(true)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              New Journal Entry (+20 XP)
            </Button>
          ) : (
            <div className="space-y-4">
              <Input placeholder="Entry title..." value={title} onChange={(e) => setTitle(e.target.value)} />
              <Textarea
                placeholder="What's on your mind today?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
              />
              <div className="flex gap-2">
                <Button onClick={handleSubmit} disabled={!title.trim() || !content.trim()}>
                  Save Entry
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {entries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Entries</h3>
          {entries.slice(0, 5).map((entry) => (
            <Card key={entry.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{entry.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{entry.wordCount} words</Badge>
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(entry.date).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">{entry.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
