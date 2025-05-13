"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface LanguageDistributionProps {
  data: Array<{
    name: string
    value: number
  }>
}

const COLORS = ["#10b981", "#0ea5e9", "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b", "#84cc16"]

export function LanguageDistribution({ data }: LanguageDistributionProps) {
  // Sort data by value in descending order and take top 8
  const sortedData = [...data]
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)
    .map((item, index) => ({
      ...item,
      color: COLORS[index % COLORS.length],
    }))

  // If there are more languages, group them as "Others"
  if (data.length > 8) {
    const othersValue = data.slice(8).reduce((sum, item) => sum + item.value, 0)

    if (othersValue > 0) {
      sortedData.push({
        name: "Others",
        value: othersValue,
        color: "#94a3b8",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Language Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sortedData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {sortedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} snippets`, "Count"]}
                  labelFormatter={(name) => `Language: ${name}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-center text-gray-500">No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
