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
      onQAEvent: (cb: (e: QAEvent) => void) => void
      onQALog: (cb: (msg: string) => void) => void
      onQAError: (cb: (msg: string) => void) => void
      onQAFinished: (cb: (e: any) => void) => void
    }
  }
}

export default function App() {
  const [folder, setFolder] = useState<string>('')
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle')
  const [events, setEvents] = useState<QAEvent[]>([])
  const [results, setResults] = useState<PageResult[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [aiProvider, setAiProvider] = useState<'openrouter' | 'ollama'>('openrouter')
  const [aiModel, setAiModel] = useState('openai/gpt-4o-mini')
  const [openRouterKey, setOpenRouterKey] = useState('')
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  useEffect(() => {
    window.electronAPI?.onQAEvent((e) => {
      setEvents(prev => [...prev, e])
      if (e.type === 'page_result') {
        setResults(prev => [...prev, e as any])
        setProgress(p => ({ ...p, current: p.current + 1 }))
      }
      if (e.type === 'files_found') setProgress(p => ({ ...p, total: e.total }))
      if (e.type === 'complete') setStatus('done')
    })
    window.electronAPI?.onQALog((msg) => setLogs(prev => [...prev, msg]))
    window.electronAPI?.onQAError((msg) => setLogs(prev => [...prev, `ERROR: ${msg}`]))
    window.electronAPI?.onQAFinished(() => setStatus('done'))
  }, [])

  const handleSelectFolder = async () => {
    const f = await window.electronAPI?.selectFolder()
    if (f) setFolder(f)
  }

  const handleStart = async () => {
    if (!folder) return
    setResults([])
    setEvents([])
    setLogs([])
    setStatus('running')
    const config: QAConfig = {
      ai_provider: aiProvider,
      ai_model: aiModel,
      openRouterKey,
      viewport_w: 1280,
      viewport_h: 800,
    }
    await window.electronAPI?.startQA(folder, JSON.parse(JSON.stringify(config)))
  }

  const handleStop = () => {
    window.electronAPI?.stopQA()
    setStatus('idle')
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">QA</div>
          <h1 className="text-xl font-semibold">Web QA Agent</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            status === 'idle' ? 'bg-gray-600' :
            status === 'running' ? 'bg-green-600 animate-pulse' :
            'bg-blue-600'
          }`}>
            {status === 'idle' ? 'Ready' : status === 'running' ? `Scanning ${progress.current}/${progress.total}` : 'Complete ✓'}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Config */}
        <aside className="w-80 bg-gray-850 border-r border-gray-700 p-4 overflow-y-auto flex-shrink-0" style={{backgroundColor: '#1a1f2e'}}>
          <FolderSelect folder={folder} onSelect={handleSelectFolder} />
          <ConfigPanel
            aiProvider={aiProvider}
            setAiProvider={setAiProvider}
            aiModel={aiModel}
            setAiModel={setAiModel}
            openRouterKey={openRouterKey}
            setOpenRouterKey={setOpenRouterKey}
          />
          <div className="mt-6 flex gap-2">
            <button
              onClick={handleStart}
              disabled={!folder || status === 'running'}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {status === 'running' ? 'Running...' : 'Start QA'}
            </button>
            {status === 'running' && (
              <button onClick={handleStop} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium">
                Stop
              </button>
            )}
          </div>
        </aside>

        {/* Center - Results */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <ResultsPanel results={results} getScreenshot={window.electronAPI?.getScreenshot} status={status} />
          </div>
          {/* Bottom - Logs */}
          <LogConsole logs={logs} />
        </main>
      </div>
    </div>
  )
}
