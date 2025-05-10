"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface ExpirationDistributionProps {
  data: Array<{
    name: string
    value: number
  }>
}

// Custom colors for the pie chart
const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"]

export function ExpirationDistribution({ data }: ExpirationDistributionProps) {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Expiration Settings</CardTitle>
      </CardHeader>
      <CardContent>
        {data.some((item) => item.value > 0) ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value} snippets`, "Count"]} />
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
