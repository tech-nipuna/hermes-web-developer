import React, { useState } from 'react'
import { PageResult } from '../types'

interface Props {
  results: PageResult[]
  getScreenshot?: (path: string) => Promise<string | null>
  status: string
}

export default function ResultsPanel({ results, getScreenshot, status }: Props) {
  const [screenshots, setScreenshots] = useState<Record<string, string>>({})

  const loadScreenshot = async (path: string) => {
    if (screenshots[path]) return
    const b64 = await getScreenshot?.(path)
    if (b64) setScreenshots(prev => ({ ...prev, [path]: b64 }))
  }

  if (results.length === 0 && status === 'idle') {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">QA</div>
          <h2 className="text-xl font-semibold text-gray-300 mb-2">Web QA Agent</h2>
          <p className="text-sm">Select a folder with HTML files and click <strong>Start QA</strong> to begin automated quality checks.</p>
          <div className="mt-6 text-left bg-gray-800 rounded-lg p-4 text-xs text-gray-400">
            <p className="font-medium text-gray-300 mb-2">What it checks:</p>
            <ul className="space-y-1">
              <li>Broken images & missing alt text</li>
              <li>Horizontal overflow & missing viewport meta</li>
              <li>JavaScript errors</li>
              <li>AI vision analysis (layout, text, visual quality)</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  if (results.length === 0 && status === 'running') {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm">Scanning pages...</p>
        </div>
      </div>
    )
  }

  const totalRuleIssues = results.reduce((s, r) => s + r.rule_issues.length, 0)
  const totalAiIssues = results.reduce((s, r) => s + (r.ai_result?.issues?.length || 0), 0)
  const scores = results.map(r => r.ai_result?.score || 0).filter(s => s > 0)
  const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '—'

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <SummaryCard label="Pages" value={results.length} icon="pages" />
        <SummaryCard label="Rule Issues" value={totalRuleIssues} icon="rule" />
        <SummaryCard label="AI Findings" value={totalAiIssues} icon="ai" />
        <SummaryCard label="Avg Score" value={avgScore} icon="score" />
      </div>

      {/* Results */}
      {results.map((r, i) => (
        <div key={i} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-blue-400 text-sm font-mono truncate">{r.file}</span>
              <span className="text-xs text-gray-500 flex-shrink-0">({r.metrics.body_width}px)</span>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {r.rule_issues.length > 0 && (
                <span className="bg-yellow-900/60 text-yellow-400 text-xs px-2 py-0.5 rounded-full">
                  {r.rule_issues.length} rule
                </span>
              )}
              {r.ai_result?.issues?.length > 0 && (
                <span className="bg-purple-900/60 text-purple-400 text-xs px-2 py-0.5 rounded-full">
                  {r.ai_result.issues.length} AI
                </span>
              )}
              {r.ai_result?.score > 0 && <ScoreBadge score={r.ai_result.score} />}
            </div>
          </div>

          <div className="p-4">
            <div className="flex gap-4">
              <button
                onClick={() => loadScreenshot(r.screenshot)}
                className="w-52 h-36 bg-gray-700 rounded-lg overflow-hidden border border-gray-600 flex-shrink-0 hover:border-blue-500 transition-colors"
              >
                {screenshots[r.screenshot] ? (
                  <img src={`data:image/png;base64,${screenshots[r.screenshot]}`} className="w-full h-full object-cover object-top" alt="" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                    <span className="text-2xl"></span>
                    <span className="text-xs mt-1">Click to load</span>
                  </div>
                )}
              </button>

              <div className="flex-1 min-w-0 space-y-1.5 max-h-40 overflow-y-auto">
                {r.rule_issues.map((iss, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs">
                    <RuleBadge type={iss.type} count={iss.count} />
                    <span className="text-gray-300 truncate">{iss.src || iss.message || iss.text || JSON.stringify(iss)}</span>
                  </div>
                ))}
                {r.ai_result?.issues?.map((iss, j) => (
                  <div key={`ai-${j}`} className="flex items-center gap-2 text-xs">
                    <SeverityBadge severity={iss.severity} />
                    <span className="text-gray-300">{iss.description}</span>
                    {iss.location && <span className="text-gray-600 text-[10px]">({iss.location})</span>}
                  </div>
                ))}
                {r.rule_issues.length === 0 && (!r.ai_result?.issues || r.ai_result.issues.length === 0) && (
                  <p className="text-green-400 text-xs">No issues found</p>
                )}
                {r.ai_result?.error && (
                  <p className="text-red-400 text-xs">AI: {r.ai_result.error}</p>
                )}
                {r.ai_result?.summary && (
                  <p className="text-gray-500 text-[11px] italic mt-1">AI Summary: {r.ai_result.summary}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function SummaryCard({ label, value, icon }: { label: string; value: number | string; icon: string }) {
  const icons: Record<string, string> = { pages: "", rule: "", ai: "", score: "" }
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-3 text-center">
      <div className="text-xl mb-0.5">{icons[icon]}</div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 7 ? 'text-green-400 bg-green-900/40' : score >= 4 ? 'text-yellow-400 bg-yellow-900/40' : 'text-red-400 bg-red-900/40'
  return <span className={`${color} text-xs font-bold px-2 py-0.5 rounded-full`}>{score}/10</span>
}

function RuleBadge({ type, count }: { type: string; count?: number }) {
  const colors: Record<string, string> = {
    broken_image: 'bg-red-900/60 text-red-400',
    missing_alt: 'bg-yellow-900/60 text-yellow-400',
    missing_viewport: 'bg-orange-900/60 text-orange-400',
    horizontal_overflow: 'bg-red-900/60 text-red-400',
    low_contrast: 'bg-yellow-900/60 text-yellow-400',
    js_error: 'bg-red-900/60 text-red-400',
  }
  return (
    <span className={`${colors[type] || 'bg-gray-700 text-gray-400'} px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap`}>
      {type.replace(/_/g, ' ')}{count ? ` (${count})` : ''}
    </span>
  )
}

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    high: 'bg-red-900/60 text-red-400',
    medium: 'bg-yellow-900/60 text-yellow-400',
    low: 'bg-blue-900/60 text-blue-400',
  }
  return <span className={`${colors[severity] || 'bg-gray-700'} px-1.5 py-0.5 rounded text-[10px] font-medium`}>{severity}</span>
}
