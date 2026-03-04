#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import config from "../core/config.js";
import inquirer from "inquirer";
import { getCommandFromAI } from "../ai/gemini.js";
import ora from "ora";
import boxen from "boxen";
import { verifyCommandSafety } from "../core/safety.js";
import { executeCommand } from "../core/executor.js";

const orange = chalk.hex("#F97316");
const gray = chalk.gray;

const program = new Command();

program
  .name("terminally")
  .description("AI-Powered Intelligent Terminal Assistant")
  .version("1.0.0");

// Configuration Command (Preferences only)
program
  .command("config")
  .description("Manage your Terminally preferences")
  .action(async () => {
    const questions = [
      {
        type: "input",
        name: "apiKey",
        message: "Enter your Gemini API Key (leave empty to keep current):",
        default: config.get("apiKey"),
      },
      {
        type: "confirm",
        name: "safetyMode",
        message: "Enable Safety Mode? (Blocks high-risk commands)",
        default: config.get("safetyMode"),
      },
      {
        type: "confirm",
        name: "explanationMode",
        message: "Show detailed explanations?",
        default: config.get("explanationMode"),
      },
    ];

    const answers = await inquirer.prompt(questions);
    if (answers.apiKey) config.set("apiKey", answers.apiKey);
    config.set("safetyMode", answers.safetyMode);
    config.set("explanationMode", answers.explanationMode);
    console.log(chalk.green("\n✔ Preferences saved successfully!"));
  });

const processQuery = async (fullQuery) => {
  const spinner = ora(gray("Asking Gemini...")).start();

  try {
    const result = await getCommandFromAI(fullQuery);
    spinner.stop();

    const showExplanation = config.get("explanationMode");

    // UI Box for AI response
    let output = `${chalk.green.bold(result.command)}\n`;

    if (showExplanation) {
      output += `\n${chalk.white.bold("📝 EXPLANATION")}\n${chalk.whiteBright(result.explanation)}\n`;
    }

    const getRiskColor = (score) => {
      if (score >= 8) return chalk.red.bold;
      if (score >= 4) return orange.bold;
      return chalk.green.bold;
    };

    output += `\n${chalk.white.bold("🛡️ SAFETY ANALYSIS")}\nRisk Score: ${getRiskColor(result.riskScore)(result.riskScore + "/10")}\n${chalk.whiteBright.italic(result.riskAnalysis)}`;

    console.log(
      boxen(output, {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "#F97316",
        title: orange(" Terminally Suggestion "),
        titleAlignment: "center",
      }),
    );

    // Verify Safety using the Safety Module
    const shouldExecute = await verifyCommandSafety(result);

    if (shouldExecute) {
      executeCommand(result.command);
    } else {
      console.log(chalk.gray("\n✖ Execution cancelled."));
    }
  } catch (error) {
    spinner.fail(chalk.red(" Error: " + error.message));
  }
};

const startInteractiveMode = async () => {
  console.log(orange("\n🤖 Welcome to Terminally Interactive Mode."));
  console.log(chalk.gray("Type your request or 'exit' to quit.\n"));

  while (true) {
    const { query } = await inquirer.prompt([
      {
        type: "input",
        name: "query",
        message: orange(">"),
        prefix: "",
      },
    ]);

    const trimmedQuery = query.trim();

    if (!trimmedQuery) continue;
    if (["exit", "/exit", "quit", ":q"].includes(trimmedQuery.toLowerCase())) {
      console.log(orange("\n👋 See you soon!"));
      break;
    }

    await processQuery(trimmedQuery);
    console.log("\n"); // Add spacing between turns
  }
};

// Main Action
program
  .argument("[query...]", "Natural language query for the assistant")
  .action(async (query) => {
    if (!query || query.length === 0) {
      await startInteractiveMode();
    } else {
      const fullQuery = query.join(" ");
      await processQuery(fullQuery);
    }
  });

program.parse(process.argv);
