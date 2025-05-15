// Classe para gerenciar as ferramentas
class ToolsManager {
    // 1. Adicione este método à classe ToolsManager para detectar duplo clique/toque
    handleDoubleClick() {
        // Primeiro exibe a ferramenta e depois ativa o modo tela cheia
        if (this.currentToolId) {
            // Se já estiver exibindo a ferramenta atual, apenas ativa o modo tela cheia
            this.toggleFullscreen();
        }
    }

    // Adicione estes métodos à classe ToolsManager
    // Função para atualizar a visibilidade dos botões e título
    updateToolControlsVisibility() {
        const toolControls = document.querySelectorAll('.tool-control-btn');
        const toolTitle = document.getElementById('tool-title');

        // Se uma ferramenta estiver selecionada, mostre os controles
        if (this.currentToolId) {
            toolControls.forEach(btn => btn.style.display = 'inline-block');
            if (toolTitle) toolTitle.style.display = 'block';
        } else {
            // Caso contrário, oculte os controles
            toolControls.forEach(btn => btn.style.display = 'none');
            if (toolTitle) toolTitle.style.display = 'none';
        }
    }
    // Método para resetar para as ferramentas padrão
    resetToDefaultTools() {
        if (confirm('Isso irá substituir todas as suas ferramentas pelas ferramentas padrão. Deseja continuar?')) {
            const defaultTools = this.getDefaultTools();
            this.tools = [...defaultTools];
            this.saveTools();
            this.renderToolsList();

            // Reset da ferramenta atual
            this.currentToolId = null;
            document.getElementById('welcome-message').style.display = 'block';
            document.getElementById('tool-view').style.display = 'none';
            this.updateToolControlsVisibility();

            alert('Ferramentas redefinidas para o padrão com sucesso!');
        }
    }
    // Adicione este método à classe ToolsManager
    getDefaultTools() {
        // Retorna um array com ferramentas predefinidas
        return [
            {
                id: 'default-notes',
                title: 'Bloco de Notas',
                code: `<!DOCTYPE html>
<html>
<head>
    <title>Bloco de Notas</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        .controls {
            margin-bottom: 15px;
            display: flex;
            gap: 10px;
        }
        button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 8px 15px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        button:hover {
            background-color: #45a049;
        }
        textarea {
            width: 100%;
            height: 100%;
            padding: 15px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            border-radius: 4px;
            resize: none;
            font-size: 16px;
            line-height: 1.5;
            flex-grow: 1;
        }
        .status {
            margin-top: 10px;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <h1>Bloco de Notas</h1>
    
    <div class="controls">
        <button onclick="saveNote()">Salvar</button>
        <button onclick="clearNote()">Limpar</button>
        <button onclick="downloadNote()">Baixar</button>
    </div>
    
    <textarea id="notepad" placeholder="Digite seu texto aqui..."></textarea>
    
    <div class="status">
        <span id="character-count">0 caracteres</span> | 
        <span id="word-count">0 palavras</span> |
        <span id="auto-save-status">Autosalvo há 0s</span>
    </div>

    <script>
        const notepad = document.getElementById('notepad');
        const characterCount = document.getElementById('character-count');
        const wordCount = document.getElementById('word-count');
        const autoSaveStatus = document.getElementById('auto-save-status');
        
        let lastSaved = Date.now();
        let autoSaveInterval;
        
        // Carrega nota salva quando a página carregar
        document.addEventListener('DOMContentLoaded', () => {
            const savedNote = localStorage.getItem('savedNote');
            if (savedNote) {
                notepad.value = savedNote;
                updateCounts();
            }
            
            // Configura autosave a cada 5 segundos
            autoSaveInterval = setInterval(() => {
                if (notepad.value.length > 0) {
                    saveNote(true);
                }
                updateAutoSaveStatus();
            }, 5000);
        });
        
        // Atualiza contadores quando texto muda
        notepad.addEventListener('input', updateCounts);
        
        function updateCounts() {
            // Conta caracteres
            const text = notepad.value;
            characterCount.textContent = text.length + ' caracteres';
            
            // Conta palavras
            const words = text.trim() === '' ? 0 : text.trim().split(/\\s+/).length;
            wordCount.textContent = words + ' palavras';
        }
        
        function updateAutoSaveStatus() {
            const secondsAgo = Math.floor((Date.now() - lastSaved) / 1000);
            autoSaveStatus.textContent = 'Autosalvo há ' + secondsAgo + 's';
        }
        
        function saveNote(isAuto = false) {
            localStorage.setItem('savedNote', notepad.value);
            lastSaved = Date.now();
            
            if (!isAuto) {
                autoSaveStatus.textContent = 'Salvo manualmente';
                setTimeout(updateAutoSaveStatus, 2000);
            }
        }
        
        function clearNote() {
            if (confirm('Tem certeza que deseja limpar todas as notas?')) {
                notepad.value = '';
                updateCounts();
            }
        }
        
        function downloadNote() {
            if (notepad.value.trim() === '') {
                alert('O bloco de notas está vazio!');
                return;
            }
            
            const blob = new Blob([notepad.value], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'minhas_notas_' + new Date().toISOString().split('T')[0] + '.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    </script>
</body>
</html>`,
                createdAt: new Date().toISOString()
            },

            // ADICIONE NOVAS FERRAMENTAS AQUI, seguindo o mesmo formato:
            {
                id: 'default-calculator',
                title: 'Calculadora Simples',
                code: `<!DOCTYPE html>
<html>
<head>
    <title>Calculadora</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
        }
        .calculator {
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 20px;
            width: 300px;
        }
        .display {
            background-color: #f0f0f0;
            border-radius: 5px;
            padding: 10px;
            margin-bottom: 15px;
            text-align: right;
            font-size: 24px;
            height: 40px;
            overflow: hidden;
        }
        .buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }
        button {
            background-color: #e0e0e0;
            border: none;
            border-radius: 5px;
            padding: 15px;
            font-size: 18px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        button:hover {
            background-color: #d0d0d0;
        }
        .operator {
            background-color: #f8a51b;
            color: white;
        }
        .operator:hover {
            background-color: #e59400;
        }
        .equals {
            background-color: #4caf50;
            color: white;
        }
        .equals:hover {
            background-color: #3d8c40;
        }
        .clear {
            background-color: #f44336;
            color: white;
        }
        .clear:hover {
            background-color: #d32f2f;
        }
    </style>
</head>
<body>
    <div class="calculator">
        <div class="display" id="display">0</div>
        <div class="buttons">
            <button class="clear" onclick="clearDisplay()">C</button>
            <button onclick="appendCharacter('(')">(</button>
            <button onclick="appendCharacter(')')">)</button>
            <button class="operator" onclick="appendCharacter('/')">/</button>
            
            <button onclick="appendCharacter('7')">7</button>
            <button onclick="appendCharacter('8')">8</button>
            <button onclick="appendCharacter('9')">9</button>
            <button class="operator" onclick="appendCharacter('*')">×</button>
            
            <button onclick="appendCharacter('4')">4</button>
            <button onclick="appendCharacter('5')">5</button>
            <button onclick="appendCharacter('6')">6</button>
            <button class="operator" onclick="appendCharacter('-')">-</button>
            
            <button onclick="appendCharacter('1')">1</button>
            <button onclick="appendCharacter('2')">2</button>
            <button onclick="appendCharacter('3')">3</button>
            <button class="operator" onclick="appendCharacter('+')">+</button>
            
            <button onclick="appendCharacter('0')">0</button>
            <button onclick="appendCharacter('.')">.</button>
            <button onclick="backspace()">⌫</button>
            <button class="equals" onclick="calculate()">=</button>
        </div>
    </div>

    <script>
        let display = document.getElementById('display');
        let currentExpression = '0';

        function updateDisplay() {
            display.textContent = currentExpression;
        }

        function appendCharacter(char) {
            if (currentExpression === '0' && char !== '.') {
                currentExpression = char;
            } else {
                currentExpression += char;
            }
            updateDisplay();
        }

        function clearDisplay() {
            currentExpression = '0';
            updateDisplay();
        }

        function backspace() {
            if (currentExpression.length <= 1) {
                currentExpression = '0';
            } else {
                currentExpression = currentExpression.slice(0, -1);
            }
            updateDisplay();
        }

        function calculate() {
            try {
                currentExpression = eval(currentExpression).toString();
                updateDisplay();
            } catch (error) {
                currentExpression = 'Erro';
                updateDisplay();
                setTimeout(clearDisplay, 1000);
            }
        }
    </script>
</body>
</html>`,
                createdAt: new Date().toISOString()
            },
            {
                id: 'todo-list',
                title: 'Lista de Tarefas',
                code: `<!DOCTYPE html>
<html>
<head>
    <title>Lista de Tarefas</title>
    <style>
            body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    h1 {
      color: #333;
      margin-bottom: 20px;
      text-align: center;
    }
    .todo-container {
      width: 100%;
      max-width: 500px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      padding: 20px;
      box-sizing: border-box;
    }
    .input-group {
      display: flex;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    #todo-input {
      flex-grow: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px 0 0 4px;
      font-size: 16px;
      min-width: 0;
    }
    #add-btn {
      padding: 10px 15px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
      font-size: 16px;
      white-space: nowrap;
    }
    #add-btn:hover {
      background-color: #45a049;
    }
    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }
    .todo-item {
      display: flex;
      align-items: center;
      padding: 12px 10px;
      border-bottom: 1px solid #eee;
      transition: background-color 0.3s;
    }
    .todo-item:hover {
      background-color: #f9f9f9;
    }
    .todo-text {
      flex-grow: 1;
      margin-left: 10px;
      word-break: break-word;
    }
    .completed {
      text-decoration: line-through;
      color: #999;
    }
    .delete-btn {
      background-color: #ff4d4d;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;
      margin-left: 10px;
    }
    .delete-btn:hover {
      background-color: #ff3333;
    }
    .filters {
      display: flex;
      justify-content: center;
      margin-top: 20px;
      flex-wrap: wrap;
    }
    .filter-btn {
      margin: 5px;
      padding: 5px 10px;
      border: none;
      border-radius: 4px;
      background-color: #ddd;
      cursor: pointer;
    }
    .filter-btn.active {
      background-color: #4CAF50;
      color: white;
    }
    .stats {
      margin-top: 20px;
      text-align: center;
      color: #666;
    }

    /* Responsivo para telas menores que 480px */
    @media (max-width: 480px) {
      .input-group {
        flex-direction: column;
      }
      #todo-input {
        border-radius: 4px;
        margin-bottom: 10px;
      }
      #add-btn {
        border-radius: 4px;
        width: 100%;
      }
    }
    </style>
</head>
<body>
    <div class="todo-container">
        <h1>Lista de Tarefas</h1>
        
        <div class="input-group">
            <input type="text" id="todo-input" placeholder="Adicionar nova tarefa...">
            <button id="add-btn">Adicionar</button>
        </div>
        
        <ul id="todo-list"></ul>
        
        <div class="filters">
            <button class="filter-btn active" data-filter="all">Todas</button>
            <button class="filter-btn" data-filter="active">Ativas</button>
            <button class="filter-btn" data-filter="completed">Concluídas</button>
        </div>
        
        <div class="stats">
            <span id="tasks-counter">0 tarefas restantes</span>
        </div>
    </div>

    <script>
        let todos = [];
        let filter = 'all';
        
        // Carregar do localStorage
        document.addEventListener('DOMContentLoaded', () => {
            const savedTodos = localStorage.getItem('todos');
            if (savedTodos) {
                todos = JSON.parse(savedTodos);
                renderTodos();
            }
        });
        
        // Salvar no localStorage
        function saveTodos() {
            localStorage.setItem('todos', JSON.stringify(todos));
        }
        
        function renderTodos() {
            const todoList = document.getElementById('todo-list');
            todoList.innerHTML = '';
            
            // Filtrar tarefas
            let filteredTodos = todos;
            if (filter === 'active') {
                filteredTodos = todos.filter(todo => !todo.completed);
            } else if (filter === 'completed') {
                filteredTodos = todos.filter(todo => todo.completed);
            }
            
            // Renderizar tarefas
            filteredTodos.forEach((todo, index) => {
                const li = document.createElement('li');
                li.className = 'todo-item';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = todo.completed;
                checkbox.addEventListener('change', () => toggleComplete(todo.id));
                
                const span = document.createElement('span');
                span.className = 'todo-text';
                if (todo.completed) span.classList.add('completed');
                span.textContent = todo.text;
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'X';
                deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
                
                li.appendChild(checkbox);
                li.appendChild(span);
                li.appendChild(deleteBtn);
                todoList.appendChild(li);
            });
            
            // Atualizar contador
            const activeCount = todos.filter(todo => !todo.completed).length;
            document.getElementById('tasks-counter').textContent = 
                activeCount + (activeCount === 1 ? ' tarefa restante' : ' tarefas restantes');
        }
        
        function addTodo() {
            const input = document.getElementById('todo-input');
            const text = input.value.trim();
            
            if (text) {
                todos.push({
                    id: Date.now(),
                    text: text,
                    completed: false
                });
                
                input.value = '';
                saveTodos();
                renderTodos();
            }
        }
        
        function toggleComplete(id) {
            todos = todos.map(todo => {
                if (todo.id === id) {
                    return { ...todo, completed: !todo.completed };
                }
                return todo;
            });
            
            saveTodos();
            renderTodos();
        }
        
        function deleteTodo(id) {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
        }
        
        // Event Listeners
        document.getElementById('add-btn').addEventListener('click', addTodo);
        document.getElementById('todo-input').addEventListener('keypress', e => {
            if (e.key === 'Enter') addTodo();
        });
        
        // Filtros
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filter = btn.dataset.filter;
                renderTodos();
            });
        });
    </script>
</body>
</html>`,
                createdAt: new Date().toISOString()
            },
            {
      "id": "1747324100077",
      "title": "MasterC",
      "code": "<!DOCTYPE html>\n<html lang=\"pt-BR\">\n\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Calculadora Avançada</title>\n    <style>\n        :root {\n            --primary-color: #4CAF50;\n            --secondary-color: #388E3C;\n            --background-color: #f5f5f5;\n            --display-color: #ffffff;\n            --button-color: #e0e0e0;\n            --button-hover-color: #cccccc;\n            --converter-bg-color: #ffffff;\n            --shadow-color: rgba(0, 0, 0, 0.2);\n            --text-color: #333333;\n            --result-color: #2E7D32;\n        }\n\n        * {\n            box-sizing: border-box;\n            margin: 0;\n            padding: 0;\n        }\n\n        body {\n            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n            margin: 0;\n            padding: 0;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            min-height: 100vh;\n            background: linear-gradient(135deg, #e0f2f1, #b2dfdb);\n            color: var(--text-color);\n        }\n\n        .calculator {\n            background-color: var(--background-color);\n            border-radius: 20px;\n            box-shadow: 0 10px 25px var(--shadow-color);\n            overflow: hidden;\n            width: 90%;\n            max-width: 360px;\n            transition: all 0.3s ease;\n        }\n\n        .display {\n            background-color: var(--display-color);\n            color: var(--text-color);\n            text-align: right;\n            padding: 25px 15px;\n            font-size: 2.2em;\n            font-weight: 300;\n            overflow-x: auto;\n            white-space: nowrap;\n            border-bottom: 1px solid rgba(0, 0, 0, 0.1);\n            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05) inset;\n            height: 80px;\n            display: flex;\n            align-items: center;\n            justify-content: flex-end;\n        }\n\n        .buttons {\n            display: grid;\n            grid-template-columns: repeat(4, 1fr);\n            gap: 1px;\n            background-color: rgba(0, 0, 0, 0.1);\n        }\n\n        button {\n            background-color: var(--button-color);\n            color: var(--text-color);\n            border: none;\n            padding: 20px 0;\n            font-size: 1.5em;\n            cursor: pointer;\n            transition: all 0.2s ease;\n            font-weight: 500;\n        }\n\n        button:hover {\n            background-color: var(--button-hover-color);\n            transform: translateY(-2px);\n        }\n\n        button:active {\n            transform: translateY(1px);\n        }\n\n        .operator {\n            background-color: var(--primary-color);\n            color: #fff;\n        }\n\n        .operator:hover {\n            background-color: var(--secondary-color);\n        }\n\n        .converter-container {\n            background-color: var(--converter-bg-color);\n            padding: 20px;\n            display: flex;\n            flex-direction: column;\n            gap: 12px;\n            border-top: 1px solid rgba(0, 0, 0, 0.1);\n        }\n\n        .converter-select {\n            padding: 12px;\n            font-size: 1em;\n            border: 1px solid #ccc;\n            border-radius: 8px;\n            width: 100%;\n            background-color: #fff;\n            color: var(--text-color);\n            appearance: none;\n            background-image: url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E\");\n            background-repeat: no-repeat;\n            background-position: right 12px top 50%;\n            background-size: 12px auto;\n        }\n\n        .converter-input {\n            padding: 12px;\n            font-size: 1em;\n            border: 1px solid #ccc;\n            border-radius: 8px;\n            width: 100%;\n            outline: none;\n        }\n\n        .converter-input:focus, .converter-select:focus {\n            border-color: var(--primary-color);\n            box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);\n        }\n        \n        .converter-result {\n            padding: 12px;\n            background-color: #f9f9f9;\n            border-radius: 8px;\n            font-size: 1.1em;\n            color: var(--result-color);\n            font-weight: 500;\n            min-height: 48px;\n            display: flex;\n            align-items: center;\n        }\n\n        .conversion-button {\n            background-color: var(--primary-color);\n            color: white;\n            padding: 12px;\n            border-radius: 8px;\n            font-size: 1em;\n            cursor: pointer;\n            border: none;\n            font-weight: 500;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n        }\n\n        .conversion-button:hover {\n            background-color: var(--secondary-color);\n        }\n\n        .converter-row {\n            display: flex;\n            gap: 10px;\n            align-items: center;\n        }\n\n        .converter-row select, .converter-row input {\n            flex: 1;\n        }\n\n        @media (max-width: 480px) {\n            .calculator {\n                width: 95%;\n                margin: 10px 0;\n                border-radius: 15px;\n            }\n\n            .buttons {\n                gap: 1px;\n            }\n\n            button {\n                padding: 18px 0;\n                font-size: 1.3em;\n            }\n\n            .display {\n                padding: 20px 15px;\n                font-size: 2em;\n                height: 70px;\n            }\n            \n            .converter-container {\n                padding: 15px;\n            }\n        }\n\n        @media (max-height: 700px) {\n            .calculator {\n                max-height: 90vh;\n                overflow-y: auto;\n            }\n        }\n    </style>\n</head>\n\n<body>\n    <div class=\"calculator\">\n        <div class=\"display\" id=\"display\">0</div>\n        <div class=\"buttons\">\n            <button onclick=\"clearDisplay()\">C</button>\n            <button onclick=\"deleteLastChar()\">&#8592;</button>\n            <button class=\"operator\" onclick=\"appendToDisplay('%')\">%</button>\n            <button class=\"operator\" onclick=\"appendToDisplay('/')\">÷</button>\n            <button onclick=\"appendToDisplay('7')\">7</button>\n            <button onclick=\"appendToDisplay('8')\">8</button>\n            <button onclick=\"appendToDisplay('9')\">9</button>\n            <button class=\"operator\" onclick=\"appendToDisplay('*')\">×</button>\n            <button onclick=\"appendToDisplay('4')\">4</button>\n            <button onclick=\"appendToDisplay('5')\">5</button>\n            <button onclick=\"appendToDisplay('6')\">6</button>\n            <button class=\"operator\" onclick=\"appendToDisplay('-')\">−</button>\n            <button onclick=\"appendToDisplay('1')\">1</button>\n            <button onclick=\"appendToDisplay('2')\">2</button>\n            <button onclick=\"appendToDisplay('3')\">3</button>\n            <button class=\"operator\" onclick=\"appendToDisplay('+')\">+</button>\n            <button onclick=\"appendToDisplay('0')\">0</button>\n            <button onclick=\"appendToDisplay('.')\">.</button>\n            <button onclick=\"toggleConverter()\">Conv</button>\n            <button class=\"operator\" onclick=\"calculate()\">=</button>\n        </div>\n        <div id=\"converter\" style=\"display: none;\">\n            <div class=\"converter-container\">\n                <select id=\"converter-type\" class=\"converter-select\" onchange=\"updateConverterFields()\">\n                    <option value=\"currency\">Moeda</option>\n                    <option value=\"length\">Comprimento</option>\n                    <option value=\"weight\">Peso</option>\n                    <option value=\"temperature\">Temperatura</option>\n                </select>\n                <div id=\"converter-fields\">\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <script>\n        let displayValue = '0';\n        const display = document.getElementById('display');\n        const converterDiv = document.getElementById('converter');\n\n        function updateDisplay() {\n            display.textContent = displayValue;\n        }\n\n        function appendToDisplay(value) {\n            if (displayValue === '0' && value !== '.') {\n                displayValue = value;\n            } else {\n                displayValue += value;\n            }\n            updateDisplay();\n        }\n\n        function clearDisplay() {\n            displayValue = '0';\n            updateDisplay();\n        }\n\n        function deleteLastChar() {\n            if (displayValue.length > 1) {\n                displayValue = displayValue.slice(0, -1);\n            } else {\n                displayValue = '0';\n            }\n            updateDisplay();\n        }\n\n        function calculate() {\n            try {\n                // Replace × and ÷ with * and / for evaluation\n                let expression = displayValue.replace(/×/g, '*').replace(/÷/g, '/');\n                displayValue = String(eval(expression));\n                // Format large numbers or decimals\n                const num = parseFloat(displayValue);\n                if (!isNaN(num)) {\n                    if (Number.isInteger(num)) {\n                        displayValue = num.toString();\n                    } else {\n                        // Limit to 8 decimal places\n                        displayValue = num.toFixed(8).replace(/\\.?0+$/, '');\n                    }\n                }\n                updateDisplay();\n            } catch (error) {\n                displayValue = 'Erro';\n                updateDisplay();\n                setTimeout(clearDisplay, 1500);\n            }\n        }\n\n        function toggleConverter() {\n            converterDiv.style.display = converterDiv.style.display === 'none' ? 'block' : 'none';\n            if (converterDiv.style.display === 'block') {\n                updateConverterFields();\n            }\n        }\n\n        function updateConverterFields() {\n            const converterType = document.getElementById('converter-type').value;\n            const converterFieldsDiv = document.getElementById('converter-fields');\n            converterFieldsDiv.innerHTML = ''; // Clear previous fields\n\n            if (converterType === 'currency') {\n                converterFieldsDiv.innerHTML = `\n                    <div class=\"converter-row\">\n                        <select id=\"from-currency\" class=\"converter-select\">\n                            <option value=\"USD\">USD (Dólar)</option>\n                            <option value=\"EUR\">EUR (Euro)</option>\n                            <option value=\"BRL\" selected>BRL (Real)</option>\n                            <option value=\"GBP\">GBP (Libra)</option>\n                            <option value=\"JPY\">JPY (Iene)</option>\n                        </select>\n                        <select id=\"to-currency\" class=\"converter-select\">\n                            <option value=\"USD\" selected>USD (Dólar)</option>\n                            <option value=\"EUR\">EUR (Euro)</option>\n                            <option value=\"BRL\">BRL (Real)</option>\n                            <option value=\"GBP\">GBP (Libra)</option>\n                            <option value=\"JPY\">JPY (Iene)</option>\n                        </select>\n                    </div>\n                    <input type=\"number\" id=\"currency-input\" class=\"converter-input\" placeholder=\"Valor\" step=\"0.01\">\n                    <button onclick=\"convertCurrency()\" class=\"conversion-button\">Converter</button>\n                    <div id=\"currency-result\" class=\"converter-result\"></div>\n                `;\n            } else if (converterType === 'length') {\n                converterFieldsDiv.innerHTML = `\n                    <div class=\"converter-row\">\n                        <select id=\"from-length\" class=\"converter-select\">\n                            <option value=\"m\" selected>Metro (m)</option>\n                            <option value=\"km\">Quilômetro (km)</option>\n                            <option value=\"cm\">Centímetro (cm)</option>\n                            <option value=\"mm\">Milímetro (mm)</option>\n                            <option value=\"in\">Polegada (in)</option>\n                            <option value=\"ft\">Pé (ft)</option>\n                        </select>\n                        <select id=\"to-length\" class=\"converter-select\">\n                            <option value=\"m\">Metro (m)</option>\n                            <option value=\"km\">Quilômetro (km)</option>\n                            <option value=\"cm\" selected>Centímetro (cm)</option>\n                            <option value=\"mm\">Milímetro (mm)</option>\n                            <option value=\"in\">Polegada (in)</option>\n                            <option value=\"ft\">Pé (ft)</option>\n                        </select>\n                    </div>\n                    <input type=\"number\" id=\"length-input\" class=\"converter-input\" placeholder=\"Valor\" step=\"0.01\">\n                    <button onclick=\"convertLength()\" class=\"conversion-button\">Converter</button>\n                    <div id=\"length-result\" class=\"converter-result\"></div>\n                `;\n            } else if (converterType === 'weight') {\n                converterFieldsDiv.innerHTML = `\n                    <div class=\"converter-row\">\n                        <select id=\"from-weight\" class=\"converter-select\">\n                            <option value=\"kg\" selected>Quilograma (kg)</option>\n                            <option value=\"g\">Grama (g)</option>\n                            <option value=\"mg\">Miligrama (mg)</option>\n                            <option value=\"lb\">Libra (lb)</option>\n                            <option value=\"oz\">Onça (oz)</option>\n                        </select>\n                        <select id=\"to-weight\" class=\"converter-select\">\n                            <option value=\"kg\">Quilograma (kg)</option>\n                            <option value=\"g\" selected>Grama (g)</option>\n                            <option value=\"mg\">Miligrama (mg)</option>\n                            <option value=\"lb\">Libra (lb)</option>\n                            <option value=\"oz\">Onça (oz)</option>\n                        </select>\n                    </div>\n                    <input type=\"number\" id=\"weight-input\" class=\"converter-input\" placeholder=\"Valor\" step=\"0.01\">\n                    <button onclick=\"convertWeight()\" class=\"conversion-button\">Converter</button>\n                    <div id=\"weight-result\" class=\"converter-result\"></div>\n                `;\n            } else if (converterType === 'temperature') {\n                converterFieldsDiv.innerHTML = `\n                    <div class=\"converter-row\">\n                        <select id=\"from-temp\" class=\"converter-select\">\n                            <option value=\"c\" selected>Celsius (°C)</option>\n                            <option value=\"f\">Fahrenheit (°F)</option>\n                            <option value=\"k\">Kelvin (K)</option>\n                        </select>\n                        <select id=\"to-temp\" class=\"converter-select\">\n                            <option value=\"c\">Celsius (°C)</option>\n                            <option value=\"f\" selected>Fahrenheit (°F)</option>\n                            <option value=\"k\">Kelvin (K)</option>\n                        </select>\n                    </div>\n                    <input type=\"number\" id=\"temp-input\" class=\"converter-input\" placeholder=\"Valor\" step=\"0.01\">\n                    <button onclick=\"convertTemperature()\" class=\"conversion-button\">Converter</button>\n                    <div id=\"temp-result\" class=\"converter-result\"></div>\n                `;\n            }\n        }\n\n        // Converter functions with real conversion logic\n        function convertCurrency() {\n            const fromCurrency = document.getElementById('from-currency').value;\n            const toCurrency = document.getElementById('to-currency').value;\n            const amount = parseFloat(document.getElementById('currency-input').value);\n            \n            if (isNaN(amount)) {\n                document.getElementById('currency-result').textContent = 'Por favor, insira um valor válido';\n                return;\n            }\n\n            // Currency conversion rates (as of May 2024, approximate)\n            const rates = {\n                USD: { USD: 1, EUR: 0.92, BRL: 5.08, GBP: 0.79, JPY: 154.6 },\n                EUR: { USD: 1.09, EUR: 1, BRL: 5.53, GBP: 0.86, JPY: 168.4 },\n                BRL: { USD: 0.197, EUR: 0.181, BRL: 1, GBP: 0.155, JPY: 30.4 },\n                GBP: { USD: 1.27, EUR: 1.16, BRL: 6.43, GBP: 1, JPY: 195.7 },\n                JPY: { USD: 0.0065, EUR: 0.0059, BRL: 0.033, GBP: 0.0051, JPY: 1 }\n            };\n\n            const result = amount * rates[fromCurrency][toCurrency];\n            document.getElementById('currency-result').textContent = `${amount.toFixed(2)} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;\n        }\n\n        function convertLength() {\n            const fromUnit = document.getElementById('from-length').value;\n            const toUnit = document.getElementById('to-length').value;\n            const value = parseFloat(document.getElementById('length-input').value);\n            \n            if (isNaN(value)) {\n                document.getElementById('length-result').textContent = 'Por favor, insira um valor válido';\n                return;\n            }\n\n            // Convert to meters first (base unit)\n            const toMeters = {\n                m: 1,\n                km: 1000,\n                cm: 0.01,\n                mm: 0.001,\n                in: 0.0254,\n                ft: 0.3048\n            };\n\n            // Convert from meters to target unit\n            const fromMeters = {\n                m: 1,\n                km: 0.001,\n                cm: 100,\n                mm: 1000,\n                in: 39.3701,\n                ft: 3.28084\n            };\n\n            const meters = value * toMeters[fromUnit];\n            const result = meters * fromMeters[toUnit];\n            \n            // Format units for display\n            const unitSymbols = {\n                m: 'm',\n                km: 'km',\n                cm: 'cm',\n                mm: 'mm',\n                in: 'in',\n                ft: 'ft'\n            };\n\n            document.getElementById('length-result').textContent = `${value} ${unitSymbols[fromUnit]} = ${result.toFixed(4)} ${unitSymbols[toUnit]}`;\n        }\n\n        function convertWeight() {\n            const fromUnit = document.getElementById('from-weight').value;\n            const toUnit = document.getElementById('to-weight').value;\n            const value = parseFloat(document.getElementById('weight-input').value);\n            \n            if (isNaN(value)) {\n                document.getElementById('weight-result').textContent = 'Por favor, insira um valor válido';\n                return;\n            }\n\n            // Convert to grams first (base unit)\n            const toGrams = {\n                kg: 1000,\n                g: 1,\n                mg: 0.001,\n                lb: 453.592,\n                oz: 28.3495\n            };\n\n            // Convert from grams to target unit\n            const fromGrams = {\n                kg: 0.001,\n                g: 1,\n                mg: 1000,\n                lb: 0.00220462,\n                oz: 0.035274\n            };\n\n            const grams = value * toGrams[fromUnit];\n            const result = grams * fromGrams[toUnit];\n            \n            // Format units for display\n            const unitSymbols = {\n                kg: 'kg',\n                g: 'g',\n                mg: 'mg',\n                lb: 'lb',\n                oz: 'oz'\n            };\n\n            document.getElementById('weight-result').textContent = `${value} ${unitSymbols[fromUnit]} = ${result.toFixed(4)} ${unitSymbols[toUnit]}`;\n        }\n\n        function convertTemperature() {\n            const fromUnit = document.getElementById('from-temp').value;\n            const toUnit = document.getElementById('to-temp').value;\n            const value = parseFloat(document.getElementById('temp-input').value);\n            \n            if (isNaN(value)) {\n                document.getElementById('temp-result').textContent = 'Por favor, insira um valor válido';\n                return;\n            }\n\n            let result;\n            \n            // Temperature conversion formulas\n            if (fromUnit === toUnit) {\n                result = value;\n            } else if (fromUnit === 'c' && toUnit === 'f') {\n                result = (value * 9/5) + 32;\n            } else if (fromUnit === 'f' && toUnit === 'c') {\n                result = (value - 32) * 5/9;\n            } else if (fromUnit === 'c' && toUnit === 'k') {\n                result = value + 273.15;\n            } else if (fromUnit === 'k' && toUnit === 'c') {\n                result = value - 273.15;\n            } else if (fromUnit === 'f' && toUnit === 'k') {\n                result = (value - 32) * 5/9 + 273.15;\n            } else if (fromUnit === 'k' && toUnit === 'f') {\n                result = (value - 273.15) * 9/5 + 32;\n            }\n            \n            // Format units for display\n            const unitSymbols = {\n                c: '°C',\n                f: '°F',\n                k: 'K'\n            };\n\n            document.getElementById('temp-result').textContent = `${value} ${unitSymbols[fromUnit]} = ${result.toFixed(2)} ${unitSymbols[toUnit]}`;\n        }\n\n        // Initial setup\n        updateConverterFields();\n    </script>\n</body>\n\n</html>",
    }
            // Você pode adicionar mais ferramentas seguindo este formato abaixo
            // ,{
            // id: 'default-nome',
            // title: 'Titulo',
            // code: `<!DOCTYPE html>
            // <html>
            // <!-- Código existente do bloco de notas -->
            // </html>`,
            // createdAt: new Date().toISOString()
            // }  até aqui!


        ];
    }

