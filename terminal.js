const terminal = document.getElementById('terminal');
const input = document.getElementById('terminal-input');

// Command history
let history = [];
let historyIndex = -1;

// Score for guess game
let score = 0;

// Simulated file system
const fileSystem = {
    'readme.txt': 'Welcome to the DevClub terminal!\nThis is a simulated file system.',
    'resume.pdf': 'Not available in simulation mode.',
    'projects/': ['website', 'app', 'scripts']
};

// Available commands
const commands = {
    // Basic commands
    help: () => 'Available commands: ' + Object.keys(commands).join(', '),
    clear: () => {
        terminal.innerHTML = '';
        // Re-add the welcome messages after clear
        addOutput('Welcome to Student Dev Club Terminal v1.0');
        addOutput("Type 'help' for available commands.");
        // Don't create a new prompt here - it will be created when processing the command
        return '';
    },
    echo: (args) => args,
    date: () => new Date().toString(),
    whoami: async () => {
        const infoLines = [
            `👤 User: student@devclub`,
            `🌐 Network:`,
            `  - IP: ${await getIP()}`,
            `  - Connection: ${getConnectionType()}`,
            `🖥️ System:`,
            `  - OS: ${getOSName()} (${navigator.platform})`,
            `  - CPU Cores: ${navigator.hardwareConcurrency || 'Unknown'}`,
            `  - Memory: ${navigator.deviceMemory || 'Unknown'}GB`,
            `🌍 Browser:`,
            `  - ${getBrowserName()} v${getBrowserVersion()}`,
            `  - Cookies: ${navigator.cookieEnabled ? 'Enabled' : 'Disabled'}`,
            `📱 Display:`,
            `  - Resolution: ${window.screen.width}x${window.screen.height}`,
            `  - Color Depth: ${window.screen.colorDepth}bit`,
            `⏰ Time:`,
            `  - Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
            `  - Local Time: ${new Date().toLocaleString()}`,
            `🚀 Cool Tech:`,
            `  - WebGL: ${detectWebGL()}`,
            `  - WebAssembly: ${'WebAssembly' in window ? 'Supported' : 'Not Supported'}`
        ];

        // Print lines one by one with delay
        await printLinesWithDelay(infoLines);
        return null; // We're handling output in printLinesWithDelay
    },
    // System info commands
    uname: () => navigator.userAgent,
    memory: () => `Total memory: ${navigator.deviceMemory || 'Unknown'} GB`,
    battery: async () => {
        if ('getBattery' in navigator) {
            const battery = await navigator.getBattery();
            return `Battery: ${Math.floor(battery.level * 100)}% (${battery.charging ? 'Charging' : 'Not charging'})`;
        }
        return "Battery API not supported";
    },

    // Fun commands
    joke: async () => {
        try {
            const res = await fetch('https://v2.jokeapi.dev/joke/Any?format=txt');
            return await res.text();
        } catch {
            return "Failed to fetch joke :(";
        }
    },
    quote: async () => {
        try {
            const res = await fetch('https://api.quotable.io/random');
            const data = await res.json();
            return `"${data.content}" - ${data.author}`;
        } catch {
            return "Failed to fetch quote :(";
        }
    },
    cowsay: (args) => {
        const text = args || "Moo!";
        return `
        ${' '.repeat(3)}${'_'.repeat(text.length + 2)}
        < ${text} >
        ${' '.repeat(3)}${'-'.repeat(text.length + 2)}
               \\   ^__^
                \\  (oo)\\_______
                   (__)\\       )\\/\\
                       ||----w |
                       ||     ||
        `;
    },

    // Calculator
    calc: (args) => {
        try {
            return `${args} = ${eval(args)}`;
        } catch {
            return "Invalid expression";
        }
    },

    // File system commands
    ls: () => Object.keys(fileSystem).join('  '),
    cat: (args) => fileSystem[args] || `File not found: ${args}`,
    mkdir: (args) => {
        if (!args) return "Usage: mkdir <dirname>";
        fileSystem[args + '/'] = [];
        return `Created directory: ${args}`;
    },

    // Network commands
    ping: async (args) => {
        if (!args) return "Usage: ping <url>";
        try {
            const start = performance.now();
            await fetch(`https://${args}`, { method: 'HEAD' });
            const time = Math.round(performance.now() - start);
            return `Ping to ${args}: ${time}ms`;
        } catch {
            return `Could not ping ${args}`;
        }
    },
    curl: async (args) => {
        if (!args) return "Usage: curl <url>";
        try {
            const res = await fetch(`https://${args}`);
            return await res.text();
        } catch {
            return `Could not fetch ${args}`;
        }
    },

    // Game commands
    guess: (args) => {
        const num = Math.floor(Math.random() * 10) + 1;
        if (parseInt(args) === num) {
            score++;
            return `Correct! The number was ${num}. Score: ${score}`;
        }
        return `Wrong! The number was ${num}. Score: ${score}`;
    },
    score: () => `Your current score: ${score}`
};

