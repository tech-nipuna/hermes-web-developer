import React from 'react'

interface Props {
  aiProvider: 'openrouter' | 'ollama'
  setAiProvider: (v: 'openrouter' | 'ollama') => void
  aiModel: string
  setAiModel: (v: string) => void
  openRouterKey: string
  setOpenRouterKey: (v: string) => void
}

export default function ConfigPanel({ aiProvider, setAiProvider, aiModel, setAiModel, openRouterKey, setOpenRouterKey }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wider">AI Configuration</h3>
      
      <div>
        <label className="block text-xs text-gray-400 mb-1">Provider</label>
        <div className="flex gap-2">
          <button
            onClick={() => setAiProvider('openrouter')}
            className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
              aiProvider === 'openrouter' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            OpenRouter
          </button>
          <button
            onClick={() => setAiProvider('ollama')}
            className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
              aiProvider === 'ollama' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Ollama (Local)
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Model</label>
        <input
          value={aiModel}
          onChange={(e) => setAiModel(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
          placeholder="Model name..."
        />
        {aiProvider === 'ollama' && (
          <p className="text-xs text-gray-500 mt-1">E.g.: llava, bakllava, llama3.2-vision</p>
        )}
        {aiProvider === 'openrouter' && (
          <p className="text-xs text-gray-500 mt-1">E.g.: openai/gpt-4o-mini, anthropic/claude-3-5-sonnet</p>
        )}
      </div>

      {aiProvider === 'openrouter' && (
        <div>
          <label className="block text-xs text-gray-400 mb-1">OpenRouter API Key</label>
          <input
            type="password"
            value={openRouterKey}
            onChange={(e) => setOpenRouterKey(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
            placeholder="sk-or-..."
          />
          <p className="text-xs text-gray-500 mt-1">Or set OPENROUTER_API_KEY in ~/.hermes/.env</p>
        </div>
      )}
    </div>
  )
}
