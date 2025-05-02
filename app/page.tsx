import { ExecutiveSummaryGenerator } from "@/components/executive-summary-generator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto p-6 md:p-12">
        <header className="mb-8 text-center">
          <div className="inline-block mb-4 p-2 bg-blue-50 rounded-lg text-blue-600 font-medium text-sm">
            Leadership Report Generator
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Executive Summary Generator</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Transform raw team updates into concise, leadership-focused summaries. Upload your CSV report or paste raw
            text to generate professional executive reports.
          </p>
        </header>

        <ExecutiveSummaryGenerator />

        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>© 2025 Leadership Report Generator. All rights reserved.</p>
        </footer>
      </div>
    </main>
  )
}
