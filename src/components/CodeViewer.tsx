import React, { useState } from 'react'
import { useAppStore } from '../store/appStore'

type CodeTab = 'html' | 'css' | 'js'

function CodeViewer() {
  const { generatedCode } = useAppStore()
  const [activeTab, setActiveTab] = useState<CodeTab>('html')
  const [copied, setCopied] = useState(false)

  const getCodeContent = () => {
    switch (activeTab) {
      case 'html':
        return generatedCode.html
      case 'css':
        return generatedCode.css
      case 'js':
        return generatedCode.js
      default:
        return ''
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCodeContent())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated App</title>
  <style>
${generatedCode.css}
  </style>
</head>
<body>
${generatedCode.html.replace(/<html.*?>.*?<\/html>/s, '').replace(/<head.*?>.*?<\/head>/s, '')}
  <script>
${generatedCode.js}
  </script>
</body>
</html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'app.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!generatedCode.html) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-xl mb-2">{'</>'} الكود</p>
          <p className="text-sm">أنشئ تطبيق أولاً لرؤية الكود هنا</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700 px-4 py-3 bg-slate-800/50 backdrop-blur">
        {(['html', 'css', 'js'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-sm font-semibold rounded transition-all ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Code Container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Code Display */}
        <pre className="flex-1 overflow-auto p-4 bg-slate-900 text-gray-100 text-xs leading-relaxed font-mono">
          <code>{getCodeContent()}</code>
        </pre>

        {/* Action Buttons */}
        <div className="border-t border-slate-700 bg-slate-800/50 backdrop-blur px-4 py-3 flex gap-2">
          <button
            onClick={handleCopy}
            className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all active:scale-95 ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {copied ? '✅ تم النسخ!' : '📋 نسخ الكود'}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm bg-purple-600 hover:bg-purple-700 text-white transition-all active:scale-95"
          >
            📥 تحميل
          </button>
        </div>
      </div>
    </div>
  )
}

export default CodeViewer
