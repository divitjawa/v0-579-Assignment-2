interface PriorityWeights {
  urgency: number
  impact: number
  recency: number
  votes: number
}

interface ImpactMapping {
  [key: string]: number
}

interface ReportRow {
  Report_Date: string
  Section: string
  Submitted_By: string
  Leadership_Viewed: string
  Feedback: string
  Changed_Since_Last_Week: string
  [key: string]: any
}

export interface PrioritizedReport extends ReportRow {
  priority_score: number
  urgency: number
  impact: number
  recency_score: number
  votes: number
  days_since: number
}

export function prioritizeSignals(
  data: ReportRow[],
  topN = 10,
  weights: PriorityWeights = { urgency: 0.4, impact: 0.3, recency: 0.2, votes: 0.1 },
  impactMapping?: ImpactMapping,
): PrioritizedReport[] {
  // Default impact mapping if not provided
  const defaultImpactMapping: ImpactMapping = {
    "Sprint velocity": 5,
    "Hiring pipeline": 4,
    "Marketing campaigns": 3,
    "Design progress": 3,
    "Tech Debt": 4,
    "Product Launches": 5,
    "Customer Feedback": 4,
    "Support Issues": 4,
    "Internal Operations": 3,
    "Sales Performance": 5,
  }

  const mapping = impactMapping || defaultImpactMapping

  // Feature Engineering
  const processedData = data.map((row) => {
    // Calculate urgency
    const urgency = row.Changed_Since_Last_Week === "Yes" ? 5 : 2

    // Calculate impact
    const impact = mapping[row.Section] || 3

    // Calculate votes
    const votes = row.Feedback?.trim() === "👍" ? 1 : 0

    // Calculate recency
    const reportDate = new Date(row.Report_Date)
    const mostRecentDate = new Date(Math.max(...data.map((r) => new Date(r.Report_Date).getTime())))
    const daysSince = Math.floor((mostRecentDate.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24))
    const recencyScore = Math.max(0.5, 1 - daysSince / 14)

    // Calculate priority score
    const priorityScore =
      weights.urgency * urgency +
      weights.impact * impact +
      weights.recency * recencyScore * 5 +
      weights.votes * votes * 5

    return {
      ...row,
      urgency,
      impact,
      votes,
      days_since: daysSince,
      recency_score: recencyScore,
      priority_score: priorityScore,
    }
  })

  // Sort by priority score and return top N
  return processedData.sort((a, b) => b.priority_score - a.priority_score).slice(0, topN)
}

// Function to categorize signals based on keywords
export function categorizeSignals(data: ReportRow[]) {
  const tasksDone: string[] = []
  const blockers: string[] = []
  const wins: string[] = []
  const risks: string[] = []

  // Keyword buckets
  const feedbackBlockerKeywords = ["needs clarity", "why is this", "not relevant", "who owns this"]
  const feedbackRiskKeywords = ["duplicate info", "remove this", "update next week"]
  const feedbackWinKeywords = ["looks good"]

  // Process each row
  data.forEach((row) => {
    const change = row.Changed_Since_Last_Week?.trim().toLowerCase() || ""
    const feedback = row.Feedback?.trim().toLowerCase() || ""
    const section = row.Section?.trim() || "Unknown"

    // Build unified summary
    const summary = `Section: ${section} | Change: ${change} | Feedback: ${feedback}`

    // Classify into exactly one bucket
    if (change === "yes" || change === "reworded") {
      tasksDone.push(summary)
    } else if (change === "barely" || feedbackBlockerKeywords.some((k) => feedback.includes(k))) {
      blockers.push(summary)
    } else if (feedbackWinKeywords.some((k) => feedback.includes(k))) {
      wins.push(summary)
    } else if (change === "no" || change === "barely" || feedbackRiskKeywords.some((k) => feedback.includes(k))) {
      risks.push(summary)
    }
  })

  // Deduplicate
  const dedup = (arr: string[]) => [...new Set(arr.filter((item) => item.trim()))]

  return {
    tasksDone: dedup(tasksDone),
    blockers: dedup(blockers),
    wins: dedup(wins),
    risks: dedup(risks),
  }
}
