"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Trophy,
  Flame,
  Star,
  Calendar,
  Target,
  Heart,
  BookOpen,
  LogOut,
  TrendingUp,
  Zap
} from "lucide-react"
import { MoodTracker } from "@/components/mood-tracker"
import { JournalEntry } from "@/components/journal-entry"
import { DailyTasks } from "@/components/daily-tasks"
import { AchievementBadges } from "@/components/achievement-badges"
import { ActivityFeed } from "@/components/activity-feed"

interface User {
  name: string
  xp: number
  level: number
  streak: number
  totalPoints: number
  lastAction: string // Use ISO string for consistency
  achievements: string[]
}

interface DashboardProps {
  user: User
  onLogout: () => void
}

const syncUserData = async (userData: User) => {
  try {
    const response = await fetch("/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      console.error("Failed to sync user data")
    }
  } catch (error) {
    console.error("Error syncing user data:", error)
  }
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [userData, setUserData] = useState<User>(user)
  const [showReward, setShowReward] = useState(false)

  useEffect(() => {
    localStorage.setItem("gamified-user", JSON.stringify(userData))
  }, [userData])

  const updateUserData = (updates: Partial<User>) => {
    const newUserData = { ...userData, ...updates }
    setUserData(newUserData)
    syncUserData(newUserData)
  }

  const addXP = (amount: number, action: string) => {
    const newXP = userData.xp + amount
    const newLevel = Math.floor(newXP / 250) + 1
    const leveledUp = newLevel > userData.level

    updateUserData({
      xp: newXP,
      level: newLevel,
      lastAction: new Date().toISOString(),
      totalPoints: userData.totalPoints + amount,
    })

    if (leveledUp) {
      setShowReward(true)
      setTimeout(() => setShowReward(false), 3000)
    }

    const activity = {
      id: Date.now().toString(),
      action,
      xp: amount,
      timestamp: new Date().toISOString(),
    }

    const activities = JSON.parse(localStorage.getItem("user-activities") || "[]")
    activities.unshift(activity)
    localStorage.setItem("user-activities", JSON.stringify(activities.slice(0, 20)))
  }

  const currentLevelXP = (userData.level - 1) * 250
  const nextLevelXP = userData.level * 250
  const progressToNextLevel = ((userData.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100

  return (
    <div className="min-h-screen p-4 space-y-6">
      {showReward && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-800 dark:text-yellow-200">Level Up!</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300">You reached level {userData.level}!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`} />
            <AvatarFallback>{userData.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {userData.name}!</h1>
            <p className="text-muted-foreground">
              Level {userData.level} • {userData.xp} XP
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.level}</div>
            <Progress value={progressToNextLevel} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{nextLevelXP - userData.xp} XP to next level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.streak}</div>
            <p className="text-xs text-muted-foreground">days in a row</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.totalPoints}</div>
            <p className="text-xs text-muted-foreground">lifetime points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Action</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{new Date(userData.lastAction).toLocaleDateString()}</div>
            <p className="text-xs text-muted-foreground">{new Date(userData.lastAction).toLocaleTimeString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mood">Mood</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => addXP(25, "Completed workout")}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Complete Workout (+25 XP)
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => addXP(15, "Read for 30 minutes")}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Read 30 Minutes (+15 XP)
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => addXP(10, "Meditated")}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Meditate (+10 XP)
                </Button>
              </CardContent>
            </Card>

            <ActivityFeed />
          </div>
        </TabsContent>

        <TabsContent value="mood">
          <MoodTracker onMoodSubmit={(mood) => addXP(5, `Logged mood: ${mood}`)} />
        </TabsContent>

        <TabsContent value="journal">
          <JournalEntry onEntrySubmit={() => addXP(20, "Wrote journal entry")} />
        </TabsContent>

        <TabsContent value="tasks">
          <DailyTasks onTaskComplete={(task) => addXP(task.xp, `Completed: ${task.title}`)} />
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementBadges achievements={userData.achievements} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
