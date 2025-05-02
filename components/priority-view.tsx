import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { PrioritizedReport } from "@/lib/priority-scorer"
import { AlertTriangle, Clock, TrendingUp, Award } from "lucide-react"

interface PriorityViewProps {
  reports: PrioritizedReport[]
}

export function PriorityView({ reports }: PriorityViewProps) {
  return (
    <Card className="bg-white shadow-md overflow-hidden border-0">
      <CardHeader className="pb-2 bg-gradient-to-r from-purple-800 to-purple-700 text-white">
        <CardTitle className="text-xl flex items-center justify-between">
          Prioritized Signals
          <Badge variant="outline" className="text-white border-white ml-2">
            Top {reports.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-100">
          {reports.map((report, index) => (
            <li key={index} className={`p-4 ${index % 2 === 0 ? "bg-gray-50" : ""}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 mr-2">
                    Score: {report.priority_score.toFixed(1)}
                  </Badge>
                  <span className="text-sm text-gray-500">{new Date(report.Report_Date).toLocaleDateString()}</span>
                </div>
                <div className="flex space-x-2">
                  {report.urgency > 3 && (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Urgent
                    </Badge>
                  )}
                  {report.impact > 3 && (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      High Impact
                    </Badge>
                  )}
                  {report.votes > 0 && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center">
                      <Award className="h-3 w-3 mr-1" />
                      Voted
                    </Badge>
                  )}
                </div>
              </div>
              <div className="mb-1 font-medium">{report.Section}</div>
              <p className="text-gray-700">{report.Feedback}</p>
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <span className="flex items-center mr-3">
                  <AlertTriangle className="h-3 w-3 mr-1 text-orange-500" />
                  Urgency: {report.urgency}
                </span>
                <span className="flex items-center mr-3">
                  <TrendingUp className="h-3 w-3 mr-1 text-blue-500" />
                  Impact: {report.impact}
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-gray-500" />
                  {report.days_since} days ago
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
