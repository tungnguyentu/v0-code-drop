"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface HourlyDistributionProps {
  data: Array<{
    hour: string
    count: number
  }>
}

export function HourlyDistribution({ data }: HourlyDistributionProps) {
  // Format hours for better display
  const formattedData = data.map((item) => ({
    ...item,
    formattedHour: `${item.hour}:00`,
  }))

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Hourly Activity (UTC)</CardTitle>
      </CardHeader>
      <CardContent>
        {data.some((item) => item.count > 0) ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formattedData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedHour" tick={{ fontSize: 10 }} interval={3} />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value} snippets`, "Created"]}
                  labelFormatter={(label) => `Hour: ${label} UTC`}
                />
                <Bar dataKey="count" fill="#0ea5e9" name="Snippets" />
              </BarChart>
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
