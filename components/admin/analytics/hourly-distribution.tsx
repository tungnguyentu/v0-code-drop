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
  const formattedData = data.map((item) => {
    const hour = Number.parseInt(item.hour, 10)
    return {
      ...item,
      formattedHour: `${hour}:00`,
      hour: item.hour,
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Creation Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
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
                <XAxis dataKey="formattedHour" interval={3} tickFormatter={(value) => value.split(":")[0]} />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value} snippets`, "Count"]}
                  labelFormatter={(hour) => `Hour: ${hour}`}
                />
                <Bar dataKey="count" fill="#8b5cf6" name="Snippets Created" />
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
