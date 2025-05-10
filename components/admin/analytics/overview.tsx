import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Clock, Eye, FileCode } from "lucide-react"

interface AnalyticsOverviewProps {
  data: {
    totalSnippets: number
    activeSnippets: number
    last24Hours: number
    last7Days: number
    totalViews: number
  }
}

export function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Snippets</CardTitle>
          <FileCode className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalSnippets}</div>
          <p className="text-xs text-gray-500">All time snippets created</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Snippets</CardTitle>
          <BarChart3 className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.activeSnippets}</div>
          <p className="text-xs text-gray-500">Non-expired snippets</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          <Clock className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.last24Hours}</div>
          <p className="text-xs text-gray-500">
            Snippets created in last 24h
            <span className="ml-1 text-emerald-500">({data.last7Days} this week)</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <Eye className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalViews}</div>
          <p className="text-xs text-gray-500">All time snippet views</p>
        </CardContent>
      </Card>
    </div>
  )
}
