import React, { useEffect, useRef } from 'react'
import { useAppStore } from '../store/appStore'

function PreviewPanel() {
  const { generatedCode } = useAppStore()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current && generatedCode.html) {
      const doc = iframeRef.current.contentDocument
      if (doc) {
        // Inject CSS
        const styleElement = doc.createElement('style')
        styleElement.textContent = generatedCode.css
        doc.head.appendChild(styleElement)

        // Parse and inject HTML body
        const tempDiv = doc.createElement('div')
        tempDiv.innerHTML = generatedCode.html
        const bodyContent = tempDiv.querySelector('body')

        if (bodyContent) {
          while (bodyContent.firstChild) {
            doc.body.appendChild(bodyContent.firstChild)
          }
        }

        // Inject JavaScript
        const scriptElement = doc.createElement('script')
        scriptElement.textContent = generatedCode.js
        doc.body.appendChild(scriptElement)
      }
    }
  }, [generatedCode])

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-800">
      <div className="flex-1 overflow-hidden">
        {generatedCode.html ? (
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0 bg-white"
            title="App Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <p className="text-xl mb-2">📱 معاينة التطبيق</p>
              <p className="text-sm">أنشئ تطبيق أولاً لرؤية المعاينة هنا</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PreviewPanel
