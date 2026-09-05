import { GeneratedCode } from '../store/appStore'

interface AppIdea {
  type: string
  title: string
  description: string
  features: string[]
  theme: string
  isArabic: boolean
}

function parseAppIdea(prompt: string): AppIdea {
  const isArabic = /[\u0600-\u06FF]/.test(prompt)
  const lowerPrompt = prompt.toLowerCase()

  let type = 'general'
  let theme = 'modern'

  if (lowerPrompt.includes('todo') || lowerPrompt.includes('task')) type = 'todo'
  else if (lowerPrompt.includes('calculator')) type = 'calculator'
  else if (lowerPrompt.includes('timer') || lowerPrompt.includes('stopwatch'))
    type = 'timer'
  else if (lowerPrompt.includes('weather')) type = 'weather'
  else if (lowerPrompt.includes('note')) type = 'notes'
  else if (lowerPrompt.includes('card') || lowerPrompt.includes('game'))
    type = 'game'
  else if (lowerPrompt.includes('converter') || lowerPrompt.includes('convert'))
    type = 'converter'
  else if (lowerPrompt.includes('music') || lowerPrompt.includes('player'))
    type = 'music'

  if (lowerPrompt.includes('dark')) theme = 'dark'
  else if (lowerPrompt.includes('light')) theme = 'light'
  else if (lowerPrompt.includes('purple') || lowerPrompt.includes('pink'))
    theme = 'purple'
  else if (lowerPrompt.includes('green')) theme = 'green'

  const features = []
  if (lowerPrompt.includes('storage') || lowerPrompt.includes('save'))
    features.push('storage')
  if (lowerPrompt.includes('share') || lowerPrompt.includes('export'))
    features.push('share')
  if (lowerPrompt.includes('offline')) features.push('offline')

  return {
    type,
    title: prompt.split('\n')[0],
    description: prompt,
    features,
    theme,
    isArabic,
  }
}

function generateTodoApp(idea: AppIdea): GeneratedCode {
  const isArabic = idea.isArabic
  const isDark = idea.theme === 'dark'

  const html = `
<!DOCTYPE html>
<html lang="${isArabic ? 'ar' : 'en'}" dir="${isArabic ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${idea.title}</title>
  <style id="app-styles"></style>
</head>
<body>
  <div id="app"></div>
  <script id="app-script"></script>
</body>
</html>
  `.trim()

  const css = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: ${isDark ? '#0f172a' : '#f8fafc'};
  color: ${isDark ? '#f1f5f9' : '#0f172a'};
  min-height: 100vh;
  overflow-x: hidden;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
  min-height: 100vh;
}

header {
  text-align: center;
  margin-bottom: 24px;
  padding: 16px 0;
  border-bottom: 2px solid ${isDark ? '#1e293b' : '#e2e8f0'};
}

h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

input[type="text"] {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid ${isDark ? '#334155' : '#cbd5e1'};
  border-radius: 12px;
  background: ${isDark ? '#1e293b' : '#ffffff'};
  color: ${isDark ? '#f1f5f9' : '#0f172a'};
  font-size: 16px;
  transition: all 0.3s ease;
}

input[type="text"]:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px ${isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
}

