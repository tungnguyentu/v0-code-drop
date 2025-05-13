"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ViewLimitDistributionProps {
  data: Array<{
    name: string
    value: number
  }>
}

export function ViewLimitDistribution({ data }: ViewLimitDistributionProps) {
  // Format data for display
  const formattedData = data.map((item) => ({
    name: item.name === "unlimited" ? "Unlimited" : item.name,
    value: item.value,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>View Limit Distribution</CardTitle>
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
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value} snippets`, "Count"]}
                  labelFormatter={(name) => `View Limit: ${name}`}
                />
                <Bar dataKey="value" fill="#0ea5e9" name="Snippets" />
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
