const terminal = document.getElementById('terminal');
        const input = document.getElementById('terminal-input');
        
        // Command history
        let history = [];
        let historyIndex = -1;

        // Available commands
        const commands = {
            help: () => 'Available commands: help, clear, echo, date, whoami, projects, events',
            clear: () => {
                terminal.innerHTML = '';
                return '';
            },
            echo: (args) => args,
            date: () => new Date().toString(),
            whoami: () => 'student@devclub',
            projects: () => 'Current projects:\n- Web Development\n- Mobile App\n- Machine Learning',
            events: () => 'Upcoming events:\n- Coding Workshop (Next Friday)\n- Hackathon (Next Month)\n- Tech Talk (TBA)'
        };

        // Create new prompt line
        function createPrompt() {
            const promptLine = document.createElement('div');
            promptLine.className = 'terminal_promt';
            promptLine.innerHTML = `
                <span class="terminal_user">student@devclub:</span>
                <span class="terminal_location">~</span>
                <span class="terminal_bling">$</span>
                <input type="text" id="terminal-input" autofocus>
                <span class="terminal_cursor"></span>
            `;
            return promptLine;
        }

        // Add output to terminal
        function addOutput(text) {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.textContent = text;
            terminal.appendChild(line);
            terminal.scrollTop = terminal.scrollHeight;
        }

        // Handle command execution
        function executeCommand(cmdString) {
            const args = cmdString.trim().split(' ');
            const cmd = args.shift().toLowerCase();
            
            if (cmd === '') return null;
            
            if (commands.hasOwnProperty(cmd)) {
                return commands[cmd](args.join(' '));
            } else {
                return `Command not found: ${cmd}`;
            }
        }

        // Handle input
        document.addEventListener('click', () => {
            const currentInput = document.getElementById('terminal-input');
            if (currentInput) {
                currentInput.focus();
            }
        });

        document.addEventListener('keydown', (e) => {
            const currentInput = document.getElementById('terminal-input');
            if (!currentInput) return;

            if (e.key === 'Enter') {
                const cmdString = currentInput.value;
                
                // Add command to history
                const commandLine = document.createElement('div');
                commandLine.className = 'terminal-line';
                commandLine.textContent = `student@devclub:~$ ${cmdString}`;
                terminal.appendChild(commandLine);

                // Execute command and show output
                const result = executeCommand(cmdString);
                if (result) {
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