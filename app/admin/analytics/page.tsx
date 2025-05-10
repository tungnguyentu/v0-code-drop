import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { AnalyticsOverview } from "@/components/admin/analytics/overview"
import { LanguageDistribution } from "@/components/admin/analytics/language-distribution"
import { CreationTrend } from "@/components/admin/analytics/creation-trend"
import { ViewLimitDistribution } from "@/components/admin/analytics/view-limit-distribution"
import { ExpirationDistribution } from "@/components/admin/analytics/expiration-distribution"
import { MostViewedSnippets } from "@/components/admin/analytics/most-viewed-snippets"
import { HourlyDistribution } from "@/components/admin/analytics/hourly-distribution"
import {
  getAnalyticsCounts,
  getLanguageDistribution,
  getCreationTrend,
  getViewLimitDistribution,
  getExpirationDistribution,
  getMostViewedSnippets,
  getHourlyDistribution,
} from "@/app/actions/analytics"

export default async function AnalyticsDashboardPage() {
  // Fetch all analytics data in parallel
  const [
    counts,
    languageDistribution,
    creationTrend,
    viewLimitDistribution,
    expirationDistribution,
    mostViewedSnippets,
    hourlyDistribution,
  ] = await Promise.all([
    getAnalyticsCounts(),
    getLanguageDistribution(),
    getCreationTrend(),
    getViewLimitDistribution(),
    getExpirationDistribution(),
    getMostViewedSnippets(5),
    getHourlyDistribution(),
  ])

  return (
    <DashboardLayout title="Analytics Dashboard">
      <div className="space-y-6">
        <AnalyticsOverview data={counts} />

        <div className="grid gap-6 md:grid-cols-2">
          <LanguageDistribution data={languageDistribution} />
          <ViewLimitDistribution data={viewLimitDistribution} />
        </div>

        <CreationTrend data={creationTrend} />

        <div className="grid gap-6 md:grid-cols-2">
          <ExpirationDistribution data={expirationDistribution} />
          <HourlyDistribution data={hourlyDistribution} />
        </div>

        <MostViewedSnippets data={mostViewedSnippets} />
      </div>
    </DashboardLayout>
  )
}
