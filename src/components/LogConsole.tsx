import React, { useRef, useEffect, useState } from 'react'

interface Props {
  logs: string[]
}

export default function LogConsole({ logs }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    ref.current?.scrollTo(0, ref.current.scrollHeight)
  }, [logs])

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="h-8 bg-gray-800 border-t border-gray-700 text-xs text-gray-400 hover:text-gray-200 px-4 flex items-center"
      >
        ▼ Console ({logs.length} lines)
      </button>
    )
  }

  return (
    <div className="h-40 flex-shrink-0 border-t border-gray-700 bg-gray-950 flex flex-col">
      <div className="flex items-center justify-between px-4 py-1 bg-gray-800 border-b border-gray-700">
        <span className="text-xs text-gray-400">Console Output</span>
        <button onClick={() => setCollapsed(true)} className="text-xs text-gray-500 hover:text-gray-300">▲ Collapse</button>
      </div>
      <div ref={ref} className="flex-1 overflow-y-auto px-4 py-2 font-mono text-xs space-y-0.5">
        {logs.map((line, i) => (
          <div key={i} className={`${
            line.startsWith('ERROR') ? 'text-red-400' :
            line.startsWith('WARN') ? 'text-yellow-400' :
            'text-gray-400'
          }`}>
            {line.slice(0, 300)}
          </div>
        ))}
      </div>
    </div>
  )
}
