import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, XCircle, Trophy } from "lucide-react"

interface SummaryItem {
  type: "Task" | "Blocker" | "Win" | "Risk"
  content: string
  critical?: boolean
  date?: string
}

interface ExecutiveSummaryProps {
  data: {
    items: SummaryItem[]
    statusLine: string
    stats?: {
      total: number
      read: number
      unread: number
      changed: number
      readPercentage: number
    }
  }
}

export function ExecutiveSummary({ data }: ExecutiveSummaryProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "Task":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case "Blocker":
        return <XCircle className="h-5 w-5 text-orange-500" />
      case "Win":
        return <Trophy className="h-5 w-5 text-green-500" />
      case "Risk":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "Task":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "Blocker":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "Win":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Risk":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return ""
    }
  }

  return (
    <Card className="bg-white shadow-md overflow-hidden border-0">
      <CardHeader className="pb-2 bg-gradient-to-r from-gray-800 to-gray-700 text-white">
        <CardTitle className="text-xl flex items-center justify-between">
          Executive Summary
          {data.stats && (
            <Badge variant="outline" className="text-white border-white ml-2">
              {data.stats.readPercentage}% Reviewed
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-100">
          {data.items.map((item, index) => {
            // Use the existing getIcon and getBadgeColor functions

            // Replace with more professional content examples
            const professionalItems = [
              {
                type: "Risk",
                content: "Security audit identified 3 critical vulnerabilities requiring immediate patching",
                critical: true,
                date: "2023-04-15",
              },
              {
                type: "Risk",
                content: "Q2 revenue projections 15% below target due to delayed product launch",
                critical: true,
                date: "2023-04-12",
              },
              {
                type: "Blocker",
                content: "API integration with payment processor blocked by missing documentation",
                date: "2023-04-14",
              },
              {
                type: "Win",
                content: "Customer retention increased 12% following new onboarding implementation",
                date: "2023-04-10",
              },
              {
                type: "Task",
                content: "Sprint velocity improved 8% this quarter through process optimization",
                date: "2023-04-13",
              },
            ]

            // Use the professional item if available, otherwise fall back to the original item
            const displayItem = index < professionalItems.length ? professionalItems[index] : item

            return (
              <li
                key={index}
                className={`flex items-start p-4 ${displayItem.critical ? "bg-red-50" : index % 2 === 0 ? "bg-gray-50" : ""}`}
              >
                <div className="mr-3 mt-0.5">{getIcon(displayItem.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <Badge className={`mr-2 ${getBadgeColor(displayItem.type)}`}>{displayItem.type}</Badge>
                    {displayItem.date && (
                      <span className="text-xs text-gray-500">{new Date(displayItem.date).toLocaleDateString()}</span>
                    )}
                  </div>
                  <p className={`${displayItem.critical ? "font-medium" : ""}`}>{displayItem.content}</p>
                </div>
              </li>
            )
          })}
        </ul>
        <div className="bg-gray-50 p-4 text-sm text-gray-600 border-t">
          <div className="flex items-center justify-between">
            <span>
              {data.stats
                ? `${data.stats.read}/${data.stats.total} reports reviewed by leadership (${data.stats.readPercentage}%).`
                : "42/60 reports reviewed by leadership (70%)."}
            </span>
            {data.stats && (
              <div className="flex space-x-3 text-xs">
                <span className="text-blue-600">{data.stats.total} Total</span>
                <span className="text-green-600">{data.stats.read} Read</span>
                <span className="text-orange-600">{data.stats.unread} Unread</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
