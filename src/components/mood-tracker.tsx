"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, Smile } from "lucide-react"

interface MoodTrackerProps {
  onMoodSubmit: (mood: string) => void
}

interface MoodEntry {
  id: string
  mood: string
  note: string
  date: string
}

const moods = [
  { emoji: "😄", label: "Excellent", value: "excellent" },
  { emoji: "😊", label: "Good", value: "good" },
  { emoji: "😐", label: "Okay", value: "okay" },
  { emoji: "😔", label: "Low", value: "low" },
  { emoji: "😢", label: "Sad", value: "sad" },
]

export function MoodTracker({ onMoodSubmit }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<string>("")
  const [note, setNote] = useState<string>("")
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [todayLogged, setTodayLogged] = useState<boolean>(false)

  useEffect(() => {
    const saved = localStorage.getItem("mood-history")
    if (saved) {
      const history: MoodEntry[] = JSON.parse(saved)
      setMoodHistory(history)

      const today = new Date().toDateString()
      const todayEntry = history.find(
        (entry) => new Date(entry.date).toDateString() === today
      )
      setTodayLogged(!!todayEntry)
    }
  }, [])

  const handleSubmit = () => {
    if (!selectedMood) return

    const entry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      note,
      date: new Date().toISOString(),
    }

    const newHistory = [entry, ...moodHistory].slice(0, 30)
    setMoodHistory(newHistory)
    localStorage.setItem("mood-history", JSON.stringify(newHistory))

    onMoodSubmit(selectedMood)
    setTodayLogged(true)
    setSelectedMood("")
    setNote("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            How are you feeling today?
          </CardTitle>
          <CardDescription>Track your daily mood and add optional notes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {todayLogged ? (
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Smile className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-800 dark:text-green-200 font-medium">
                You&apos;ve already logged your mood today! (+5 XP earned)
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-5 gap-2">
                {moods.map((mood) => (
                  <Button
                    key={mood.value}
                    variant={selectedMood === mood.value ? "default" : "outline"}
                    className="h-20 flex-col gap-2"
                    onClick={() => setSelectedMood(mood.value)}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs">{mood.label}</span>
                  </Button>
                ))}
              </div>

              <Textarea
                placeholder="Add a note about your mood (optional)..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />

              <Button onClick={handleSubmit} disabled={!selectedMood} className="w-full">
                Log Mood (+5 XP)
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {moodHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mood History</CardTitle>
            <CardDescription>Your recent mood entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {moodHistory.slice(0, 7).map((entry) => {
                const mood = moods.find((m) => m.value === entry.mood)
                return (
                  <div key={entry.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="text-2xl">{mood?.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{mood?.label}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      {entry.note && <p className="text-sm mt-1 text-muted-foreground">{entry.note}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