    // Método para exportar todas as ferramentas
    exportTools() {
        if (this.tools.length === 0) {
            alert('Não há ferramentas para exportar.');
            return;
        }

        // Prepara o objeto para exportação
        const exportData = {
            tools: this.tools,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        // Converte para JSON
        const jsonData = JSON.stringify(exportData, null, 2);

        // Cria um Blob e um link para download
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Cria um elemento de link e simula o clique
        const a = document.createElement('a');
        a.href = url;
        a.download = `ferramentas-html-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Libera o URL
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    // Método para importar ferramentas
    importTools(file) {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const importData = JSON.parse(event.target.result);

                // Verifica se o formato é válido
                if (!importData.tools || !Array.isArray(importData.tools)) {
                    throw new Error('Formato de arquivo inválido.');
                }

                // Pergunta se deseja substituir ou adicionar
                const action = confirm(
                    'Deseja substituir todas as ferramentas existentes?\n' +
                    'OK: Substituir todas as ferramentas\n' +
                    'Cancelar: Adicionar às ferramentas existentes'
                );

                // Substitui ou adiciona as ferramentas
                if (action) {
                    // Substitui todas as ferramentas
                    this.tools = [...importData.tools];
                } else {
                    // Adiciona as novas ferramentas, evitando duplicatas por ID
                    const existingIds = new Set(this.tools.map(tool => tool.id));
                    importData.tools.forEach(tool => {
                        if (!existingIds.has(tool.id)) {
                            this.tools.push(tool);
                        }
                    });
                }

                this.saveTools();
                this.renderToolsList();
                alert(`Importação concluída! ${importData.tools.length} ferramentas importadas.`);

            } catch (error) {
                alert(`Erro ao importar ferramentas: ${error.message}`);
            }
        };

        reader.readAsText(file);
    }

    // 4. Modifique o método toggleFullscreen para adicionar suporte à tecla ESC
    toggleFullscreen() {
        const mainContent = document.querySelector('.main-content');
        const sidebar = document.querySelector('.sidebar');
        const toolHeader = document.querySelector('.tool-header');
        const appHeader = document.querySelector('.app-header');

        // Alterna a classe de modo tela cheia
        mainContent.classList.toggle('fullscreen-mode');
        const isFullscreen = mainContent.classList.contains('fullscreen-mode');

        if (isFullscreen) {
            // ENTRANDO no modo tela cheia
            document.body.classList.add('fullscreen-active');

            // Esconde elementos da interface
            if (sidebar) sidebar.style.display = 'none';
            if (toolHeader) toolHeader.style.display = 'none';
            if (appHeader) appHeader.style.display = 'none';

            // Expande o iframe
            const toolContent = document.getElementById('tool-content');
            if (toolContent) {
                toolContent.style.position = 'fixed';
                toolContent.style.top = '0';
                toolContent.style.left = '0';
                toolContent.style.width = '100vw';
                toolContent.style.height = '100vh';
                toolContent.style.zIndex = '1000';
            }

            // Cria botão de sair
            const exitButton = document.createElement('button');
            exitButton.id = 'exit-fullscreen';
            exitButton.innerHTML = '✕';
            exitButton.style.position = 'fixed';
            exitButton.style.top = '10px';
            exitButton.style.right = '10px';
            exitButton.style.zIndex = '1001';
            exitButton.style.background = 'rgba(0, 0, 0, 0.5)';
            exitButton.style.color = 'white';
            exitButton.style.border = 'none';
            exitButton.style.borderRadius = '50%';
            exitButton.style.width = '30px';
            exitButton.style.height = '30px';
            exitButton.style.cursor = 'pointer';
            exitButton.style.fontSize = '16px';
            exitButton.style.display = 'flex';
            exitButton.style.alignItems = 'center';
            exitButton.style.justifyContent = 'center';

            exitButton.addEventListener('click', () => this.toggleFullscreen());
            document.body.appendChild(exitButton);

            // Adiciona handler para tecla ESC sair do modo tela cheia
            this.escKeyHandler = (e) => {
                if (e.key === 'Escape') this.toggleFullscreen();
            };
            document.addEventListener('keydown', this.escKeyHandler);
        } else {
            // SAINDO do modo tela cheia
            document.body.classList.remove('fullscreen-active');

            // Restaura elementos da interface
            if (sidebar) sidebar.style.display = '';
            if (toolHeader) toolHeader.style.display = '';
            if (appHeader) appHeader.style.display = '';

            // Restaura o iframe
            const toolContent = document.getElementById('tool-content');
            if (toolContent) {
                toolContent.style.position = '';
                toolContent.style.top = '';
                toolContent.style.left = '';
                toolContent.style.width = '';
                toolContent.style.height = '';
                toolContent.style.zIndex = '';
            }

            // Remove o botão de sair
            const exitButton = document.getElementById('exit-fullscreen');
            if (exitButton) exitButton.remove();

            // Remove o handler da tecla ESC
            if (this.escKeyHandler) {
                document.removeEventListener('keydown', this.escKeyHandler);
                this.escKeyHandler = null;
            }
        }
    }
    // Modificação para o construtor para inicializar a visibilidade dos controles
    constructor() {
        this.codeEditor = null;
        this.tools = this.loadTools();
        this.currentToolId = null;
        this.escKeyHandler = null; // Para armazenar o handler da tecla ESC
        this.setupEventListeners();
        this.renderToolsList();
        this.setupSearchFunctionality();

        // Inicializa a visibilidade dos controles
        this.updateToolControlsVisibility();
    }

    // Modifique o método loadTools na classe ToolsManager
    loadTools() {
        const storedTools = localStorage.getItem('html-tools');
        if (storedTools) {
            return JSON.parse(storedTools);
        } else {
            // Se não houver ferramentas salvas, carrega as ferramentas padrão
            const defaultTools = this.getDefaultTools();
            // Salva as ferramentas padrão para futuras sessões
            localStorage.setItem('html-tools', JSON.stringify(defaultTools));
            return defaultTools;
        }
    }

    // Salva as ferramentas no localStorage
    saveTools() {
        localStorage.setItem('html-tools', JSON.stringify(this.tools));
    }

    // Adiciona uma nova ferramenta
    addTool(title, code) {
        const newTool = {
            id: Date.now().toString(),
            title,
            code,
            createdAt: new Date().toISOString()
        };

        this.tools.push(newTool);
        this.saveTools();
        this.renderToolsList();
        return newTool;
    }

    // Atualiza uma ferramenta existente
    updateTool(id, title, code) {
        const toolIndex = this.tools.findIndex(tool => tool.id === id);
        if (toolIndex !== -1) {
            this.tools[toolIndex] = {
                ...this.tools[toolIndex],
                title,
                code,
                updatedAt: new Date().toISOString()
            };
            this.saveTools();
            this.renderToolsList();
            if (this.currentToolId === id) {
                this.displayTool(id);
            }
        }
    }

    // Remove uma ferramenta
    // Versão modificada do método deleteTool
    deleteTool(id) {
        this.tools = this.tools.filter(tool => tool.id !== id);
        this.saveTools();

        // Resetar currentToolId se a ferramenta atual foi excluída
        if (this.currentToolId === id) {
            this.currentToolId = null;

            // Atualiza a interface para mostrar a mensagem de boas-vindas
            document.getElementById('welcome-message').style.display = 'block';
            document.getElementById('tool-view').style.display = 'none';

            // Atualiza a visibilidade dos controles
            this.updateToolControlsVisibility();
        }

        // Renderiza a lista de ferramentas APÓS alterar o estado
        this.renderToolsList();
    }

    // Função melhorada para busca de ferramentas
    searchTools(query) {
        if (!query.trim()) {
            this.renderToolsList();
            return;
        }

        // Quebra a consulta em termos individuais para busca mais precisa
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);

        // Diferentes níveis de correspondência para ordenação por relevância
        const exactMatches = [];
        const startsWithMatches = [];
        const containsMatches = [];

        this.tools.forEach(tool => {
            const title = tool.title.toLowerCase();

            // Verifica se todos os termos de busca estão presentes no título
            const allTermsMatch = searchTerms.every(term => title.includes(term));

            if (allTermsMatch) {
                // Determina o nível de correspondência para ordenação
                if (title === query.toLowerCase()) {
                    exactMatches.push(tool);
                } else if (title.startsWith(searchTerms[0])) {
                    startsWithMatches.push(tool);
                } else {
                    containsMatches.push(tool);
                }
            }
        });

        // Combina os resultados em ordem de relevância
        const filteredTools = [...exactMatches, ...startsWithMatches, ...containsMatches];

        this.renderToolsList(filteredTools);
    }

    // Renderiza a lista de ferramentas
    // Correção para o método renderToolsList
    renderToolsList(toolsToRender = this.tools) {
        const toolsContainer = document.getElementById('tools-container');
        const emptyState = document.getElementById('empty-tools');

        // Limpa o container
        toolsContainer.innerHTML = '';

        if (toolsToRender.length === 0) {
            if (emptyState) {
                const emptyStateClone = emptyState.cloneNode(true);
                toolsContainer.appendChild(emptyStateClone);
            } else {
                const newEmptyState = document.createElement('div');
                newEmptyState.id = 'empty-tools';
                newEmptyState.innerHTML = '<p>Nenhuma ferramenta encontrada.</p>';
                toolsContainer.appendChild(newEmptyState);
            }
            return;
        }

        // Ordena as ferramentas pelo título
        const sortedTools = [...toolsToRender].sort((a, b) =>
            a.title.localeCompare(b.title)
        );

        // Cria os elementos da lista
        sortedTools.forEach(tool => {
            const toolItem = document.createElement('div');
            toolItem.className = 'tool-item';
            if (tool.id === this.currentToolId) {
                toolItem.classList.add('active');
            }
            toolItem.textContent = tool.title;
            toolItem.dataset.id = tool.id;

            // Evento de clique simples para exibir a ferramenta
            toolItem.addEventListener('click', () => {
                this.displayTool(tool.id);
            });

            // Adiciona evento de duplo clique para ativar imediatamente o modo tela cheia
            toolItem.addEventListener('dblclick', (e) => {
                e.preventDefault(); // Evita seleção de texto
                this.displayTool(tool.id);
                setTimeout(() => this.toggleFullscreen(), 50);
            });

            // Adiciona suporte para toque duplo em dispositivos móveis
            let lastTap = 0;
            toolItem.addEventListener('touchend', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;

                if (tapLength < 500 && tapLength > 0) {
                    e.preventDefault();
                    this.displayTool(tool.id);
                    setTimeout(() => this.toggleFullscreen(), 50);
                }

                lastTap = currentTime;
            });

            toolsContainer.appendChild(toolItem);
        });
    }

    // Versão modificada do método displayTool para também atualizar a visibilidade dos controles
    displayTool(id) {
        const tool = this.tools.find(tool => tool.id === id);
        if (!tool) return;

        this.currentToolId = id;

        // Atualiza a interface
        document.getElementById('welcome-message').style.display = 'none';
        document.getElementById('tool-view').style.display = 'flex';
        document.getElementById('tool-title').textContent = tool.title;

        // Atualiza a visibilidade dos controles
        this.updateToolControlsVisibility();

        // Atualiza a classe ativa na lista
        document.querySelectorAll('.tool-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.id === id) {
                item.classList.add('active');
            }
        });

        // Renderiza o conteúdo da ferramenta
        const toolContent = document.getElementById('tool-content');
        toolContent.innerHTML = '';

        // Cria um iframe para isolar o código
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        toolContent.appendChild(iframe);

        // Escreve o código no iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(tool.code);
        iframeDoc.close();

        // Adiciona evento de duplo clique no container para alternar modo tela cheia
        toolContent.addEventListener('dblclick', (e) => {
            e.preventDefault();
            this.toggleFullscreen();
        });

        // Adiciona evento de duplo toque no container para alternar modo tela cheia
        let lastTapContent = 0;
        toolContent.addEventListener('touchend', (e) => {
            // Ignora se o clique foi no botão de sair do modo tela cheia
            if (e.target.id === 'exit-fullscreen') return;

            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTapContent;

            if (tapLength < 500 && tapLength > 0) {
                e.preventDefault();
                this.toggleFullscreen();
            }

            lastTapContent = currentTime;
        });
    }

    // Abre o modal para adicionar uma nova ferramenta
    openAddToolModal() {
        document.getElementById('modal-title').textContent = 'Nova Ferramenta';
        document.getElementById('tool-id').value = '';
        document.getElementById('input-title').value = '';
        document.getElementById('input-code').value = '';
        document.getElementById('tool-modal').style.display = 'flex';
        document.querySelector('[data-tab="editor"]').click();
    }

    // Abre o modal para editar uma ferramenta existente
    openEditToolModal(id) {
        const tool = this.tools.find(tool => tool.id === id);
        if (!tool) return;

        document.getElementById('modal-title').textContent = 'Editar Ferramenta';
        document.getElementById('tool-id').value = tool.id;
        document.getElementById('input-title').value = tool.title;
        document.getElementById('input-code').value = tool.code;
        document.getElementById('tool-modal').style.display = 'flex';
        document.querySelector('[data-tab="editor"]').click();
    }

    // Fecha o modal
    closeModal() {
        document.getElementById('tool-modal').style.display = 'none';
    }

    // Configura os event listeners
    setupEventListeners() {
        // Adicione isto ao método setupEventListeners() na classe ToolsManager
        // Dentro do método setupEventListeners()

        // Botão de exportar
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportTools();
        });

        // Botão de importar
        document.getElementById('import-btn').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });

        // Input de arquivo para importação
        document.getElementById('import-file').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.importTools(e.target.files[0]);
                e.target.value = ''; // Limpa o input para permitir importar o mesmo arquivo novamente
            }
        });
        // Botão de restaurar padrões
        const resetDefaultsBtn = document.getElementById('reset-defaults-btn');
        if (resetDefaultsBtn) { // Importante: verificar se o elemento existe
            resetDefaultsBtn.addEventListener('click', () => {
                this.resetToDefaultTools();
            });
        }
        // Botão de tela cheia
        document.getElementById('fullscreen-btn').addEventListener('click', () => {
            this.toggleFullscreen();
        });


        // Botão para adicionar nova ferramenta
        document.getElementById('add-tool-btn').addEventListener('click', () => {
            this.openAddToolModal();
        });

        // Botão de boas-vindas para adicionar primeira ferramenta
        document.getElementById('welcome-add-btn').addEventListener('click', () => {
            this.openAddToolModal();
        });

        // Botão para editar ferramenta
        document.getElementById('edit-tool-btn').addEventListener('click', () => {
            if (this.currentToolId) {
                this.openEditToolModal(this.currentToolId);
            }
        });

        // Botão para excluir ferramenta
        document.getElementById('delete-tool-btn').addEventListener('click', () => {
            if (this.currentToolId) {
                if (confirm('Tem certeza que deseja excluir esta ferramenta?')) {
                    this.deleteTool(this.currentToolId);
                }
            }
        });

        // Formulário para salvar ferramenta
        document.getElementById('tool-form').addEventListener('submit', (e) => {
            e.preventDefault();

            const id = document.getElementById('tool-id').value;
            const title = document.getElementById('input-title').value;
            const code = document.getElementById('input-code').value;

            if (!title || !code) return;

            if (id) {
                this.updateTool(id, title, code);
            } else {
                const newTool = this.addTool(title, code);
                this.displayTool(newTool.id);
            }

            this.closeModal();
        });

        // Fechar modal
        document.getElementById('close-modal').addEventListener('click', () => {
            this.closeModal();
        });

        // Tabs do modal
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;

                // Atualiza classes ativas
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

                tab.classList.add('active');
                document.getElementById(`${tabName}-tab`).classList.add('active');

                // Se for a tab de preview, atualiza a pré-visualização
                if (tabName === 'preview') {
                    const code = document.getElementById('input-code').value;
                    const previewContainer = document.getElementById('preview-container');

                    // Cria um iframe para a pré-visualização
                    previewContainer.innerHTML = '';
                    const iframe = document.createElement('iframe');
                    iframe.style.width = '100%';
                    iframe.style.height = '350px';
                    iframe.style.border = 'none';
                    previewContainer.appendChild(iframe);

                    // Insere o código no iframe
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    iframeDoc.open();
                    iframeDoc.write(code);
                    iframeDoc.close();
                }
            });
        });

        // Fechar o modal ao clicar fora dele
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('tool-modal');
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Tecla ESC para fechar o modal
        // Modifique o handler da tecla ESC para priorizar a saída do modo tela cheia
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const mainContent = document.querySelector('.main-content');
                const modalVisible = document.getElementById('tool-modal').style.display === 'flex';

                // Se estiver em modo tela cheia, o handler específico cuidará disso
                if (mainContent && mainContent.classList.contains('fullscreen-mode')) {
                    // Não faz nada, o handler específico do modo tela cheia tratará isso
                    return;
                }
                // Se o modal estiver aberto, feche-o
                else if (modalVisible) {
                    this.closeModal();
                }
            }
        });
    }

    // Configura a funcionalidade de busca
    setupSearchFunctionality() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');

        // Busca ao clicar no botão
        searchBtn.addEventListener('click', () => {
            this.searchTools(searchInput.value);
        });

        // Busca ao pressionar Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchTools(searchInput.value);
            }
        });

        // Busca em tempo real ao digitar
        searchInput.addEventListener('input', () => {
            this.searchTools(searchInput.value);
        });
    }
}

// Inicializa o gerenciador de ferramentas quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.toolsManager = new ToolsManager();
});