import React, { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import PreviewPanel from './components/PreviewPanel'
import CodeViewer from './components/CodeViewer'
import { useAppStore } from './store/appStore'

type Tab = 'chat' | 'preview' | 'code'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('chat')
  const { generatedCode } = useAppStore()

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-700 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">AI</div>
            <h1 className="text-lg font-bold truncate">مُنشئ التطبيقات</h1>
          </div>
          <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 rounded-full font-semibold">v1.0</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'chat' && <ChatInterface />}
        {activeTab === 'preview' && <PreviewPanel />}
        {activeTab === 'code' && <CodeViewer />}
      </main>

      {/* Bottom Navigation - Mobile Optimized */}
      <nav className="sticky bottom-0 z-30 bg-slate-900/95 backdrop-blur border-t border-slate-700 px-2 py-2 flex gap-1 justify-around">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 flex flex-col items-center gap-1 ${
            activeTab === 'chat'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
              : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
          }`}
        >
          <span>💬</span>
          <span>Chat</span>
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          disabled={!generatedCode.html}
          className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 flex flex-col items-center gap-1 ${
            activeTab === 'preview'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
              : generatedCode.html
              ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              : 'bg-slate-800 text-gray-500 opacity-50 cursor-not-allowed'
          }`}
        >
          <span>👁️</span>
          <span>Preview</span>
        </button>
        <button
          onClick={() => setActiveTab('code')}
          disabled={!generatedCode.html}
          className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 flex flex-col items-center gap-1 ${
            activeTab === 'code'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
              : generatedCode.html
              ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              : 'bg-slate-800 text-gray-500 opacity-50 cursor-not-allowed'
          }`}
        >
          <span>{'</>'}</span>
          <span>Code</span>
        </button>
      </nav>
    </div>
  )
}

export default App