async function printLinesWithDelay(lines) {
    for (const line of lines) {
        addOutput(line);
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
    }
}

function addOutput(text) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.textContent = text;
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
}

// Create new prompt line
function createPrompt() {
    const promptLine = document.createElement('div');
    promptLine.className = 'terminal_promt';
    promptLine.innerHTML = `
        <span class="terminal_user">student@devclub:</span>
        <span class="terminal_location">~</span>
        <span class="terminal_bling">$</span>
        <input type="text" id="terminal-input" autofocus>
    `;
    return promptLine;
}

// Handle command execution
async function executeCommand(cmdString) {
    const args = cmdString.trim().split(' ');
    const cmd = args.shift().toLowerCase();
    
    if (cmd === '') return null;
    
    if (commands.hasOwnProperty(cmd)) {
        const result = await commands[cmd](args.join(' '));
        return result; // May be null if command handles its own output
    } else {
        addOutput(`Command not found: ${cmd}`);
        return null;
    }
}

async function getIP() {
    try {
        // Try multiple endpoints (fallback chain)
        const endpoints = [
            'https://api.ipify.org?format=json',
            'https://ipinfo.io/json',
            'https://ipecho.net/plain'
        ];
        
        for (const endpoint of endpoints) {
            try {
                const response = await fetch(endpoint);
                const data = await response.json();
                return data.ip || (typeof data === 'string' ? data : 'Unknown');
            } catch {
                continue;
            }
        }
        return 'Could not detect (try in production)';
    } catch {
        return 'Unknown';
    }
}

function getConnectionType() {
    if (navigator.connection) {
        return navigator.connection.effectiveType || 'Unknown';
    }
    return 'Unknown';
}

function getOSName() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Windows")) return "Windows";
    if (userAgent.includes("Mac")) return "MacOS";
    if (userAgent.includes("Linux")) return "Linux";
    if (userAgent.includes("Android")) return "Android";
    if (userAgent.includes("iOS")) return "iOS";
    return "Unknown OS";
}

function getBrowserName() {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("SamsungBrowser")) return "Samsung Browser";
    if (userAgent.includes("Opera") || userAgent.includes("OPR")) return "Opera";
    if (userAgent.includes("Trident")) return "Internet Explorer";
    if (userAgent.includes("Edge")) return "Edge";
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Safari")) return "Safari";
    return "Unknown Browser";
}

function getBrowserVersion() {
    const ua = navigator.userAgent;
    const tem = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    return tem[2] || 'Unknown';
}

function detectWebGL() {
    try {
        const canvas = document.createElement('canvas');
        return !!window.WebGLRenderingContext && 
              (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
        return 'Not Supported';
    }
}

// Handle input
document.addEventListener('click', () => {
    const currentInput = document.getElementById('terminal-input');
    if (currentInput) {
        currentInput.focus();
    }
});

document.addEventListener('keydown', async (e) => {
    const currentInput = document.getElementById('terminal-input');
    if (!currentInput) return;

    if (e.key === 'Enter') {
        const cmdString = currentInput.value;
        
        // Skip empty commands
        if (cmdString.trim() === '') return;
        
        // Add command to history
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.textContent = `student@devclub:~$ ${cmdString}`;
        terminal.appendChild(commandLine);

        // Execute command and show output
        const result = await executeCommand(cmdString);
        if (result !== null) {
            addOutput(result);
        }

        // Add to history
        history.push(cmdString);
        historyIndex = history.length;

        // Remove old prompt
        currentInput.parentElement.remove();

        // Add new prompt
        terminal.appendChild(createPrompt());
        document.getElementById('terminal-input').focus();
    }
    // Command history navigation
    else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            currentInput.value = history[historyIndex];
        }
    }
    else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
            historyIndex++;
            currentInput.value = history[historyIndex];
        } else {
            historyIndex = history.length;
            currentInput.value = '';
        }
    }
});

// Don't create a new prompt on initialization since it's already in the HTML
// Just focus the existing input
document.getElementById('terminal-input').focus();