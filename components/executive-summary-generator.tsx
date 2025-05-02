"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { FileUploader } from "./file-uploader"
import { ExecutiveSummary } from "./executive-summary"
import { processReportData, generateSlide } from "@/lib/report-processor"
import { SlideView } from "./slide-view"
import { PriorityView } from "./priority-view"
import { SignalsView } from "./signals-view"
import {
  Loader2,
  FileText,
  PenTool,
  LayoutTemplateIcon as LayoutPresentationIcon,
  ListIcon,
  Check,
  BarChart,
  Layers,
} from "lucide-react"
import type { PrioritizedReport } from "@/lib/priority-scorer"

export function ExecutiveSummaryGenerator() {
  const [rawInput, setRawInput] = useState("")
  const [csvData, setCsvData] = useState<string | null>(null)
  const [summary, setSummary] = useState<{
    items: Array<{
      type: "Task" | "Blocker" | "Win" | "Risk"
      content: string
      critical?: boolean
      date?: string
      priority?: number
    }>
    statusLine: string
    autoSummarized?: boolean
    stats?: {
      total: number
      read: number
      unread: number
      changed: number
      readPercentage: number
    }
    prioritizedReports?: PrioritizedReport[]
    categorizedSignals?: {
      tasksDone: string[]
      blockers: string[]
      wins: string[]
      risks: string[]
    }
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"summary" | "slide" | "priority" | "signals">("summary")
  const [useAutoSummarize, setUseAutoSummarize] = useState(true)
  const [usePriorityScoring, setUsePriorityScoring] = useState(true)

  const handleTextSubmit = async () => {
    if (!rawInput.trim()) return

    setIsLoading(true)
    try {
      // In a real app, this would call the OpenAI API using the LeaderFocusedToneAdjuster
      // For demo purposes, we'll use our local processing function
      const result = await processReportData(rawInput)
      setSummary(result)
    } catch (error) {
      console.error("Error processing input:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCsvSubmit = async () => {
    if (!csvData) return

    setIsLoading(true)
    try {
      // Process CSV data with auto-summarization if enabled
      const result = await processReportData(csvData, true, useAutoSummarize, usePriorityScoring)
      setSummary(result)
    } catch (error) {
      console.error("Error processing CSV:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = (content: string) => {
    setCsvData(content)
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="csv" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text" className="flex items-center">
            <PenTool className="mr-2 h-4 w-4" />
            Raw Text Input
          </TabsTrigger>
          <TabsTrigger value="csv" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            CSV Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <Card className="border-0 shadow-md overflow-hidden">
            <CardContent className="p-6">
              <Textarea
                placeholder="Paste your raw report data here... Include tasks, blockers, wins, and risks."
                className="min-h-[200px] resize-y border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
              />
              <Button
                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                onClick={handleTextSubmit}
                disabled={isLoading || !rawInput.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Generate Executive Summary"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="csv" className="space-y-4">
          <Card className="border-0 shadow-md overflow-hidden">
            <CardContent className="p-6">
              <FileUploader onFileUpload={handleFileUpload} />

              <div className="flex flex-col space-y-4 mt-6">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center">
                  <Switch
                    id="auto-summarize"
                    checked={useAutoSummarize}
                    onCheckedChange={setUseAutoSummarize}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <Label htmlFor="auto-summarize" className="font-medium text-blue-800 ml-2">
                    Use Auto-Summarization Engine
                  </Label>
                  <div className="ml-auto text-xs text-blue-600">Recommended</div>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 flex items-center">
                  <Switch
                    id="priority-scoring"
                    checked={usePriorityScoring}
                    onCheckedChange={setUsePriorityScoring}
                    className="data-[state=checked]:bg-purple-600"
                  />
                  <Label htmlFor="priority-scoring" className="font-medium text-purple-800 ml-2">
                    Enable Priority Scoring
                  </Label>
                  <div className="ml-auto text-xs text-purple-600">New</div>
                </div>
              </div>

              <Button
                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                onClick={handleCsvSubmit}
                disabled={isLoading || !csvData}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Generate Executive Summary"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {summary && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            {summary.autoSummarized && (
              <div className="text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200 flex items-center">
                <Check className="h-4 w-4 mr-1" />
                Auto-summarization applied
              </div>
            )}

            <div className="ml-auto flex flex-wrap gap-2">
              <Button
                variant={viewMode === "summary" ? "default" : "outline"}
                onClick={() => setViewMode("summary")}
                className="text-sm flex items-center"
              >
                <ListIcon className="mr-2 h-4 w-4" />
                Summary
              </Button>

              <Button
                variant={viewMode === "slide" ? "default" : "outline"}
                onClick={() => setViewMode("slide")}
                className="text-sm flex items-center"
              >
                <LayoutPresentationIcon className="mr-2 h-4 w-4" />
                Slide
              </Button>

              {summary.prioritizedReports && (
                <Button
                  variant={viewMode === "priority" ? "default" : "outline"}
                  onClick={() => setViewMode("priority")}
                  className="text-sm flex items-center"
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  Priority
                </Button>
              )}

              {summary.categorizedSignals && (
                <Button
                  variant={viewMode === "signals" ? "default" : "outline"}
                  onClick={() => setViewMode("signals")}
                  className="text-sm flex items-center"
                >
                  <Layers className="mr-2 h-4 w-4" />
                  Signals
                </Button>
              )}
            </div>
          </div>

          {viewMode === "summary" && <ExecutiveSummary data={summary} />}
          {viewMode === "slide" && <SlideView bullets={generateSlide(summary.items)} />}
          {viewMode === "priority" && summary.prioritizedReports && (
            <PriorityView reports={summary.prioritizedReports} />
          )}
          {viewMode === "signals" && summary.categorizedSignals && <SignalsView signals={summary.categorizedSignals} />}
        </div>
      )}
    </div>
  )
}