button {
  padding: 12px 24px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

button:active {
  transform: scale(0.95);
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: ${isDark ? '#1e293b' : '#ffffff'};
  border-radius: 12px;
  border: 1px solid ${isDark ? '#334155' : '#e2e8f0'};
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.todo-item input[type="checkbox"] {
  width: 24px;
  height: 24px;
  cursor: pointer;
  accent-color: #3b82f6;
}

.todo-text {
  flex: 1;
  font-size: 16px;
  transition: all 0.3s ease;
}

.todo-item input[type="checkbox"]:checked ~ .todo-text {
  opacity: 0.5;
  text-decoration: line-through;
}

.delete-btn {
  background: #ef4444;
  padding: 8px 12px;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: ${isDark ? '#94a3b8' : '#64748b'};
}

.empty-state p {
  font-size: 16px;
  margin-bottom: 16px;
}
  `.trim()

  const js = `
const app = {
  todos: [],

  init() {
    this.loadTodos();
    this.render();
    document.getElementById('app-styles').textContent = getStyles();
    this.attachEventListeners();
  },

  attachEventListeners() {
    const input = document.querySelector('input[type="text"]');
    const btn = document.querySelector('button.add-btn');
    
    btn?.addEventListener('click', () => this.addTodo(input.value, input));
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.addTodo(input.value, input);
    });
  },

  addTodo(text, inputElement) {
    if (!text.trim()) return;
    const todo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
    };
    this.todos.unshift(todo);
    this.saveTodos();
    this.render();
    inputElement.value = '';
  },

  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) todo.completed = !todo.completed;
    this.saveTodos();
    this.render();
  },

  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.saveTodos();
    this.render();
  },

  render() {
    const container = document.getElementById('app');
    container.innerHTML = \`
      <div class="container">
        <header>
          <h1>📝 ${isArabic ? 'قائمتي' : 'My Todo List'}</h1>
        </header>
        <div class="input-group">
          <input type="text" placeholder="${isArabic ? 'أضف مهمة جديدة...' : 'Add a new task...'}"/>
          <button class="add-btn">${isArabic ? 'إضافة' : 'Add'}</button>
        </div>
        \${this.todos.length > 0 ? \`
          <div class="todo-list">
            \${this.todos.map(todo => \`
              <div class="todo-item">
                <input type="checkbox" \${todo.completed ? 'checked' : ''} onchange="app.toggleTodo(\${todo.id})" />
                <span class="todo-text">\${this.escapeHtml(todo.text)}</span>
                <button class="delete-btn" onclick="app.deleteTodo(\${todo.id})">🗑️</button>
              </div>
            \`).join('')}
          </div>
        \` : \`
          <div class="empty-state">
            <p>${isArabic ? '🎯 لا توجد مهام حالياً' : '🎯 No tasks yet'}</p>
            <p>${isArabic ? 'ابدأ بإضافة مهمة جديدة!' : 'Start by adding a new task!'}</p>
          </div>
        \`}
      </div>
    \`;
    this.attachEventListeners();
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  saveTodos() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  },

  loadTodos() {
    try {
      const saved = localStorage.getItem('todos');
      this.todos = saved ? JSON.parse(saved) : [];
    } catch (e) {
      this.todos = [];
    }
  },
};

function getStyles() {
  return document.getElementById('app-styles')?.textContent || '';
}

app.init();
  `.trim()

  return { html, css, js }
}

