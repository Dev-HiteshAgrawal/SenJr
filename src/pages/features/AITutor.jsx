import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Send, Sparkles, BookOpen, Calculator, Code, Lightbulb, RotateCcw } from 'lucide-react'

const AITutor = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI learning assistant. I can help you with:\n\n📚 **Subjects** - Any topic explanation\n🧮 **Math** - Problem solving & step-by-step solutions\n💻 **Coding** - Programming help & debugging\n💡 **Concepts** - Clarify any doubts\n\nWhat would you like to learn today?"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const quickActions = [
    { icon: BookOpen, label: 'Explain Topic', prompt: 'Explain ' },
    { icon: Calculator, label: 'Solve Problem', prompt: 'Solve this: ' },
    { icon: Code, label: 'Code Help', prompt: 'Help me with code: ' },
    { icon: Lightbulb, label: 'Concept Clarification', prompt: 'What is ' }
  ]

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      const aiResponse = generateResponse(input)
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }])
      setLoading(false)
    }, 1500)
  }

  const generateResponse = (query) => {
    const lowerQuery = query.toLowerCase()
    
    if (lowerQuery.includes('math') || lowerQuery.includes('calculate') || lowerQuery.includes('solve')) {
      return "I'd be happy to help with math! Please share the specific problem or equation you'd like me to solve, and I'll provide step-by-step solutions.\n\n**Example problems I can help with:**\n- Algebraic equations\n- Calculus derivatives\n- Geometry problems\n- Trigonometric functions\n\nWhat specific problem are you working on?"
    }
    
    if (lowerQuery.includes('code') || lowerQuery.includes('program') || lowerQuery.includes('javascript')) {
      return "I can help with programming! Please share:\n\n1. The programming language\n2. Your current code\n3. The specific issue or error\n\n**Languages I support:**\n- JavaScript, Python, Java\n- C++, C#, Go\n- HTML, CSS, React\n- And more...\n\nWhat would you like to build or fix?"
    }
    
    if (lowerQuery.includes('explain') || lowerQuery.includes('what is') || lowerQuery.includes('how does')) {
      return "Sure! I'd be happy to explain any topic. Please let me know:\n\n1. **The concept** you want to understand\n2. **Your current level** (beginner/intermediate/advanced)\n3. **Any specific aspects** you want to focus on\n\nI'll break it down in simple terms with examples!"
    }

    return `Thank you for your question: "${query}"\n\nI'm analyzing this and here's what I can help with:\n\n1. **Break down the topic** - Explain concepts step by step\n2. **Provide examples** - Real-world applications\n3. **Solve problems** - Practice exercises\n4. **Answer doubts** - Clarify any confusion\n\nCould you provide more details about what specifically you'd like to learn?`
  }

  const handleQuickAction = (prompt) => {
    setInput(prompt)
  }

  const handleClear = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat cleared! How can I help you today?"
      }
    ])
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-display font-bold">AI Tutor</h1>
                <p className="text-purple-100">Your personal learning assistant</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </button>
              ))}
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 rounded-lg text-sm text-red-600 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Clear
              </button>
            </div>
          </div>

          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-xl ${
                    message.role === 'user'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-line">{message.content}</div>
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-xl">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AITutor