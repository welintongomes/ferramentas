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
                "id": "Master-calc",
                "title": "MasterCalc",
                "code": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Calculadora Avançada</title>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            display: flex;\n            justify-content: center;\n            align-items: center;\n            height: 100vh;\n            margin: 0;\n            background-color: #f5f5f5;\n        }\n        .app-container {\n            background-color: #fff;\n            border-radius: 10px;\n            box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n            padding: 20px;\n            width: 320px;\n        }\n        .tabs {\n            display: flex;\n            margin-bottom: 15px;\n        }\n        .tab {\n            flex: 1;\n            text-align: center;\n            padding: 10px;\n            background-color: #e0e0e0;\n            cursor: pointer;\n            border-radius: 5px 5px 0 0;\n        }\n        .tab.active {\n            background-color: #4caf50;\n            color: white;\n        }\n        .tab-content {\n            display: none;\n        }\n        .tab-content.active {\n            display: block;\n        }\n        .display {\n            background-color: #f0f0f0;\n            border-radius: 5px;\n            padding: 10px;\n            margin-bottom: 15px;\n            text-align: right;\n            font-size: 24px;\n            height: 40px;\n            overflow: hidden;\n        }\n        .buttons {\n            display: grid;\n            grid-template-columns: repeat(4, 1fr);\n            gap: 10px;\n        }\n        button {\n            background-color: #e0e0e0;\n            border: none;\n            border-radius: 5px;\n            padding: 15px;\n            font-size: 18px;\n            cursor: pointer;\n            transition: background-color 0.2s;\n        }\n        button:hover {\n            background-color: #d0d0d0;\n        }\n        .operator {\n            background-color: #f8a51b;\n            color: white;\n        }\n        .operator:hover {\n            background-color: #e59400;\n        }\n        .equals {\n            background-color: #4caf50;\n            color: white;\n        }\n        .equals:hover {\n            background-color: #3d8c40;\n        }\n        .clear {\n            background-color: #f44336;\n            color: white;\n        }\n        .clear:hover {\n            background-color: #d32f2f;\n        }\n        .converter-container {\n            margin-top: 15px;\n        }\n        .converter-row {\n            display: flex;\n            justify-content: space-between;\n            margin-bottom: 10px;\n        }\n        .converter-group {\n            flex: 1;\n            margin-right: 10px;\n        }\n        .converter-group:last-child {\n            margin-right: 0;\n        }\n        select, input {\n            width: 100%;\n            padding: 8px;\n            border: 1px solid #ddd;\n            border-radius: 5px;\n            margin-top: 5px;\n            box-sizing: border-box;\n        }\n        .converter-label {\n            font-size: 14px;\n            color: #555;\n            margin-bottom: 5px;\n        }\n        .converter-type-select {\n            margin-bottom: 15px;\n            width: 100%;\n            padding: 10px;\n            border-radius: 5px;\n            border: 1px solid #ddd;\n        }\n    </style>\n</head>\n<body>\n    <div class=\"app-container\">\n        <div class=\"tabs\">\n            <div class=\"tab active\" onclick=\"switchTab('calculator')\">Calculadora</div>\n            <div class=\"tab\" onclick=\"switchTab('converter')\">Conversor</div>\n        </div>\n        \n        <div id=\"calculator\" class=\"tab-content active\">\n            <div class=\"display\" id=\"display\">0</div>\n            <div class=\"buttons\">\n                <button class=\"clear\" onclick=\"clearDisplay()\">C</button>\n                <button onclick=\"appendCharacter('(')\">(</button>\n                <button onclick=\"appendCharacter(')')\">)</button>\n                <button class=\"operator\" onclick=\"appendCharacter('/')\">/</button>\n                \n                <button onclick=\"appendCharacter('7')\">7</button>\n                <button onclick=\"appendCharacter('8')\">8</button>\n                <button onclick=\"appendCharacter('9')\">9</button>\n                <button class=\"operator\" onclick=\"appendCharacter('*')\">×</button>\n                \n                <button onclick=\"appendCharacter('4')\">4</button>\n                <button onclick=\"appendCharacter('5')\">5</button>\n                <button onclick=\"appendCharacter('6')\">6</button>\n                <button class=\"operator\" onclick=\"appendCharacter('-')\">-</button>\n                \n                <button onclick=\"appendCharacter('1')\">1</button>\n                <button onclick=\"appendCharacter('2')\">2</button>\n                <button onclick=\"appendCharacter('3')\">3</button>\n                <button class=\"operator\" onclick=\"appendCharacter('+')\">+</button>\n                \n                <button onclick=\"appendCharacter('0')\">0</button>\n                <button onclick=\"appendCharacter('.')\">.</button>\n                <button onclick=\"calculatePercentage()\">%</button>\n                <button class=\"equals\" onclick=\"calculate()\">=</button>\n            </div>\n        </div>\n        \n        <div id=\"converter\" class=\"tab-content\">\n            <select id=\"converterType\" class=\"converter-type-select\" onchange=\"switchConverter()\">\n                <option value=\"currency\">Conversor de Moeda</option>\n                <option value=\"length\">Conversor de Comprimento</option>\n                <option value=\"weight\">Conversor de Peso</option>\n                <option value=\"temperature\">Conversor de Temperatura</option>\n            </select>\n            \n            <div id=\"currencyConverter\" class=\"converter-container\">\n                <div class=\"converter-row\">\n                    <div class=\"converter-group\">\n                        <div class=\"converter-label\">De:</div>\n                        <select id=\"fromCurrency\" onchange=\"updateConversion('currency')\">\n                            <option value=\"BRL\">Real (BRL)</option>\n                            <option value=\"USD\">Dólar (USD)</option>\n                            <option value=\"EUR\">Euro (EUR)</option>\n                            <option value=\"GBP\">Libra (GBP)</option>\n                            <option value=\"JPY\">Iene (JPY)</option>\n                        </select>\n                    </div>\n                    <div class=\"converter-group\">\n                        <div class=\"converter-label\">Para:</div>\n                        <select id=\"toCurrency\" onchange=\"updateConversion('currency')\">\n                            <option value=\"USD\">Dólar (USD)</option>\n                            <option value=\"BRL\">Real (BRL)</option>\n                            <option value=\"EUR\">Euro (EUR)</option>\n                            <option value=\"GBP\">Libra (GBP)</option>\n                            <option value=\"JPY\">Iene (JPY)</option>\n                        </select>\n                    </div>\n                </div>\n                <div class=\"converter-row\">\n                    <div class=\"converter-group\">\n                        <div class=\"converter-label\">Valor:</div>\n                        <input type=\"number\" id=\"currencyAmount\" value=\"1\" onchange=\"updateConversion('currency')\">\n                    </div>\n                    <div class=\"converter-group\">\n                        <div class=\"converter-label\">Resultado:</div>\n                        <input type=\"text\" id=\"currencyResult\" readonly>\n                    </div>\n                </div>\n                <div class=\"converter-row\">\n                    <div class=\"converter-label\">Taxa de câmbio:</div>\n                    <input type=\"number\" id=\"exchangeRate\" step=\"0.01\" placeholder=\"Taxa personalizada\" onchange=\"saveExchangeRate()\">\n                </div>\n            </div>\n\n            <div id=\"lengthConverter\" class=\"converter-container\" style=\"display: none;\">\n                <div class=\"converter-row\">\n                    <div class=\"converter-group\">\n                        <div class=\"converter-label\">De:</div>\n                        <select id=\"fromLength\" onchange=\"updateConversion('length')\">\n                            <option value=\"m\">Metro (m)</option>\n                            <option value=\"km\">Quilômetro (km)</option>\n                            <option value=\"cm\">Centímetro (cm)</option>\n                            <option value=\"mm\">Milímetro (mm)</option>\n                            <option value=\"ft\">Pé (ft)</option>\n                            <option value=\"in\">Polegada (in)</option>\n                        </select>\n                    </div>\n                    <div class=\"converter-group\">\n                        <div class=\"converter-label\">Para:</div>\n                        <select id=\"toLength\" onchange=\"updateConversion('length')\">\n                            <option value=\"cm\">Centímetro (cm)</option>\n                            <option value=\"m\">Metro (m)</option>\n                            <option value=\"km\">Quilômetro (km)</option>\n                            <option value=\"mm\">Milímetro (mm)</option>\n                            <option value=\"ft\">Pé (ft)</option>\n                            <option value=\"in\">Polegada (in)</option>\n                        </select>\n                    </div>\n                </div>\n                <div class=\"converter-row\">\n                    <div class=\"converter-group\">\n                        <div class=\"converter-label\">Valor:</div>\n                        <input type=\"number\" id=\"lengthAmount\" value=\"1\" onchange=\"updateConversion('length')\">\n                    </div>\n                    <div class=\"converter-group\">\n                        <div class=\"converter-label\">Resultado:</div>\n                        <input type=\"text\" id=\"lengthResult\" readonly>\n                    </div>\n                </div>\n            </div>\n\n            <div id=\"weightConverter\" class=\"converter-container\" style=\"display: none;\">\n                <div class=\"converter-row\">\n                    <div class=\"converter-group\">\n                        <div class=\"converter-label\">De:</div>\n                        <select id=\"fromWeight\" onchange=\"updateConversion('weight')\">\n                            <option value=\"kg\">Quilograma (kg)</option>\n                            <option value=\"g\">Grama (g)</option>\n                            <option value=\"lb\">Libra (lb)</option>\n                            <option value=\"oz\">Onça (oz)</option>\n                        </select>\n                    </div>\n                    <div class=\"converter-group\">\n                        <div class=\"converter-label\">Para:</div>\n                        <select id=\"toWeight\" onchange=\"updateConversion('weight')\">\n                            <option value=\"g\">Grama (g)</option>\n                            <option value=\"kg\">Quilograma (kg)</option>\n                            <option value=\"lb\">Libra (lb)</option>\n                            <option value=\"oz\">Onça (oz)</option>\n                        </select>\n                    </div>\n                </div>\n                <div class=\"converter-row\">\n                    <div class=\"converter-group\">\n                        <div class=\"converter-label\">Valor:</div>\n                        <input type=\"number\" id=\"weightAmount\" value=\"1\" onchange=\"updateConversion('weight')\">\n                    </div>\n                    <div class=\"converter-group\">\n                        <div class=\"converter-label\">Resultado:</div>\n                        <input type=\"text\" id=\"weightResult\" readonly>\n                    </div>\n                </div>\n            </div>\n\n            <div id=\"temperatureConverter\" class=\"converter-container\" style=\"display: none;\">\n                <div class=\"converter-row\">\n                    <div class=\"converter-group\">\n                        <div class=\"converter-label\">De:</div>\n                        <select id=\"fromTemperature\" onchange=\"updateConversion('temperature')\">\n                            <option value=\"C\">Celsius (°C)</option>\n                            <option value=\"F\">Fahrenheit (°F)</option>\n                            <option value=\"K\">Kelvin (K)</option>\n                        </select>\n                    </div>\n                    <div class=\"converter-group\">\n                        <div class=\"converter-label\">Para:</div>\n                        <select id=\"toTemperature\" onchange=\"updateConversion('temperature')\">\n                            <option value=\"F\">Fahrenheit (°F)</option>\n                            <option value=\"C\">Celsius (°C)</option>\n                            <option value=\"K\">Kelvin (K)</option>\n                        </select>\n                    </div>\n                </div>\n                <div class=\"converter-row\">\n                    <div class=\"converter-group\">\n                        <div class=\"converter-label\">Valor:</div>\n                        <input type=\"number\" id=\"temperatureAmount\" value=\"0\" onchange=\"updateConversion('temperature')\">\n                    </div>\n                    <div class=\"converter-group\">\n                        <div class=\"converter-label\">Resultado:</div>\n                        <input type=\"text\" id=\"temperatureResult\" readonly>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <script>\n        // Calculadora\n        let display = document.getElementById('display');\n        let currentExpression = '0';\n        let lastResult = 0;\n        let percentMode = false;\n\n        function updateDisplay() {\n            display.textContent = currentExpression;\n        }\n\n        function appendCharacter(char) {\n            if (currentExpression === '0' && char !== '.') {\n                currentExpression = char;\n            } else {\n                currentExpression += char;\n            }\n            updateDisplay();\n        }\n\n        function clearDisplay() {\n            currentExpression = '0';\n            updateDisplay();\n        }\n\n        function backspace() {\n            if (currentExpression.length <= 1) {\n                currentExpression = '0';\n            } else {\n                currentExpression = currentExpression.slice(0, -1);\n            }\n            updateDisplay();\n        }\n\n        function calculate() {\n            try {\n                // Substituir × por * para cálculo\n                let expressionToEval = currentExpression.replace(/×/g, '*');\n                lastResult = eval(expressionToEval);\n                currentExpression = lastResult.toString();\n                updateDisplay();\n            } catch (error) {\n                currentExpression = 'Erro';\n                updateDisplay();\n                setTimeout(clearDisplay, 1000);\n            }\n        }\n\n        function calculatePercentage() {\n            try {\n                // Verificar se já tem uma expressão em andamento\n                if (currentExpression.includes('+') || \n                    currentExpression.includes('-') || \n                    currentExpression.includes('*') || \n                    currentExpression.includes('/')) {\n                    \n                    // Encontrar o último operador\n                    let lastOpIndex = Math.max(\n                        currentExpression.lastIndexOf('+'),\n                        currentExpression.lastIndexOf('-'),\n                        currentExpression.lastIndexOf('*'),\n                        currentExpression.lastIndexOf('/')\n                    );\n                    \n                    if (lastOpIndex >= 0) {\n                        let operator = currentExpression[lastOpIndex];\n                        let baseNumber = parseFloat(currentExpression.substring(0, lastOpIndex));\n                        let percentage = parseFloat(currentExpression.substring(lastOpIndex + 1)) / 100;\n                        \n                        // Calcular o resultado dependendo do operador\n                        let result;\n                        if (operator === '+') {\n                            result = baseNumber + (baseNumber * percentage);\n                        } else if (operator === '-') {\n                            result = baseNumber - (baseNumber * percentage);\n                        } else if (operator === '*') {\n                            result = baseNumber * percentage;\n                        } else if (operator === '/') {\n                            result = baseNumber / percentage;\n                        }\n                        \n                        currentExpression = result.toString();\n                        updateDisplay();\n                    }\n                } else {\n                    // Se não há operador, apenas calcular a porcentagem\n                    let value = parseFloat(currentExpression) / 100;\n                    currentExpression = value.toString();\n                    updateDisplay();\n                }\n            } catch (error) {\n                currentExpression = 'Erro';\n                updateDisplay();\n                setTimeout(clearDisplay, 1000);\n            }\n        }\n\n        // Navegação por abas\n        function switchTab(tabId) {\n            document.querySelectorAll('.tab-content').forEach(tab => {\n                tab.classList.remove('active');\n            });\n            document.querySelectorAll('.tab').forEach(tab => {\n                tab.classList.remove('active');\n            });\n            \n            document.getElementById(tabId).classList.add('active');\n            document.querySelector(`.tab[onclick=\"switchTab('${tabId}')\"]`).classList.add('active');\n            \n            // Inicializar conversão se estiver mudando para o conversor\n            if (tabId === 'converter') {\n                const currentType = document.getElementById('converterType').value;\n                updateConversion(currentType);\n            }\n        }\n\n        // Funções do conversor\n        function switchConverter() {\n            const converterType = document.getElementById('converterType').value;\n            \n            // Esconder todos os conversores\n            document.querySelectorAll('.converter-container').forEach(container => {\n                container.style.display = 'none';\n            });\n            \n            // Mostrar o conversor selecionado\n            document.getElementById(`${converterType}Converter`).style.display = 'block';\n            \n            // Atualizar a conversão\n            updateConversion(converterType);\n        }\n\n        // Conversão de moedas\n        const exchangeRates = {\n            'USD': { 'BRL': 5.64, 'EUR': 0.92, 'GBP': 0.79, 'JPY': 110.23, 'USD': 1 },\n            'BRL': { 'USD': 0.18, 'EUR': 0.16, 'GBP': 0.14, 'JPY': 19.54, 'BRL': 1 },\n            'EUR': { 'USD': 1.09, 'BRL': 6.15, 'GBP': 0.86, 'JPY': 120.18, 'EUR': 1 },\n            'GBP': { 'USD': 1.27, 'BRL': 7.14, 'EUR': 1.16, 'JPY': 139.74, 'GBP': 1 },\n            'JPY': { 'USD': 0.0091, 'BRL': 0.051, 'EUR': 0.0083, 'GBP': 0.0072, 'JPY': 1 }\n        };\n\n        // Fatores de conversão para comprimento\n        const lengthFactors = {\n            'm': { 'm': 1, 'km': 0.001, 'cm': 100, 'mm': 1000, 'ft': 3.28084, 'in': 39.3701 },\n            'km': { 'm': 1000, 'km': 1, 'cm': 100000, 'mm': 1000000, 'ft': 3280.84, 'in': 39370.1 },\n            'cm': { 'm': 0.01, 'km': 0.00001, 'cm': 1, 'mm': 10, 'ft': 0.0328084, 'in': 0.393701 },\n            'mm': { 'm': 0.001, 'km': 0.000001, 'cm': 0.1, 'mm': 1, 'ft': 0.00328084, 'in': 0.0393701 },\n            'ft': { 'm': 0.3048, 'km': 0.0003048, 'cm': 30.48, 'mm': 304.8, 'ft': 1, 'in': 12 },\n            'in': { 'm': 0.0254, 'km': 0.0000254, 'cm': 2.54, 'mm': 25.4, 'ft': 0.0833333, 'in': 1 }\n        };\n\n        // Fatores de conversão para peso\n        const weightFactors = {\n            'kg': { 'kg': 1, 'g': 1000, 'lb': 2.20462, 'oz': 35.274 },\n            'g': { 'kg': 0.001, 'g': 1, 'lb': 0.00220462, 'oz': 0.035274 },\n            'lb': { 'kg': 0.453592, 'g': 453.592, 'lb': 1, 'oz': 16 },\n            'oz': { 'kg': 0.0283495, 'g': 28.3495, 'lb': 0.0625, 'oz': 1 }\n        };\n\n        // Carregar valores salvos\n        function loadSavedValues() {\n            // Carregar as taxas de câmbio personalizadas\n            for (let fromCurr in exchangeRates) {\n                for (let toCurr in exchangeRates[fromCurr]) {\n                    const savedRate = localStorage.getItem(`exchangeRate_${fromCurr}_${toCurr}`);\n                    if (savedRate !== null) {\n                        exchangeRates[fromCurr][toCurr] = parseFloat(savedRate);\n                    }\n                }\n            }\n            \n            // Carregar as últimas seleções\n            const lastConverterType = localStorage.getItem('lastConverterType');\n            if (lastConverterType) {\n                document.getElementById('converterType').value = lastConverterType;\n            }\n            \n            // Carregar as últimas unidades selecionadas para cada conversor\n            const currencyTypes = ['from', 'to'];\n            const converterTypes = ['Currency', 'Length', 'Weight', 'Temperature'];\n            \n            converterTypes.forEach(type => {\n                currencyTypes.forEach(direction => {\n                    const savedValue = localStorage.getItem(`last${direction}${type}`);\n                    if (savedValue && document.getElementById(`${direction}${type}`)) {\n                        document.getElementById(`${direction}${type}`).value = savedValue;\n                    }\n                });\n                \n                const savedAmount = localStorage.getItem(`last${type}Amount`);\n                if (savedAmount && document.getElementById(`${type.toLowerCase()}Amount`)) {\n                    document.getElementById(`${type.toLowerCase()}Amount`).value = savedAmount;\n                }\n            });\n            \n            // Inicializar o conversor\n            switchConverter();\n        }\n\n        // Salvar taxa de câmbio personalizada\n        function saveExchangeRate() {\n            const rate = parseFloat(document.getElementById('exchangeRate').value);\n            if (!isNaN(rate) && rate > 0) {\n                const fromCurrency = document.getElementById('fromCurrency').value;\n                const toCurrency = document.getElementById('toCurrency').value;\n                \n                // Atualizar e salvar a taxa\n                exchangeRates[fromCurrency][toCurrency] = rate;\n                localStorage.setItem(`exchangeRate_${fromCurrency}_${toCurrency}`, rate);\n                \n                // Atualizar também a taxa inversa\n                const inverseRate = 1 / rate;\n                exchangeRates[toCurrency][fromCurrency] = inverseRate;\n                localStorage.setItem(`exchangeRate_${toCurrency}_${fromCurrency}`, inverseRate);\n                \n                // Atualizar a conversão\n                updateConversion('currency');\n            }\n        }\n\n        // Função para atualizar o campo de taxa de câmbio exibido\n        function updateExchangeRateField() {\n            const fromCurrency = document.getElementById('fromCurrency').value;\n            const toCurrency = document.getElementById('toCurrency').value;\n            document.getElementById('exchangeRate').value = exchangeRates[fromCurrency][toCurrency];\n        }\n\n        // Funções de conversão\n        function updateConversion(type) {\n            switch(type) {\n                case 'currency':\n                    convertCurrency();\n                    break;\n                case 'length':\n                    convertLength();\n                    break;\n                case 'weight':\n                    convertWeight();\n                    break;\n                case 'temperature':\n                    convertTemperature();\n                    break;\n            }\n            \n            // Salvar as seleções atuais\n            localStorage.setItem('lastConverterType', type);\n        }\n\n        function convertCurrency() {\n            const fromCurrency = document.getElementById('fromCurrency').value;\n            const toCurrency = document.getElementById('toCurrency').value;\n            const amount = parseFloat(document.getElementById('currencyAmount').value);\n            \n            // Salvar as seleções\n            localStorage.setItem('lastfromCurrency', fromCurrency);\n            localStorage.setItem('lasttoCurrency', toCurrency);\n            localStorage.setItem('lastCurrencyAmount', amount);\n            \n            if (!isNaN(amount)) {\n                const rate = exchangeRates[fromCurrency][toCurrency];\n                const result = (amount * rate).toFixed(2);\n                document.getElementById('currencyResult').value = result;\n                updateExchangeRateField();\n            }\n        }\n\n        function convertLength() {\n            const fromUnit = document.getElementById('fromLength').value;\n            const toUnit = document.getElementById('toLength').value;\n            const amount = parseFloat(document.getElementById('lengthAmount').value);\n            \n            // Salvar as seleções\n            localStorage.setItem('lastfromLength', fromUnit);\n            localStorage.setItem('lasttoLength', toUnit);\n            localStorage.setItem('lastLengthAmount', amount);\n            \n            if (!isNaN(amount)) {\n                const factor = lengthFactors[fromUnit][toUnit];\n                const result = (amount * factor).toFixed(4);\n                document.getElementById('lengthResult').value = result;\n            }\n        }\n\n        function convertWeight() {\n            const fromUnit = document.getElementById('fromWeight').value;\n            const toUnit = document.getElementById('toWeight').value;\n            const amount = parseFloat(document.getElementById('weightAmount').value);\n            \n            // Salvar as seleções\n            localStorage.setItem('lastfromWeight', fromUnit);\n            localStorage.setItem('lasttoWeight', toUnit);\n            localStorage.setItem('lastWeightAmount', amount);\n            \n            if (!isNaN(amount)) {\n                const factor = weightFactors[fromUnit][toUnit];\n                const result = (amount * factor).toFixed(4);\n                document.getElementById('weightResult').value = result;\n            }\n        }\n\n        function convertTemperature() {\n            const fromUnit = document.getElementById('fromTemperature').value;\n            const toUnit = document.getElementById('toTemperature').value;\n            const amount = parseFloat(document.getElementById('temperatureAmount').value);\n            \n            // Salvar as seleções\n            localStorage.setItem('lastfromTemperature', fromUnit);\n            localStorage.setItem('lasttoTemperature', toUnit);\n            localStorage.setItem('lastTemperatureAmount', amount);\n            \n            if (!isNaN(amount)) {\n                let result;\n                \n                // Converter para Celsius primeiro\n                let tempInC;\n                if (fromUnit === 'C') tempInC = amount;\n                else if (fromUnit === 'F') tempInC = (amount - 32) * 5/9;\n                else if (fromUnit === 'K') tempInC = amount - 273.15;\n                \n                // Converter de Celsius para a unidade alvo\n                if (toUnit === 'C') result = tempInC;\n                else if (toUnit === 'F') result = tempInC * 9/5 + 32;\n                else if (toUnit === 'K') result = tempInC + 273.15;\n                \n                document.getElementById('temperatureResult').value = result.toFixed(2);\n            }\n        }\n\n        // Inicialização\n        window.onload = function() {\n            loadSavedValues();\n        };\n    </script>\n</body>\n</html>",
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
