import React, { useRef, useEffect, useState } from 'react'
import { useAppStore } from '../store/appStore'
import { generateCodeFromPrompt } from '../utils/codeGenerator'

function ChatInterface() {
  const { messages, addMessage, setGeneratedCode, loading, setLoading } = useAppStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    addMessage({
      text: input,
      sender: 'user',
    })

    setLoading(true)
    const userInput = input
    setInput('')

    // Simulate processing delay for better UX
    setTimeout(() => {
      try {
        // Generate code from prompt
        const code = generateCodeFromPrompt(userInput)
        setGeneratedCode(code)

        // Add assistant response
        const isArabic = /[\u0600-\u06FF]/.test(userInput)
        addMessage({
          text: isArabic
            ? `✅ تم إنشاء التطبيق بنجاح! يمكنك الآن:
• عرض التطبيق في تبويب "Preview"
• نسخ الكود في تبويب "Code"
• تحميل التطبيق لاستخدامه بشكل مستقل`
            : `✅ App created successfully! You can now:
• Preview it in the "Preview" tab
• Copy the code in the "Code" tab
• Download it for standalone use`,
          sender: 'assistant',
        })
      } catch (error) {
        addMessage({
          text: 'حدث خطأ في إنشاء التطبيق. حاول مرة أخرى!',
          sender: 'assistant',
        })
      }
      setLoading(false)
    }, 500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-700 text-gray-100 rounded-bl-none'
              }`}
            >
              {msg.text.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-gray-100 rounded-lg px-4 py-3 rounded-bl-none">
              <div className="flex gap-2 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700 bg-slate-900/50 backdrop-blur px-4 py-3 space-y-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اكتب فكرة تطبيقك... (عربي أو إنجليزي) / Write your app idea..."
          className="w-full bg-slate-800 text-white placeholder-gray-400 border border-slate-700 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-24"
          rows={2}
        />
        <div className="flex gap-2">
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-2.5 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ جاري الإنشاء...' : '🚀 إنشاء التطبيق'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
