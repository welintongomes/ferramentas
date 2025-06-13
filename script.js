
// Serviço de IndexedDB para armazenamento de ferramentas
class ToolsDBService {
    constructor() {
        this.dbName = 'toolsDB';
        this.storeName = 'tools';
        this.version = 1;
        this.db = null;
    }

    // Inicializa o banco de dados
    async initDB() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                resolve(this.db);
                return;
            }

            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = (event) => {
                console.error('Erro ao abrir o banco de dados:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'id' });
                }
            };
        });
    }

    // Salva todas as ferramentas
    async saveTools(tools) {
        await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);

            // Limpa o armazenamento atual
            const clearRequest = store.clear();

            clearRequest.onsuccess = () => {
                // Adiciona todas as ferramentas
                let count = 0;
                tools.forEach(tool => {
                    const request = store.add(tool);
                    request.onsuccess = () => {
                        count++;
                        if (count === tools.length) {
                            resolve(true);
                        }
                    };
                    request.onerror = (event) => {
                        console.error('Erro ao salvar ferramenta:', event.target.error);
                        reject(event.target.error);
                    };
                });

                // Se não houver ferramentas para adicionar
                if (tools.length === 0) {
                    resolve(true);
                }
            };

            clearRequest.onerror = (event) => {
                console.error('Erro ao limpar armazenamento:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // Carrega todas as ferramentas
    async loadTools() {

        await this.initDB();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                console.error('Erro ao carregar ferramentas:', event.target.error);
                reject(event.target.error);
            };
        });
    }
}
// Função auxiliar para remover acentos e padronizar para minúsculas
function normalizeText(text) {
    return text
        .normalize("NFD") // separa os acentos
        .replace(/[\u0300-\u036f]/g, "") // remove os acentos
        .toLowerCase();
}
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
    async resetToDefaultTools() {
        if (confirm('Isso irá substituir todas as suas ferramentas pelas ferramentas padrão. Deseja continuar?')) {
            const defaultTools = this.getDefaultTools();
            this.tools = [...defaultTools];
            await this.saveTools();
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
        const mainContent = document.querySelector('.main-contentF');
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
        this.tools = [];
        this.currentToolId = null;
        this.escKeyHandler = null;
        this.dbService = new ToolsDBService(); // Nova instância do serviço de DB

        // Inicializa e carrega ferramentas de forma assíncrona
        this.initTools().then(() => {
            this.setupEventListeners();
            this.renderToolsList();
            this.setupSearchFunctionality();
            this.updateToolControlsVisibility();
        });
    }
    //método para inicializar ferramentas
    async initTools() {
        try {
            this.tools = await this.loadTools();
        } catch (error) {
            console.error('Erro ao inicializar ferramentas:', error);
            this.tools = [];
        }
    }

    // Modifique o método loadTools na classe ToolsManager
    async loadTools() {
        try {
            // Tenta carregar do IndexedDB
            const tools = await this.dbService.loadTools();

            if (tools && tools.length > 0) {
                return tools;
            } else {
                // Se não houver ferramentas no IndexedDB, verifica no localStorage para migração
                const storedTools = localStorage.getItem('html-tools');

                if (storedTools) {
                    // Migra dados do localStorage para IndexedDB
                    const parsedTools = JSON.parse(storedTools);
                    await this.dbService.saveTools(parsedTools);
                    // Limpa localStorage após migração
                    localStorage.removeItem('html-tools');
                    return parsedTools;
                } else {
                    // Se não há dados em nenhum lugar, carrega ferramentas padrão
                    const defaultTools = this.getDefaultTools();
                    await this.dbService.saveTools(defaultTools);
                    return defaultTools;
                }
            }
        } catch (error) {
            console.error('Erro ao carregar ferramentas:', error);
            // Em caso de erro, retorna ferramentas padrão
            return this.getDefaultTools();
        }
    }

    // Salva as ferramentas no localStorage
    async saveTools() {
        try {
            await this.dbService.saveTools(this.tools);
        } catch (error) {
            console.error('Erro ao salvar ferramentas:', error);
            // Fallback para localStorage em caso de erro
            localStorage.setItem('html-tools', JSON.stringify(this.tools));
        }
    }

    // Adiciona uma nova ferramenta
    async addTool(title, code) {
        const newTool = {
            id: Date.now().toString(),
            title,
            code,
            createdAt: new Date().toISOString()
        };

        this.tools.push(newTool);
        await this.saveTools();
        this.renderToolsList();
        return newTool;
    }

    // Atualiza uma ferramenta existente
    async updateTool(id, title, code) {
        const toolIndex = this.tools.findIndex(tool => tool.id === id);
        if (toolIndex !== -1) {
            this.tools[toolIndex] = {
                ...this.tools[toolIndex],
                title,
                code,
                updatedAt: new Date().toISOString()
            };
            await this.saveTools();
            this.renderToolsList();
            if (this.currentToolId === id) {
                this.displayTool(id);
            }
        }
    }

    // Remove uma ferramenta
    async deleteTool(id) {
        this.tools = this.tools.filter(tool => tool.id !== id);
        await this.saveTools();

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

        const normalizedQuery = normalizeText(query);
        // Quebra a consulta em termos individuais para busca mais precisa
        const searchTerms = normalizedQuery.split(' ').filter(term => term.length > 0);

        const exactMatches = [];
        const startsWithMatches = [];
        const containsMatches = [];

        this.tools.forEach(tool => {
            const normalizedTitle = normalizeText(tool.title);

            // Verifica se todos os termos estão no título, em qualquer ordem
            const allTermsMatch = searchTerms.every(term => normalizedTitle.includes(term));

            if (allTermsMatch) {
                // Relevância baseada no título completo normalizado
                if (normalizedTitle === normalizedQuery) {
                    exactMatches.push(tool);
                } else if (normalizedTitle.startsWith(searchTerms[0])) {
                    startsWithMatches.push(tool);
                } else {
                    containsMatches.push(tool);
                }
            }
        });

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
            initCodeEditor();
        });

        // Botão de boas-vindas para adicionar primeira ferramenta
        document.getElementById('welcome-add-btn').addEventListener('click', () => {
            this.openAddToolModal();
            initCodeEditor();
        });

        // Botão para editar ferramenta
        document.getElementById('edit-tool-btn').addEventListener('click', () => {
            if (this.currentToolId) {
                this.openEditToolModal(this.currentToolId);
            }
            initCodeEditor();
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
                const mainContent = document.querySelector('.main-contentF');
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
        const clearBtn = document.getElementById('clear-search-btn');

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
            const value = searchInput.value;
            this.searchTools(value);

            // Mostrar ou ocultar o botão de limpar
            clearBtn.style.display = value.trim() !== '' ? 'inline-block' : 'none';
        });

        // Limpar o campo de busca
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearBtn.style.display = 'none';
            searchInput.focus();
            this.searchTools(''); // Executa busca com string vazia
        });
    }

}


