import React, { useState } from 'react'
import { PageResult } from '../types'

interface Props {
  results: PageResult[]
  getScreenshot?: (path: string) => Promise<string | null>
  status: string
}

export default function ResultsPanel({ results, getScreenshot, status }: Props) {
  const [selectedResult, setSelectedResult] = useState<number | null>(null)
  const [screenshots, setScreenshots] = useState<Record<string, string>>({})

  const loadScreenshot = async (path: string) => {
    if (screenshots[path]) return
    const b64 = await getScreenshot?.(path)
    if (b64) setScreenshots(prev => ({ ...prev, [path]: b64 }))
  }

  if (results.length === 0 && status !== 'running') {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p>Select a folder and click <strong>Start QA</strong> to begin scanning.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {results.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <SummaryCard label="Pages Scanned" value={results.length} icon="📄" />
          <SummaryCard label="Rule Issues" value={results.reduce((s, r) => s + r.rule_issues.length, 0)} icon="�" />
          <SummaryCard label="AI Issues" value={results.reduce((s, r) => s + (r.ai_result?.issues?.length || 0), 0)} icon="🤖" />
        </div>
      )}

      {/* Results Grid */}
      <div className="grid gap-4">
        {results.map((r, i) => (
          <div key={i} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            {/* File header */}
            <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 text-sm font-mono">{r.file}</span>
                <span className="text-xs text-gray-500">({r.metrics.body_width}px wide, {r.metrics.total_images} images)</span>
              </div>
              <div className="flex gap-2">
                {r.rule_issues.length > 0 && (
                  <span className="bg-yellow-900/50 text-yellow-400 text-xs px-2 py-0.5 rounded-full">
                    {r.rule_issues.length} rule
                  </span>
                )}
                {r.ai_result?.issues?.length > 0 && (
                  <span className="bg-purple-900/50 text-purple-400 text-xs px-2 py-0.5 rounded-full">
                    {r.ai_result.issues.length} AI
                  </span>
                )}
                {r.ai_result?.score !== undefined && (
                  <ScoreBadge score={r.ai_result.score} />
                )}
              </div>
            </div>

            {/* Expanded view */}
            <div className="p-4">
              <div className="flex gap-4">
                {/* Screenshot thumbnail */}
                <button
                  onClick={() => { setSelectedResult(i); loadScreenshot(r.screenshot) }}
                  className="w-48 h-32 bg-gray-700 rounded-lg overflow-hidden border border-gray-600 flex-shrink-0 hover:border-blue-500 transition-colors"
                >
                  {screenshots[r.screenshot] ? (
                    <img src={`data:image/png;base64,${screenshots[r.screenshot]}`} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">Click to load</div>
                  )}
                </button>

                {/* Issues list */}
                <div className="flex-1 min-w-0 space-y-2 max-h-32 overflow-y-auto">
                  {r.rule_issues.map((issue, j) => (
                    <div key={j} className="flex items-start gap-2 text-xs">
                      <RuleBadge type={issue.type} />
                      <span className="text-gray-300 truncate">{issue.src || issue.text || ''}</span>
                    </div>
                  ))}
                  {r.ai_result?.issues?.map((issue, j) => (
                    <div key={`ai-${j}`} className="flex items-start gap-2 text-xs">
                      <SeverityBadge severity={issue.severity} />
                      <span className="text-gray-300">{issue.description}</span>
                    </div>
                  ))}
                  {r.rule_issues.length === 0 && (!r.ai_result?.issues || r.ai_result.issues.length === 0) && (
                    <p className="text-green-400 text-xs">✅ No issues found</p>
                  )}
                  {r.ai_result?.summary && (
                    <p className="text-gray-500 text-xs italic mt-1">AI: {r.ai_result.summary}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SummaryCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 7 ? 'text-green-400' : score >= 4 ? 'text-yellow-400' : 'text-red-400'
  return <span className={`text-xs font-bold ${color}`}>{score}/10</span>
}

function RuleBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    broken_image: 'bg-red-900 text-red-400',
    missing_alt: 'bg-yellow-900 text-yellow-400',
    missing_viewport: 'bg-orange-900 text-orange-400',
    horizontal_overflow: 'bg-red-900 text-red-400',
    low_contrast: 'bg-yellow-900 text-yellow-400',
    possible_overlap: 'bg-orange-900 text-orange-400',
  }
  return <span className={`${colors[type] || 'bg-gray-700 text-gray-400'} px-1.5 py-0.5 rounded text-[10px] font-medium`}>{type.replace(/_/g, ' ')}</span>
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    high: 'bg-red-900 text-red-400',
    medium: 'bg-yellow-900 text-yellow-400',
    low: 'bg-blue-900 text-blue-400',
  }
  return <span className={`${colors[severity] || 'bg-gray-700'} px-1.5 py-0.5 rounded text-[10px] font-medium`}>{severity}</span>
}
