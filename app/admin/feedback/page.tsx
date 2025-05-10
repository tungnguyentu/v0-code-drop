import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { getFeedbackList } from "@/app/actions/feedback"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FeedbackItem } from "@/components/admin/feedback-item"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AdminFeedbackPage() {
  const allFeedback = await getFeedbackList()
  const newFeedback = allFeedback.filter((item) => item.status === "new")
  const inProgressFeedback = allFeedback.filter((item) => item.status === "in-progress")
  const completedFeedback = allFeedback.filter((item) => item.status === "completed")
  const dismissedFeedback = allFeedback.filter((item) => item.status === "dismissed")

  return (
    <DashboardLayout title="User Feedback">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <Badge className="bg-emerald-100 text-emerald-700">New: {newFeedback.length}</Badge>
          <Badge className="bg-blue-100 text-blue-700">In Progress: {inProgressFeedback.length}</Badge>
          <Badge className="bg-purple-100 text-purple-700">Completed: {completedFeedback.length}</Badge>
          <Badge className="bg-gray-100 text-gray-700">Dismissed: {dismissedFeedback.length}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="new">
            <TabsList className="mb-4">
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <TabsContent value="new" className="space-y-4">
              {newFeedback.length > 0 ? (
                newFeedback.map((item) => <FeedbackItem key={item.id} feedback={item} />)
              ) : (
                <p className="text-center py-8 text-gray-500">No new feedback</p>
              )}
            </TabsContent>

            <TabsContent value="in-progress" className="space-y-4">
              {inProgressFeedback.length > 0 ? (
                inProgressFeedback.map((item) => <FeedbackItem key={item.id} feedback={item} />)
              ) : (
                <p className="text-center py-8 text-gray-500">No feedback in progress</p>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedFeedback.length > 0 ? (
                completedFeedback.map((item) => <FeedbackItem key={item.id} feedback={item} />)
              ) : (
                <p className="text-center py-8 text-gray-500">No completed feedback</p>
              )}
            </TabsContent>

            <TabsContent value="dismissed" className="space-y-4">
              {dismissedFeedback.length > 0 ? (
                dismissedFeedback.map((item) => <FeedbackItem key={item.id} feedback={item} />)
              ) : (
                <p className="text-center py-8 text-gray-500">No dismissed feedback</p>
              )}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {allFeedback.length > 0 ? (
                allFeedback.map((item) => <FeedbackItem key={item.id} feedback={item} />)
              ) : (
                <p className="text-center py-8 text-gray-500">No feedback found</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
