interface ReportRow {
  Report_Date: string
  Section: string
  Submitted_By: string
  Leadership_Viewed: string
  Feedback: string
  Changed_Since_Last_Week: string
  [key: string]: any // For other columns that might be present
}

export function autoSummarize(data: ReportRow[]): string[] {
  const summaries: string[] = []

  // Filter for only reports that changed (skip unchanged)
  const changedData = data.filter((row) => row.Changed_Since_Last_Week !== "No")

  for (const row of changedData) {
    const section = row.Section
    const feedback = row.Feedback
    const change = row.Changed_Since_Last_Week

    // Handle if feedback is missing
    if (!feedback) {
      summaries.push(`Update in '${section}': content was ${change.toLowerCase()}.`)
      continue
    }

    // Keyword detection to prioritize important issues
    const feedbackLower = feedback.toLowerCase()
    const sectionLower = section.toLowerCase()

    if (feedbackLower.includes("duplicate")) {
      summaries.push(`'${section}' flagged for duplicate content. Needs review.`)
    } else if (
      feedbackLower.includes("blocker") ||
      feedbackLower.includes("blocked") ||
      sectionLower.includes("blocker")
    ) {
      summaries.push(`Blocker identified in '${section}': ${feedback}.`)
    } else if (feedbackLower.includes("risk") || sectionLower.includes("risk")) {
      summaries.push(`Risk noted in '${section}': ${feedback}.`)
    } else if (
      feedbackLower.includes("win") ||
      feedbackLower.includes("success") ||
      sectionLower.includes("win") ||
      sectionLower.includes("achievement")
    ) {
      summaries.push(`Big win in '${section}': ${feedback}.`)
    } else if (
      sectionLower.includes("task") ||
      sectionLower.includes("milestone") ||
      sectionLower.includes("progress")
    ) {
      summaries.push(`Task update: '${section}' - ${feedback}.`)
    } else {
      summaries.push(`'${section}' updated: ${feedback}.`)
    }
  }

  return summaries
}

// Helper function to convert CSV text to an array of objects
export function parseCsvToObjects(csvText: string): ReportRow[] {
  const lines = csvText.trim().split("\n")
  const headers = lines[0].split(",")

  return lines.slice(1).map((line) => {
    const values = line.split(",")
    const row: ReportRow = {
      Report_Date: "",
      Section: "",
      Submitted_By: "",
      Leadership_Viewed: "",
      Feedback: "",
      Changed_Since_Last_Week: "",
    }

    headers.forEach((header, index) => {
      if (values[index] !== undefined) {
        row[header] = values[index]
      }
    })

    return row
  })
}

// Function to get statistics about the reports
export function getReportStats(data: ReportRow[]) {
  const total = data.length
  const unread = data.filter((row) => row.Leadership_Viewed === "No").length
  const read = total - unread
  const changed = data.filter((row) => row.Changed_Since_Last_Week !== "No").length

  return {
    total,
    read,
    unread,
    changed,
    readPercentage: Math.round((read / total) * 100),
  }
}
