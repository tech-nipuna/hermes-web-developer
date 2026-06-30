import React, { useState, useEffect, useRef } from 'react'
import FolderSelect from './components/FolderSelect'
import ConfigPanel from './components/ConfigPanel'
import ResultsPanel from './components/ResultsPanel'
import LogConsole from './components/LogConsole'
import { QAEvent, QAConfig, PageResult } from './types'

declare global {
  interface Window {
    electronAPI: {
      selectFolder: () => Promise<string | null>
      startQA: (folder: string, config: any) => Promise<{ ok: boolean }>
      stopQA: () => void
      getScreenshot: (path: string) => Promise<string | null>
      exportResults: (results: string) => Promise<string | null>
      onQAEvent: (cb: (e: QAEvent) => void) => void
      onQALog: (cb: (msg: string) => void) => void
      onQAError: (cb: (msg: string) => void) => void
      onQAFinished: (cb: (e: any) => void) => void
    }
  }
}

const VIEWPORTS = [
  { label: 'Mobile', w: 375, h: 812 },
  { label: 'Tablet', w: 768, h: 1024 },
  { label: 'Desktop', w: 1280, h: 800 },
  { label: 'Wide', w: 1920, h: 1080 },
]

export default function App() {
  const [folder, setFolder] = useState<string>('')
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle')
  const [events, setEvents] = useState<QAEvent[]>([])
  const [results, setResults] = useState<PageResult[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [aiProvider, setAiProvider] = useState<'openrouter' | 'ollama'>('openrouter')
  const [aiModel, setAiModel] = useState('openai/gpt-4o-mini')
  const [openRouterKey, setOpenRouterKey] = useState('')
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434')
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [selectedViewport, setSelectedViewport] = useState(2) // Desktop
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const api = window.electronAPI
    if (!api) return

    api.onQAEvent((e) => {
      setEvents(prev => [...prev, e])
      if (e.type === 'page_result') {
        setResults(prev => [...prev, e as any])
        setProgress(p => ({ ...p, current: p.current + 1 }))
      }
      if (e.type === 'files_found') setProgress(p => ({ ...p, total: e.total }))
      if (e.type === 'complete') setStatus('done')
      if (e.type === 'error') setError(e.message || JSON.stringify(e))
    })
    api.onQALog((msg) => setLogs(prev => [...prev.slice(-500), msg]))
    api.onQAError((msg) => {
      setLogs(prev => [...prev.slice(-500), `ERROR: ${msg}`])
      setError(msg.slice(0, 300))
    })
    api.onQAFinished((_e, data) => {
      if (data?.code === 0) setStatus('done')
    })

    return () => {
      // Cleanup listeners on unmount
    }
  }, [])

  const handleSelectFolder = async () => {
    const f = await window.electronAPI?.selectFolder()
    if (f) { setFolder(f); setError('') }
  }

  const handleStart = async () => {
    if (!folder) return
    setResults([])
    setEvents([])
    setLogs([])
    setError('')
    setStatus('running')
    const vp = VIEWPORTS[selectedViewport]
    const config: QAConfig = {
      ai_provider: aiProvider,
      ai_model: aiModel,
      openRouterKey,
      ollamaUrl,
      viewport_w: vp.w,
      viewport_h: vp.h,
    }
    const res = await window.electronAPI?.startQA(folder, config)
    if (res && !res.ok) setError('Failed to start QA engine')
  }

  const handleStop = () => {
    window.electronAPI?.stopQA()
    setStatus('idle')
  }

  const handleExport = async () => {
    if (!results.length) return
    const data = JSON.stringify({ results, exportedAt: new Date().toISOString() }, null, 2)
    const path = await window.electronAPI?.exportResults(data)
    if (path) setLogs(prev => [...prev, `Report exported to: ${path}`])
  }

  const progressPercent = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">QA</div>
          <h1 className="text-lg font-semibold">Web QA Agent</h1>
        </div>
        <div className="flex items-center gap-3">
          {results.length > 0 && status === 'done' && (
            <button
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              Export Report
            </button>
          )}
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            status === 'idle' ? 'bg-gray-600 text-gray-300' :
            status === 'running' ? 'bg-blue-600 text-white animate-pulse' :
            'bg-green-600 text-white'
          }`}>
            {status === 'idle' ? 'Ready' :
             status === 'running' ? `Scanning ${progress.current}/${progress.total}` :
             'Complete'}
          </span>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-900/50 border-b border-red-700 px-6 py-2 text-sm text-red-300 flex items-center justify-between flex-shrink-0">
          <span>Error: {error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-200">Dismiss</button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Config */}
        <aside className="w-80 bg-[#1a1f2e] border-r border-gray-700 p-4 overflow-y-auto flex-shrink-0">
          <FolderSelect folder={folder} onSelect={handleSelectFolder} />
          <ConfigPanel
            aiProvider={aiProvider}
            setAiProvider={setAiProvider}
            aiModel={aiModel}
            setAiModel={setAiModel}
            openRouterKey={openRouterKey}
            setOpenRouterKey={setOpenRouterKey}
            ollamaUrl={ollamaUrl}
            setOllamaUrl={setOllamaUrl}
          />
          {/* Viewport presets */}
          <div className="mt-4">
            <label className="block text-xs text-gray-400 mb-1">Viewport</label>
            <div className="grid grid-cols-4 gap-1">
              {VIEWPORTS.map((vp, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedViewport(idx)}
                  className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                    selectedViewport === idx
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {vp.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-1">{VIEWPORTS[selectedViewport].w}x{VIEWPORTS[selectedViewport].h}</p>
          </div>
          <div className="mt-6 flex gap-2">
            <button
              onClick={handleStart}
              disabled={!folder || status === 'running'}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
            >
              {status === 'running' ? 'Running...' : 'Start QA'}
            </button>
            {status === 'running' && (
              <button onClick={handleStop} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium">
                Stop
              </button>
            )}
          </div>
        </aside>

        {/* Center - Progress + Results */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Progress bar */}
          {status === 'running' && (
            <div className="px-6 py-3 bg-[#1a1f2e] border-b border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Page {progress.current} of {progress.total}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
          <div className="flex-1 overflow-y-auto p-6">
            <ResultsPanel
              results={results}
              getScreenshot={window.electronAPI?.getScreenshot}
              status={status}
            />
          </div>
          <LogConsole logs={logs} />
        </main>
      </div>
    </div>
  )
}
