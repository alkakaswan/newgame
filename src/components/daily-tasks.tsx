"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Trophy } from "lucide-react"

interface Task {
  id: string
  title: string
  xp: number
  completed: boolean
  category: string
}

interface DailyTasksProps {
  onTaskComplete: (task: Task) => void
}

const defaultTasks: Omit<Task, "id" | "completed">[] = [
  { title: "Drink 8 glasses of water", xp: 15, category: "Health" },
  { title: "Exercise for 30 minutes", xp: 25, category: "Fitness" },
  { title: "Read for 20 minutes", xp: 20, category: "Learning" },
  { title: "Meditate for 10 minutes", xp: 15, category: "Wellness" },
  { title: "Write in journal", xp: 20, category: "Reflection" },
  { title: "Complete work tasks", xp: 30, category: "Productivity" },
  { title: "Connect with a friend", xp: 10, category: "Social" },
]

export function DailyTasks({ onTaskComplete }: DailyTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const today = new Date().toDateString()
    const savedTasks = localStorage.getItem(`daily-tasks-${today}`)

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      // Generate new daily tasks
      const newTasks = defaultTasks.map((task) => ({
        ...task,
        id: Math.random().toString(36).substr(2, 9),
        completed: false,
      }))
      setTasks(newTasks)
      localStorage.setItem(`daily-tasks-${today}`, JSON.stringify(newTasks))
    }
  }, [])

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId && !task.completed) {
        onTaskComplete(task)
        return { ...task, completed: true }
      }
      return task
    })

    setTasks(updatedTasks)
    const today = new Date().toDateString()
    localStorage.setItem(`daily-tasks-${today}`, JSON.stringify(updatedTasks))
  }

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  const totalXP = tasks.reduce((sum, task) => sum + (task.completed ? task.xp : 0), 0)

  const categoryColors: Record<string, string> = {
    Health: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Fitness: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    Learning: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    Wellness: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    Reflection: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Productivity: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    Social: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Daily Tasks
          </CardTitle>
          <CardDescription>Complete your daily goals to earn XP and build streaks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <span className="font-medium">
                Progress: {completedTasks}/{totalTasks}
              </span>
            </div>
            <Badge variant="secondary">{totalXP} XP earned</Badge>
          </div>

          <Progress value={completionPercentage} className="h-2" />

          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                <Checkbox
                  id={task.id}
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  disabled={task.completed}
                />
                <div className="flex-1">
                  <label
                    htmlFor={task.id}
                    className={`text-sm font-medium cursor-pointer ${
                      task.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {task.title}
                  </label>
                </div>
                <Badge className={categoryColors[task.category] || "bg-gray-100 text-gray-800"}>{task.category}</Badge>
                <Badge variant="outline">+{task.xp} XP</Badge>
              </div>
            ))}
          </div>

          {completionPercentage === 100 && (
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                🎉 All tasks completed! Great job today!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
