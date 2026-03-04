# 🤖 Terminally

### AI-Powered Intelligent Terminal Assistant

**Terminally** is an AI-powered interactive terminal assistant that allows you to use natural language to generate, understand, and safely execute shell commands. Stop context-switching to the browser—just describe what you want, and Terminally handles the rest.

---

## 🚀 Quick Start

### 1. Install Globally

```bash
npm install -g terminally-ai
```

### 2. Configure your API Key

Terminally uses Google Gemini (Free Tier).

1. Get a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Run the config command:

```bash
terminally config
```

_Paste your key when prompted. This is saved locally on your machine._

### 3. Use it anywhere

```bash
terminally "create a new react project with vite"
# OR enter interactive mode
terminally
```

---

## 🛡️ Safety First Architecture

Unlike other CLI assistants, Terminally is built with a **Safety-First Protocol**:

- **Risk Analysis**: Every command is scanned for destructive patterns (like `rm -rf` or `sudo`).
- **Human-in-the-Loop**: No command ever executes without your explicit confirmation.
- **Double Verification**: High-risk commands (Risk Score 8+) require you to manually type **YES** in all caps to proceed.

---

## ✨ Key Features

- **NL → Command**: Describe tasks in plain English (e.g., "kill process on port 3000").
- **Interactive Mode**: A persistent REPL session for continuous shell assistance.
- **Educational Explanations**: Toggle "Explanation Mode" to learn what every flag and command does.
- **Context Awareness**: Automatically detects your OS, shell type, and project structure (Git, Node, Docker).
- **Customizable**: Use `terminally config` to toggle safety guards and explanation levels.

---

## 🏗️ Technical Architecture

Terminally is split into specialized modules for maximum safety and speed:

1. **Context Scanner**: Detects your environment (OS, Shell, Project files).
2. **AI Service**: Communicates with Gemini for intelligent command generation.
3. **Risk Engine**: Scans strings for dangerous flags and targets.
4. **Execution Layer**: Safely runs confirmed strings via your native shell.

---

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to get started with local development.

```bash
git clone https://github.com/devsultan06/terminally.git
cd terminally
npm install
npm link
```

---

## ⚖️ License

MIT © Terminally Team
