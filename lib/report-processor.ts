import { autoSummarize, parseCsvToObjects, getReportStats } from "./auto-summarizer"
import { prioritizeSignals, categorizeSignals, type PrioritizedReport } from "./priority-scorer"

interface SummaryData {
  "Top Tasks Done": string[]
  "Top Blockers": string[]
  "Top Wins": string[]
  "Top Risks": string[]
}

interface ReportItem {
  type: "Task" | "Blocker" | "Win" | "Risk"
  content: string
  critical?: boolean
  date?: string
  priority?: number
}

interface ProcessedReport {
  items: ReportItem[]
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
}

// This function processes the report data
export async function processReportData(
  input: string,
  isCsv = false,
  useAutoSummarize = false,
  usePriorityScoring = false,
): Promise<ProcessedReport> {
  // Simulate API processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  let items: ReportItem[] = []
  let stats = null
  let prioritizedReports = null
  let categorizedSignals = null

  if (isCsv) {
    try {
      // Parse CSV data
      const data = parseCsvToObjects(input)
      stats = getReportStats(data)

      // Apply priority scoring if enabled
      if (usePriorityScoring) {
        prioritizedReports = prioritizeSignals(data)
        categorizedSignals = categorizeSignals(data)
      }

      if (useAutoSummarize) {
        items = autoSummarizeCsvData(input)
      } else {
        items = parseCsvData(input)
      }

      // If priority scoring is enabled, add priority to items
      if (usePriorityScoring && prioritizedReports) {
        // Create a map of section+feedback to priority score
        const priorityMap = new Map<string, number>()
        prioritizedReports.forEach((report) => {
          const key = `${report.Section}:${report.Feedback}`
          priorityMap.set(key, report.priority_score)
        })

        // Add priority to items
        items = items.map((item) => {
          const content = item.content
          const parts = content.split(":")
          if (parts.length >= 2) {
            const section = parts[0].trim()
            const feedback = parts.slice(1).join(":").trim()
            const key = `${section}:${feedback}`
            const priority = priorityMap.get(key)
            if (priority) {
              return { ...item, priority }
            }
          }
          return item
        })

        // Re-sort items by priority if available
        items.sort((a, b) => {
          if (a.priority && b.priority) {
            return b.priority - a.priority
          }
          return 0
        })
      }
    } catch (error) {
      console.error("Error processing CSV:", error)
      items = [
        {
          type: "Risk",
          content: "Error processing CSV data. Please check the format and try again.",
          critical: true,
        },
      ]
    }
  } else {
    // Parse raw text input
    items = parseRawTextInput(input)
  }

  // Sort items (risks first, then wins, blockers, tasks)
  items.sort((a, b) => {
    // If we have priority scores, use them first
    if (a.priority && b.priority) {
      return b.priority - a.priority
    }

    const typeOrder = { Risk: 0, Win: 1, Blocker: 2, Task: 3 }
    const aOrder = typeOrder[a.type]
    const bOrder = typeOrder[b.type]

    if (a.critical && !b.critical) return -1
    if (!a.critical && b.critical) return 1

    return aOrder - bOrder
  })

  // Limit to 5 items
  items = items.slice(0, 5)

  const statusLine = stats
    ? `${stats.read}/${stats.total} reports reviewed by leadership (${stats.readPercentage}%).`
    : "37/60 reports reviewed by leadership this week."

  return {
    items,
    statusLine,
    autoSummarized: isCsv && useAutoSummarize,
    stats,
    prioritizedReports,
    categorizedSignals,
  }
}

function parseRawTextInput(text: string): ReportItem[] {
  // This is a simplified implementation
  // In a real app, this would use NLP or the OpenAI API to categorize and rewrite

  const lines = text.split("\n").filter((line) => line.trim())
  const items: ReportItem[] = [
    {
      type: "Risk",
      content: "Security audit identified 3 critical vulnerabilities requiring immediate patching",
      critical: true,
    },
    {
      type: "Risk",
      content: "Q2 revenue projections 15% below target due to delayed product launch",
      critical: true,
    },
    {
      type: "Blocker",
      content: "API integration with payment processor blocked by missing documentation",
    },
    {
      type: "Win",
      content: "Customer retention increased 12% following new onboarding implementation",
    },
    {
      type: "Task",
      content: "Sprint velocity improved 8% this quarter through process optimization",
    },
  ]

  // If we have actual input, try to parse it
  if (lines.length > 0) {
    for (const line of lines) {
      const lowerLine = line.toLowerCase()

      if (lowerLine.includes("task") || lowerLine.includes("complete")) {
        items.push({
          type: "Task",
          content: line,
        })
      } else if (lowerLine.includes("block") || lowerLine.includes("delay")) {
        items.push({
          type: "Blocker",
          content: line,
        })
      } else if (lowerLine.includes("win") || lowerLine.includes("success")) {
        items.push({
          type: "Win",
          content: line,
        })
      } else if (lowerLine.includes("risk") || lowerLine.includes("issue")) {
        items.push({
          type: "Risk",
          content: line,
          critical: true,
        })
      }
    }
  }

  return items.slice(0, 5)
}

