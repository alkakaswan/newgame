"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Lock } from "lucide-react"

interface AchievementBadgesProps {
  achievements: string[]
}

const allAchievements = [
  {
    id: "welcome",
    title: "Welcome Aboard!",
    description: "Created your account",
    icon: "🎉",
    rarity: "common",
  },
  {
    id: "first-login",
    title: "First Steps",
    description: "Logged in for the first time",
    icon: "👋",
    rarity: "common",
  },
  {
    id: "week-warrior",
    title: "Week Warrior",
    description: "Maintained a 7-day streak",
    icon: "🔥",
    rarity: "rare",
  },
  {
    id: "level-5",
    title: "Rising Star",
    description: "Reached level 5",
    icon: "⭐",
    rarity: "uncommon",
  },
  {
    id: "level-10",
    title: "Dedicated",
    description: "Reached level 10",
    icon: "💎",
    rarity: "rare",
  },
  {
    id: "mood-tracker",
    title: "Emotional Intelligence",
    description: "Logged mood for 7 days",
    icon: "❤️",
    rarity: "uncommon",
  },
  {
    id: "journal-master",
    title: "Storyteller",
    description: "Wrote 10 journal entries",
    icon: "📖",
    rarity: "rare",
  },
  {
    id: "task-master",
    title: "Task Master",
    description: "Completed 50 daily tasks",
    icon: "🎯",
    rarity: "epic",
  },
  {
    id: "month-streak",
    title: "Consistency King",
    description: "Maintained a 30-day streak",
    icon: "👑",
    rarity: "legendary",
  },
]

const rarityColors = {
  common: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  uncommon: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200",
  rare: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200",
  epic: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200",
  legendary: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200",
}

export function AchievementBadges({ achievements }: AchievementBadgesProps) {
  const unlockedCount = achievements.length
  const totalCount = allAchievements.length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Achievements
          </CardTitle>
          <CardDescription>
            {unlockedCount}/{totalCount} achievements unlocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allAchievements.map((achievement) => {
              const isUnlocked = achievements.includes(achievement.id)

              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isUnlocked
                      ? "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20"
                      : "border-gray-200 bg-gray-50 dark:bg-gray-800 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">
                      {isUnlocked ? achievement.icon : <Lock className="h-6 w-6 text-gray-400" />}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isUnlocked ? "" : "text-gray-500"}`}>{achievement.title}</h3>
                      <p className={`text-sm ${isUnlocked ? "text-muted-foreground" : "text-gray-400"}`}>
                        {achievement.description}
                      </p>
                      <Badge
                        className={`mt-2 text-xs ${rarityColors[achievement.rarity as keyof typeof rarityColors]}`}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