// Inicializa o gerenciador de ferramentas quando a página carregar
document.addEventListener('DOMContentLoaded', async () => {
    window.toolsManager = new ToolsManager();
});
// Variável global para o editor
let codeEditor = null;

// Classe do editor de código
class CodeEditor {
    constructor() {
        this.textarea = document.getElementById('input-code');
        this.searchInput = document.getElementById('code-search-input');
        this.searchBtn = document.getElementById('code-search-btn');
        this.prevBtn = document.getElementById('code-prev-btn');
        this.nextBtn = document.getElementById('code-next-btn');
        this.searchResults = document.getElementById('code-search-results');
        this.charCount = document.getElementById('code-char-count');
        this.lineCount = document.getElementById('code-line-count');

        this.currentMatches = [];
        this.currentMatchIndex = -1;
        this.lastSearch = '';

        this.init();
    }

    init() {
        if (!this.textarea) return;

        this.searchBtn?.addEventListener('click', () => this.performSearch());
        this.searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch();
            }
        });
        this.searchInput?.addEventListener('input', () => {
            if (this.searchInput.value === '') {
                this.clearSearch();
            }
        });

        this.prevBtn?.addEventListener('click', () => this.navigateSearch(-1));
        this.nextBtn?.addEventListener('click', () => this.navigateSearch(1));

        // ADICIONE este novo event listener para busca em tempo real:
        // this.searchInput?.addEventListener('input', (e) => {
        //     if (e.target.value.trim() && e.target.value.length > 2) {
        //         // Busca automaticamente após 3 caracteres
        //         clearTimeout(this.searchTimeout);
        //         this.searchTimeout = setTimeout(() => {
        //             this.performSearch();
        //         }, 300);
        //     } else if (e.target.value === '') {
        //         this.clearSearch();
        //     }
        // });

        this.textarea.addEventListener('input', () => {
            this.updateStats();
            if (this.lastSearch) {
                this.performSearch();
            }
        });

        this.textarea.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                this.searchInput?.focus();
                this.searchInput?.select();
            }
                    // ADICIONE navegação com F3/Shift+F3
        if (e.key === 'F3') {
            e.preventDefault();
            if (e.shiftKey) {
                this.navigateSearch(-1);
            } else {
                this.navigateSearch(1);
            }
        }


            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.textarea.selectionStart;
                const end = this.textarea.selectionEnd;

                this.textarea.value = this.textarea.value.substring(0, start) +
                    '    ' +
                    this.textarea.value.substring(end);

                this.textarea.selectionStart = this.textarea.selectionEnd = start + 4;
            }
        });

        this.updateStats();
    }

    performSearch() {
        const searchTerm = this.searchInput?.value.trim();
        if (!searchTerm) {
            this.clearSearch();
            return;
        }

        this.lastSearch = searchTerm;
        const content = this.textarea.value;
        const searchLower = searchTerm.toLowerCase();
        const contentLower = content.toLowerCase();

        this.currentMatches = [];
        let index = 0;

        // Busca todas as ocorrências mantendo as posições originais
        while ((index = contentLower.indexOf(searchLower, index)) !== -1) {
            this.currentMatches.push({
                start: index,
                end: index + searchTerm.length,
                text: content.substring(index, index + searchTerm.length)
            });
            index++;
        }

        if (this.currentMatches.length > 0) {
            this.currentMatchIndex = 0;
            this.highlightCurrentMatch();
            if (this.searchResults) {
                this.searchResults.textContent = `1 de ${this.currentMatches.length}`;
                this.searchResults.className = '';
            }
        } else {
            if (this.searchResults) {
                this.searchResults.textContent = 'Nenhum resultado';
                this.searchResults.className = 'search-no-results';
            }
        }
    }

    navigateSearch(direction) {
        if (this.currentMatches.length === 0) return;

        // Calcula o novo índice
        let newIndex = this.currentMatchIndex + direction;

        // Faz o wrap around (volta ao início/fim)
        if (newIndex >= this.currentMatches.length) {
            newIndex = 0;
        } else if (newIndex < 0) {
            newIndex = this.currentMatches.length - 1;
        }

        this.currentMatchIndex = newIndex;
        this.highlightCurrentMatch();

        if (this.searchResults) {
            this.searchResults.textContent = `${this.currentMatchIndex + 1} de ${this.currentMatches.length}`;
        }
    }

    highlightCurrentMatch() {
        if (this.currentMatches.length === 0 || this.currentMatchIndex < 0) return;

        const match = this.currentMatches[this.currentMatchIndex];

        // Seleciona o texto encontrado
        this.textarea.focus();
        this.textarea.setSelectionRange(match.start, match.end);

        // Calcula a posição para scroll
        const textBeforeMatch = this.textarea.value.substring(0, match.start);
        const linesBeforeMatch = textBeforeMatch.split('\n').length - 1;

        // Calcula o scroll necessário
        const textareaStyle = window.getComputedStyle(this.textarea);
        const lineHeight = parseInt(textareaStyle.lineHeight) || 21;
        const textareaHeight = this.textarea.clientHeight;
        const linesVisible = Math.floor(textareaHeight / lineHeight);

        // Posiciona o scroll para mostrar o resultado no centro da área visível
        const targetScrollLine = Math.max(0, linesBeforeMatch - Math.floor(linesVisible / 2));
        this.textarea.scrollTop = targetScrollLine * lineHeight;

        // Força o foco no textarea para garantir que a seleção seja visível
        setTimeout(() => {
            this.textarea.focus();
        }, 10);
    }

    // ADICIONE também esta função melhorada para limpar a busca:
    clearSearch() {
        this.currentMatches = [];
        this.currentMatchIndex = -1;
        this.lastSearch = '';
        if (this.searchResults) {
            this.searchResults.textContent = '';
            this.searchResults.className = '';
        }
        // Remove qualquer seleção existente
        if (this.textarea) {
            this.textarea.setSelectionRange(0, 0);
        }
    }

    updateStats() {
        const content = this.textarea.value;
        const charCount = content.length;
        const lineCount = content.split('\n').length;

        if (this.charCount) {
            this.charCount.textContent = `${charCount} caracteres`;
        }
        if (this.lineCount) {
            this.lineCount.textContent = `${lineCount} ${lineCount === 1 ? 'linha' : 'linhas'}`;
        }
    }
}

function initCodeEditor() {
    setTimeout(() => {
        if (!codeEditor) {
            codeEditor = new CodeEditor();
        }
    }, 100);
}
