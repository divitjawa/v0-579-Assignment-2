import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, XCircle, Trophy } from "lucide-react"

interface SlideViewProps {
  bullets: string[]
}

export function SlideView({ bullets }: SlideViewProps) {
  const getIcon = (label: string) => {
    if (label.includes("Blocker")) {
      return <XCircle className="h-6 w-6 text-orange-500" />
    } else if (label.includes("Risk")) {
      return <AlertTriangle className="h-6 w-6 text-red-500" />
    } else if (label.includes("Task")) {
      return <CheckCircle className="h-6 w-6 text-blue-500" />
    } else if (label.includes("Win")) {
      return <Trophy className="h-6 w-6 text-green-500" />
    }
    return null
  }

  const getLabelColor = (label: string) => {
    if (label.includes("Blocker")) {
      return "bg-orange-100 text-orange-800"
    } else if (label.includes("Risk")) {
      return "bg-red-100 text-red-800"
    } else if (label.includes("Task")) {
      return "bg-blue-100 text-blue-800"
    } else if (label.includes("Win")) {
      return "bg-green-100 text-green-800"
    }
    return "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="bg-white shadow-md overflow-hidden border-0">
      <CardHeader className="pb-4 bg-gradient-to-r from-gray-800 to-gray-700 text-white">
        <CardTitle className="text-xl">Executive One-Slide Report</CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-gradient-to-b from-gray-50 to-white">
        <ul className="space-y-6">
          {bullets.map((bullet, index) => {
            // Extract the label and content
            const [label, content] = bullet.split(": ")

            return (
              <li key={index} className="flex items-start">
                <div className="mr-3 mt-1">{getIcon(label)}</div>
                <div>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${getLabelColor(label)}`}
                  >
                    {label}
                  </span>
                  <p className="text-lg font-medium text-gray-800">{content}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
