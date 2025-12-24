"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Task, TaskStatus } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ClipboardList, CheckCircle2, Clock, AlertCircle, TrendingUp, Calendar } from "lucide-react";
import { Bar, BarChart, Pie, PieChart, Area, AreaChart, RadialBar, RadialBarChart, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { Navbar01 } from "@/components/ui/navbar";

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tasks");
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const taskCounts = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    };
  }, [tasks]);

  const priorityData = useMemo(() => {
    const high = tasks.filter((t) => t.priority === "high").length;
    const medium = tasks.filter((t) => t.priority === "medium").length;
    const low = tasks.filter((t) => t.priority === "low").length;
    return [
      { name: "High", value: high, fill: "hsl(var(--chart-1))" },
      { name: "Medium", value: medium, fill: "hsl(var(--chart-2))" },
      { name: "Low", value: low, fill: "hsl(var(--chart-3))" },
    ];
  }, [tasks]);

  const statusData = useMemo(() => {
    return [
      { name: "To Do", value: taskCounts.todo, fill: "hsl(var(--chart-4))" },
      { name: "In Progress", value: taskCounts.inProgress, fill: "hsl(var(--chart-5))" },
      { name: "Completed", value: taskCounts.completed, fill: "hsl(var(--chart-1))" },
    ];
  }, [taskCounts]);

  const completionRate = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((taskCounts.completed / tasks.length) * 100);
  }, [tasks.length, taskCounts.completed]);

  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return tasks
      .filter((t) => {
        const dueDate = new Date(t.dueDate);
        return dueDate >= now && dueDate <= sevenDaysFromNow && t.status !== "completed";
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [tasks]);

  const overdueTasks = useMemo(() => {
    const now = new Date();
    return tasks.filter((t) => {
      const dueDate = new Date(t.dueDate);
      return dueDate < now && t.status !== "completed";
    });
  }, [tasks]);

  const weeklyProgress = useMemo(() => {
    const weekData = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      const completed = tasks.filter((t) => {
        const createdDate = new Date(t.createdAt);
        return (
          t.status === "completed" &&
          createdDate.toDateString() === date.toDateString()
        );
      }).length;

      const created = tasks.filter((t) => {
        const createdDate = new Date(t.createdAt);
        return createdDate.toDateString() === date.toDateString();
      }).length;

      weekData.push({
        day: dayName,
        completed,
        created,
      });
    }
    return weekData;
  }, [tasks]);

  const productivityScore = useMemo(() => {
    const totalTasks = tasks.length;
    if (totalTasks === 0) return 0;

    const completedWeight = taskCounts.completed * 100;
    const inProgressWeight = taskCounts.inProgress * 50;
    const todoWeight = taskCounts.todo * 0;

    const score = ((completedWeight + inProgressWeight + todoWeight) / (totalTasks * 100)) * 100;
    return Math.round(score);
  }, [tasks.length, taskCounts]);

  const taskPerformance = useMemo(() => {
    return [
      {
        subject: 'Completion',
        value: taskCounts.completed,
        fullMark: tasks.length || 1
      },
      {
        subject: 'On Time',
        value: tasks.filter(t => t.status === 'completed' || new Date(t.dueDate) >= new Date()).length,
        fullMark: tasks.length || 1
      },
      {
        subject: 'High Priority',
        value: tasks.filter(t => t.priority === 'high' && t.status === 'completed').length,
        fullMark: tasks.filter(t => t.priority === 'high').length || 1
      },
      {
        subject: 'In Progress',
        value: taskCounts.inProgress,
        fullMark: tasks.length || 1
      },
      {
        subject: 'Remaining',
        value: taskCounts.todo,
        fullMark: tasks.length || 1
      },
    ];
  }, [tasks, taskCounts]);

  const radialData = useMemo(() => {
    return [
      {
        name: 'Completed',
        value: taskCounts.completed,
        fill: 'hsl(var(--chart-1))',
      },
      {
        name: 'In Progress',
        value: taskCounts.inProgress,
        fill: 'hsl(var(--chart-2))',
      },
      {
        name: 'To Do',
        value: taskCounts.todo,
        fill: 'hsl(var(--chart-3))',
      },
    ];
  }, [taskCounts]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-7xl">
          <Card>
            <CardContent className="py-12 text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
              <h3 className="mt-4 text-lg font-medium">Loading dashboard...</h3>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const navigationLinks = [
    { href: "/dashboard", label: "Dashboard", active: pathname === "/dashboard", onClick: () => router.push("/dashboard") },
    { href: "/tasks", label: "Tasks", active: pathname === "/tasks", onClick: () => router.push("/tasks") },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar01
        logo={<ClipboardList className="h-6 w-6" />}
        navigationLinks={navigationLinks}
        signInText="Sign In"
        ctaText="Add Task"
        onCtaClick={() => router.push("/tasks")}
      />
      <div className="mx-auto max-w-7xl p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Your task analytics and insights
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="animate-in fade-in-50 slide-in-from-top-4 duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskCounts.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All tasks in the system
              </p>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-50 slide-in-from-top-4 duration-300 delay-75">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{taskCounts.inProgress}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently being worked on
              </p>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-50 slide-in-from-top-4 duration-300 delay-150">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{taskCounts.completed}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {completionRate}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-50 slide-in-from-top-4 duration-300 delay-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{overdueTasks.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Tasks past due date
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-in fade-in-50 slide-in-from-left-4 duration-500">
            <CardHeader>
              <CardTitle>Task Status Distribution</CardTitle>
              <CardDescription>Breakdown of tasks by status</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px] w-full">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-50 slide-in-from-right-4 duration-500">
            <CardHeader>
              <CardTitle>Priority Distribution</CardTitle>
              <CardDescription>Tasks grouped by priority level</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px] w-full">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 - Area Chart */}
        <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500 delay-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Weekly Progress
            </CardTitle>
            <CardDescription>Tasks created vs completed over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
              <AreaChart data={weeklyProgress}>
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="created"
                  stroke="hsl(var(--chart-2))"
                  fillOpacity={1}
                  fill="url(#colorCreated)"
                  name="Created"
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="hsl(var(--chart-1))"
                  fillOpacity={1}
                  fill="url(#colorCompleted)"
                  name="Completed"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Charts Row 3 - Radar and Radial */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-in fade-in-50 slide-in-from-left-4 duration-500 delay-200">
            <CardHeader>
              <CardTitle>Task Performance Radar</CardTitle>
              <CardDescription>Multi-dimensional task metrics analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px] w-full">
                <RadarChart data={taskPerformance}>
                  <PolarGrid className="stroke-muted" />
                  <PolarAngleAxis dataKey="subject" className="text-xs" />
                  <PolarRadiusAxis className="text-xs" />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.6}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in-50 slide-in-from-right-4 duration-500 delay-200">
            <CardHeader>
              <CardTitle>Productivity Score</CardTitle>
              <CardDescription>Overall task completion metric</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px] w-full">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="30%"
                  outerRadius="100%"
                  barSize={20}
                  data={radialData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, Math.max(...radialData.map(d => d.value)) || 1]} angleAxisId={0} tick={false} />
                  <RadialBar
                    background
                    dataKey="value"
                    cornerRadius={10}
                    label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend
                    iconSize={10}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </RadialBarChart>
              </ChartContainer>
              <div className="mt-4 text-center">
                <div className="text-3xl font-bold text-primary">{productivityScore}%</div>
                <p className="text-sm text-muted-foreground">Overall Productivity</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Deadlines */}
        {upcomingDeadlines.length > 0 && (
          <Card className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500 delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>Tasks due in the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between border-l-4 border-primary pl-4 py-2"
                  >
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        Priority: {task.priority}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Math.ceil(
                          (new Date(task.dueDate).getTime() - new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days left
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
