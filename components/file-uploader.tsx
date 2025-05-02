"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, FileText, Check, AlertCircle } from "lucide-react"

interface FileUploaderProps {
  onFileUpload: (content: string) => void
}

export function FileUploader({ onFileUpload }: FileUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isUploaded, setIsUploaded] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setError(null)
    setIsUploaded(false)

    if (!file) {
      setFileName(null)
      return
    }

    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file")
      setFileName(null)
      return
    }

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        onFileUpload(event.target.result as string)
        setIsUploaded(true)
      }
    }
    reader.readAsText(file)
  }

  const handleDemoFileClick = async () => {
    try {
      const response = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/week2%20-%20Problem_1_-_Unread_Report_Tracker__60_Rows_-q9WCdDI1mk3GKlhAluMDz7mWCBsmI8.csv",
      )
      const csvText = await response.text()
      onFileUpload(csvText)
      setFileName("week2 - Problem_1_-_Unread_Report_Tracker__60_Rows_.csv")
      setIsUploaded(true)
      setError(null)
    } catch (error) {
      setError("Error loading demo file")
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-dashed border-2 p-6 flex flex-col items-center justify-center bg-gray-50 transition-all hover:bg-gray-100">
        <Upload className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 mb-4">Upload your CSV report file</p>

        <div className="flex gap-2">
          <input type="file" id="file-upload" accept=".csv" className="hidden" onChange={handleFileChange} />

          <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
            Select File
          </Button>

          <Button variant="secondary" onClick={handleDemoFileClick}>
            <FileText className="mr-2 h-4 w-4" />
            Use Demo File
          </Button>
        </div>

        {fileName && (
          <div className="mt-4 flex items-center text-sm">
            {isUploaded ? (
              <Check className="h-4 w-4 text-green-500 mr-2" />
            ) : (
              <FileText className="h-4 w-4 text-blue-500 mr-2" />
            )}
            <span className={isUploaded ? "text-green-600" : "text-blue-600"}>
              {fileName} {isUploaded && "(Loaded)"}
            </span>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center text-sm text-red-600">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}
      </Card>
    </div>
  )
}