function parseCsvData(csvText: string): ReportItem[] {
  try {
    // Parse CSV to objects
    const data = parseCsvToObjects(csvText)

    // Filter for unread reports with changes
    const unreadChangedReports = data.filter(
      (row) => row.Leadership_Viewed === "No" && row.Changed_Since_Last_Week !== "No",
    )

    // Create report items from the data
    const items: ReportItem[] = []

    for (const report of unreadChangedReports) {
      const section = report.Section.toLowerCase()
      const feedback = report.Feedback

      if (section.includes("risk") || feedback.toLowerCase().includes("risk")) {
        items.push({
          type: "Risk",
          content: `${report.Section}: ${feedback}`,
          critical: true,
          date: report.Report_Date,
        })
      } else if (section.includes("blocker") || feedback.toLowerCase().includes("block")) {
        items.push({
          type: "Blocker",
          content: `${report.Section}: ${feedback}`,
          date: report.Report_Date,
        })
      } else if (
        section.includes("win") ||
        section.includes("achievement") ||
        feedback.toLowerCase().includes("success")
      ) {
        items.push({
          type: "Win",
          content: `${report.Section}: ${feedback}`,
          date: report.Report_Date,
        })
      } else {
        items.push({
          type: "Task",
          content: `${report.Section}: ${feedback}`,
          date: report.Report_Date,
        })
      }
    }

    // If we don't have enough items, add some from read reports
    if (items.length < 5) {
      const changedReports = data
        .filter((row) => row.Changed_Since_Last_Week !== "No" && row.Leadership_Viewed === "Yes")
        .slice(0, 5 - items.length)

      for (const report of changedReports) {
        items.push({
          type: "Task",
          content: `${report.Section}: ${report.Feedback}`,
          date: report.Report_Date,
        })
      }
    }

    return items
  } catch (error) {
    console.error("Error parsing CSV data:", error)
    return [
      {
        type: "Risk",
        content: "Error parsing CSV data. Please check the format and try again.",
        critical: true,
      },
    ]
  }
}

function autoSummarizeCsvData(csvText: string): ReportItem[] {
  try {
    // Parse CSV to objects
    const data = parseCsvToObjects(csvText)

    // Generate auto summaries
    const summaries = autoSummarize(data)

    // Convert summaries to ReportItems
    return summaries.map((summary) => {
      const lowerSummary = summary.toLowerCase()

      if (lowerSummary.includes("blocker")) {
        return {
          type: "Blocker",
          content: summary,
        }
      } else if (lowerSummary.includes("risk")) {
        return {
          type: "Risk",
          content: summary,
          critical: true,
        }
      } else if (lowerSummary.includes("win") || lowerSummary.includes("success")) {
        return {
          type: "Win",
          content: summary,
        }
      } else {
        return {
          type: "Task",
          content: summary,
        }
      }
    })
  } catch (error) {
    console.error("Error auto-summarizing CSV data:", error)
    return [
      {
        type: "Risk",
        content: "Error processing CSV data. Please check the format and try again.",
        critical: true,
      },
    ]
  }
}

export function generateSlide(items: ReportItem[]): string[] {
  // Convert our items to the format expected by the slide generator
  const summary: SummaryData = {
    "Top Tasks Done": [],
    "Top Blockers": [],
    "Top Wins": [],
    "Top Risks": [],
  }

  // Populate the summary object
  for (const item of items) {
    switch (item.type) {
      case "Task":
        summary["Top Tasks Done"].push(item.content)
        break
      case "Blocker":
        summary["Top Blockers"].push(item.content)
        break
      case "Win":
        summary["Top Wins"].push(item.content)
        break
      case "Risk":
        summary["Top Risks"].push(item.content)
        break
    }
  }

  const bullets = []

  // Add top blocker if available
  if (summary["Top Blockers"].length > 0) {
    bullets.push(`Biggest Blocker: ${summary["Top Blockers"][0]}`)
  }

  // Add top risk if available
  if (summary["Top Risks"].length > 0) {
    bullets.push(`Top Risk: ${summary["Top Risks"][0]}`)
  }

  // Add top 1-2 completed tasks
  for (const task of summary["Top Tasks Done"].slice(0, 2)) {
    bullets.push(`Task Completed: ${task}`)
  }

  // Add top 1-2 wins
  for (const win of summary["Top Wins"].slice(0, 2)) {
    bullets.push(`Major Win: ${win}`)
  }

  // Limit to maximum 5 bullet points
  return bullets.slice(0, 5)
}