function generateCalculatorApp(idea: AppIdea): GeneratedCode {
  const isDark = idea.theme === 'dark'
  const isArabic = idea.isArabic

  const html = `
<!DOCTYPE html>
<html lang="${isArabic ? 'ar' : 'en'}" dir="${isArabic ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${idea.title}</title>
  <style id="app-styles"></style>
</head>
<body>
  <div id="app"></div>
  <script id="app-script"></script>
</body>
</html>
  `.trim()

  const css = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: ${isDark ? '#0f172a' : '#f8fafc'};
  color: ${isDark ? '#f1f5f9' : '#0f172a'};
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.calculator {
  width: 100%;
  max-width: 400px;
  background: ${isDark ? '#1e293b' : '#ffffff'};
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid ${isDark ? '#334155' : '#e2e8f0'};
}

.display {
  background: ${isDark ? '#0f172a' : '#f1f5f9'};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: right;
  border: 2px solid ${isDark ? '#334155' : '#cbd5e1'};
}

.display-value {
  font-size: 36px;
  font-weight: 700;
  word-break: break-all;
  word-wrap: break-word;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

button {
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${isDark ? '#334155' : '#e2e8f0'};
  color: ${isDark ? '#f1f5f9' : '#0f172a'};
}

button:active {
  transform: scale(0.95);
}

.operator {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
}

.equals {
  background: linear-gradient(135deg, #10b981, #14b8a6);
  color: white;
  grid-column: span 2;
}

.clear {
  background: #ef4444;
  color: white;
  grid-column: span 2;
}
  `.trim()

  const js = `
const calculator = {
  display: '0',
  firstValue: null,
  operator: null,
  shouldResetDisplay: false,

  render() {
    const app = document.getElementById('app');
    const buttons = [
      ['C', '←', '%', '÷'],
      ['7', '8', '9', '×'],
      ['4', '5', '6', '-'],
      ['1', '2', '3', '+'],
      ['0', '.', '='],
    ];

    app.innerHTML = \`
      <div class="calculator">
        <div class="display">
          <div class="display-value" id="display">\${this.display}</div>
        </div>
        <div class="buttons">
          \${buttons.map(row => \`
            \${row.map(btn => \`
              <button onclick="calculator.handleInput('\${btn}')" class="\${this.getButtonClass(btn)}">\${btn}</button>
            \`).join('')}
          \`).join('')}
        </div>
      </div>
    \`;
  },

  getButtonClass(btn) {
    if (btn === 'C') return 'clear';
    if (btn === '=') return 'equals';
    if (['+', '-', '×', '÷', '%'].includes(btn)) return 'operator';
    return '';
  },

  handleInput(value) {
    if (value === 'C') {
      this.display = '0';
      this.firstValue = null;
      this.operator = null;
      this.shouldResetDisplay = false;
    } else if (value === '←') {
      if (this.display.length > 1) {
        this.display = this.display.slice(0, -1);
      } else {
        this.display = '0';
      }
    } else if (value === '.') {
      if (!this.display.includes('.')) {
        this.display += '.';
        this.shouldResetDisplay = false;
      }
    } else if (['+', '-', '×', '÷', '%'].includes(value)) {
      const currentValue = parseFloat(this.display);
      if (this.firstValue === null) {
        this.firstValue = currentValue;
      } else if (!this.shouldResetDisplay) {
        this.firstValue = this.calculate(this.firstValue, currentValue, this.operator);
        this.display = this.firstValue.toString();
      }
      this.operator = value;
      this.shouldResetDisplay = true;
    } else if (value === '=') {
      if (this.firstValue !== null && this.operator) {
        const currentValue = parseFloat(this.display);
        this.display = this.calculate(this.firstValue, currentValue, this.operator).toString();
        this.firstValue = null;
        this.operator = null;
        this.shouldResetDisplay = true;
      }
    } else {
      if (this.shouldResetDisplay) {
        this.display = value;
        this.shouldResetDisplay = false;
      } else {
        this.display = this.display === '0' ? value : this.display + value;
      }
    }
    this.render();
  },

  calculate(first, second, op) {
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '×': return first * second;
      case '÷': return second === 0 ? 0 : first / second;
      case '%': return first % second;
      default: return second;
    }
  },
};

calculator.render();
  `.trim()

  return { html, css, js }
}

function generateGeneralApp(idea: AppIdea): GeneratedCode {
  const isArabic = idea.isArabic
  const isDark = idea.theme === 'dark'

  const html = `
<!DOCTYPE html>
<html lang="${isArabic ? 'ar' : 'en'}" dir="${isArabic ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${idea.title}</title>
  <style id="app-styles"></style>
</head>
<body>
  <div id="app"></div>
  <script id="app-script"></script>
</body>
</html>
  `.trim()

  const css = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: ${isDark ? '#0f172a' : '#f8fafc'};
  color: ${isDark ? '#f1f5f9' : '#0f172a'};
  min-height: 100vh;
  overflow-x: hidden;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 32px;
  padding: 24px 0;
}

h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

p {
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.8;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.feature-card {
  background: ${isDark ? '#1e293b' : '#ffffff'};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 1px solid ${isDark ? '#334155' : '#e2e8f0'};
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: #3b82f6;
}

.feature-card .emoji {
  font-size: 32px;
  margin-bottom: 8px;
}

.feature-card .title {
  font-weight: 600;
  font-size: 14px;
}

button {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

button:active {
  transform: scale(0.98);
}

.footer {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid ${isDark ? '#334155' : '#e2e8f0'};
  font-size: 14px;
  opacity: 0.6;
}
  `.trim()

  const js = `
const app = {
  init() {
    this.render();
  },

  render() {
    const features = [
      { emoji: '⚡', title: '${isArabic ? 'سريع' : 'Fast'}' },
      { emoji: '🎨', title: '${isArabic ? 'جميل' : 'Beautiful'}' },
      { emoji: '📱', title: '${isArabic ? 'موبايل' : 'Mobile'}' },
      { emoji: '🚀', title: '${isArabic ? 'قوي' : 'Powerful'}' },
    ];

    document.getElementById('app').innerHTML = \`
      <div class="container">
        <header>
          <h1>✨ ${idea.title}</h1>
          <p>${isArabic ? 'تم إنشاء هذا التطبيق باستخدام مُنشئ التطبيقات الذكي' : 'Built with AI App Generator'}</p>
        </header>
        
        <div class="feature-grid">
          \${features.map(f => \`
            <div class="feature-card">
              <div class="emoji">\${f.emoji}</div>
              <div class="title">\${f.title}</div>
            </div>
          \`).join('')}
        </div>

        <button onclick="app.handleClick()">${isArabic ? 'ابدأ الآن' : 'Get Started'}</button>

        <div class="footer">
          <p>💡 ${isArabic ? 'طور أفكارك مع مُنشئ التطبيقات الذكي' : 'Build your ideas with AI App Generator'}</p>
        </div>
      </div>
    \`;
  },

  handleClick() {
    alert('${isArabic ? 'رائع! ابدأ بتطويرك' : 'Great! Start building'}');
  },
};

app.init();
  `.trim()

  return { html, css, js }
}

export function generateCodeFromPrompt(prompt: string): GeneratedCode {
  const idea = parseAppIdea(prompt)

  let code: GeneratedCode

  switch (idea.type) {
    case 'todo':
      code = generateTodoApp(idea)
      break
    case 'calculator':
      code = generateCalculatorApp(idea)
      break
    default:
      code = generateGeneralApp(idea)
  }

  return code
}
