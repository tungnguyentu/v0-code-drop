"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format, parseISO } from "date-fns"

interface CreationTrendProps {
  data: Array<{
    date: string
    count: number
  }>
}

export function CreationTrend({ data }: CreationTrendProps) {
  // Format dates for display
  const formattedData = data.map((item) => ({
    ...item,
    formattedDate: format(parseISO(item.date), "MMM dd"),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Snippet Creation Trend (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={formattedData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" tick={{ fontSize: 12 }} tickCount={7} />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value} snippets`, "Created"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area type="monotone" dataKey="count" stroke="#10b981" fill="#10b98133" name="Snippets Created" />
              </AreaChart>
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
