import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, Trophy, AlertTriangle } from "lucide-react"

interface SignalsViewProps {
  signals: {
    tasksDone: string[]
    blockers: string[]
    wins: string[]
    risks: string[]
  }
}

export function SignalsView({ signals }: SignalsViewProps) {
  const { tasksDone, blockers, wins, risks } = signals

  return (
    <Card className="bg-white shadow-md overflow-hidden border-0">
      <CardHeader className="pb-2 bg-gradient-to-r from-gray-800 to-gray-700 text-white">
        <CardTitle className="text-xl">Categorized Signals</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tasks" className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-blue-500" />
              Tasks ({tasksDone.length})
            </TabsTrigger>
            <TabsTrigger value="blockers" className="flex items-center">
              <XCircle className="h-4 w-4 mr-1 text-orange-500" />
              Blockers ({blockers.length})
            </TabsTrigger>
            <TabsTrigger value="wins" className="flex items-center">
              <Trophy className="h-4 w-4 mr-1 text-green-500" />
              Wins ({wins.length})
            </TabsTrigger>
            <TabsTrigger value="risks" className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
              Risks ({risks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="mt-4">
            <ul className="space-y-2">
              {tasksDone.map((task, index) => (
                <li key={index} className="p-3 bg-blue-50 rounded-md text-blue-800">
                  {task}
                </li>
              ))}
              {tasksDone.length === 0 && (
                <li className="p-3 bg-gray-50 rounded-md text-gray-500 italic">No tasks found</li>
              )}
            </ul>
          </TabsContent>

          <TabsContent value="blockers" className="mt-4">
            <ul className="space-y-2">
              {blockers.map((blocker, index) => (
                <li key={index} className="p-3 bg-orange-50 rounded-md text-orange-800">
                  {blocker}
                </li>
              ))}
              {blockers.length === 0 && (
                <li className="p-3 bg-gray-50 rounded-md text-gray-500 italic">No blockers found</li>
              )}
            </ul>
          </TabsContent>

          <TabsContent value="wins" className="mt-4">
            <ul className="space-y-2">
              {wins.map((win, index) => (
                <li key={index} className="p-3 bg-green-50 rounded-md text-green-800">
                  {win}
                </li>
              ))}
              {wins.length === 0 && <li className="p-3 bg-gray-50 rounded-md text-gray-500 italic">No wins found</li>}
            </ul>
          </TabsContent>

          <TabsContent value="risks" className="mt-4">
            <ul className="space-y-2">
              {risks.map((risk, index) => (
                <li key={index} className="p-3 bg-red-50 rounded-md text-red-800">
                  {risk}
                </li>
              ))}
              {risks.length === 0 && <li className="p-3 bg-gray-50 rounded-md text-gray-500 italic">No risks found</li>}
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
