import React from 'react'

interface Props {
  folder: string
  onSelect: () => void
}

export default function FolderSelect({ folder, onSelect }: Props) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-300 mb-2">HTML Folder</label>
      <button
        onClick={onSelect}
        className="w-full bg-gray-700 hover:bg-gray-600 border border-gray-600 border-dashed rounded-lg px-4 py-3 text-sm text-left transition-colors"
      >
        {folder ? (
          <span className="text-green-400">📁 {folder}</span>
        ) : (
          <span className="text-gray-400">Click to select folder with HTML files...</span>
        )}
      </button>
    </div>
  )
}
