// Fetch and analyze the report data
async function analyzeReports() {
  try {
    // Fetch the CSV data
    const response = await fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/week2%20-%20Problem_1_-_Unread_Report_Tracker__60_Rows_-H0Z9dTVprKY5rAjqs2cZKvlWgH3vsU.csv');
    const csvText = await response.text();
    
    // Parse CSV
    const rows = csvText.split('\n').map(row => row.split(','));
    const headers = rows[0];
    const data = rows.slice(1).filter(row => row.length === headers.length);
    
    // Create objects from the data
    const reports = data.map(row => {
      const report = {};
      headers.forEach((header, index) => {
        report[header] = row[index];
      });
      return report;
    });
    
    // Categorize reports
    const tasks = reports.filter(r => r.Section?.includes('task') || r.Feedback?.includes('task'));
    const blockers = reports.filter(r => r.Section?.includes('blocker') || r.Feedback?.includes('block'));
    const wins = reports.filter(r => r.Section?.includes('win') || r.Feedback?.includes('success'));
    const risks = reports.filter(r => r.Section?.includes('risk') || r.Feedback?.includes('risk'));
    
    // Count unread reports
    const totalReports = reports.length;
    const unreadReports = reports.filter(r => r.Leadership_Viewed === 'No').length;
    
    console.log("Report Analysis Summary:");
    console.log("----------------------");
    
    console.log("\nTop Tasks:");
    tasks.slice(0, 3).forEach(t => console.log(`- ${t.Section}: ${t.Feedback}`));
    
    console.log("\nKey Blockers:");
    blockers.slice(0, 3).forEach(b => console.log(`- ${b.Section}: ${b.Feedback}`));
    
    console.log("\nSignificant Wins:");
    wins.slice(0, 3).forEach(w => console.log(`- ${w.Section}: ${w.Feedback}`));
    
    console.log("\nCritical Risks:");
    risks.slice(0, 3).forEach(r => console.log(`- ${r.Section}: ${r.Feedback}`));
    
    console.log(`\nReport Status: ${totalReports - unreadReports}/${totalReports} reports reviewed by leadership.`);
    
  } catch (error) {
    console.error("Error analyzing reports:", error);
  }
}

analyzeReports();
