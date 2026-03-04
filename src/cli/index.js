#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import config from "../core/config.js";
import inquirer from "inquirer";
import { getCommandFromAI, diagnoseErrorFromAI } from "../ai/gemini.js";
import ora from "ora";
import boxen from "boxen";
import { verifyCommandSafety } from "../core/safety.js";
import { executeCommand } from "../core/executor.js";
import { runDoctor } from "../core/doctor.js";

const orange = chalk.hex("#F97316");
const gray = chalk.gray;

const program = new Command();

program
  .name("terminally")
  .description("AI-Powered Intelligent Terminal Assistant")
  .version("1.0.0")
  .option("-s, --simulate", "Enable simulation mode (dry-run)");

const runConfig = async () => {
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
};

// Configuration Command (Preferences only)
program
  .command("config")
  .description("Manage your Terminally preferences")
  .action(runConfig);

// Doctor Command
program
  .command("doctor")
  .description("Perform a system and configuration health check")
  .action(async () => {
    await runDoctor();
  });

const queryHistory = [];
let simulateMode = false;
let lastResult = null;

const processQuery = async (fullQuery, overrideExplanation = null) => {
  const spinner = ora(gray("Asking Gemini...")).start();

  try {
    const result = await getCommandFromAI(fullQuery);
    spinner.stop();
    lastResult = result;

    // Add to history only on success
    queryHistory.push({ prompt: fullQuery, command: result.command });

    const showExplanation =
      overrideExplanation !== null
        ? overrideExplanation
        : config.get("explanationMode");

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

    if (simulateMode) {
      output += `\n\n${chalk.cyan.bold("🧪 SIMULATION (Visual Dry-Run)")}\n`;
      if (result.simulation?.fileCount)
        output += `${chalk.cyan("• File Count:")} ${result.simulation.fileCount}\n`;
      if (result.simulation?.spaceImpact)
        output += `${chalk.cyan("• Space Impact:")} ${result.simulation.spaceImpact}\n`;
      if (result.simulation?.processes)
        output += `${chalk.cyan("• Processes:")} ${result.simulation.processes}\n`;
      if (result.simulation?.git)
        output += `${chalk.cyan("• Git:")} ${result.simulation.git}\n`;

      output += `\n${chalk.cyan.italic("Command will be simulated, no actual changes will be made.")}`;
    }

    console.log(
      boxen(output, {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: simulateMode ? "#22d3ee" : "#F97316",
        title: orange(" Terminally Suggestion "),
        titleAlignment: "center",
      }),
    );

    // If simulation mode, we don't execute
    if (simulateMode) {
      console.log(
        chalk.cyan(
          "\n[SIMULATION] Result: Command appears valid and safe for target environment.",
        ),
      );
      return;
    }

    // Verify Safety using the Safety Module
    const shouldExecute = await verifyCommandSafety(result);

    if (shouldExecute) {
      const execResult = await executeCommand(result.command);

      if (!execResult.success && execResult.stderr) {
        console.log(
          chalk.yellow(
            "\n💡 Command failed. Would you like Terminally to diagnose the error?",
          ),
        );
        const { diagnose } = await inquirer.prompt([
          {
            type: "confirm",
            name: "diagnose",
            message: "Run Smart Diagnosis?",
            default: true,
          },
        ]);

        if (diagnose) {
          const diagnosisSpinner = ora(gray("Diagnosing error...")).start();
          try {
            const fix = await diagnoseErrorFromAI(
              result.command,
              execResult.stderr,
            );
            diagnosisSpinner.stop();

            console.log(
              boxen(
                `${chalk.green.bold(fix.command)}\n\n${chalk.white.bold("🔧 FIX ANALYSIS")}\n${fix.explanation}`,
                {
                  padding: 1,
                  margin: 1,
                  borderColor: "#F97316",
                  title: orange(" AI Diagnosis & Fix "),
                },
              ),
            );

            const { runFix } = await inquirer.prompt([
              {
                type: "confirm",
                name: "runFix",
                message: "Execute this fix?",
                default: true,
              },
            ]);

            if (runFix) {
              await executeCommand(fix.command);
            }
          } catch (err) {
            diagnosisSpinner.fail(
              chalk.red("Diagnosis failed: " + err.message),
            );
          }
        }
      }
    } else {
      console.log(chalk.gray("\n✖ Execution cancelled."));
    }
  } catch (error) {
    spinner.fail(chalk.red(" Error: " + error.message));
  }
};

const showHelp = () => {
  const helpText = `
${orange.bold("Terminally Special Commands:")}
  ${chalk.white.bold("/help")}     — Show all commands
  ${chalk.white.bold("/history")}  — View recent prompts and commands
  ${chalk.white.bold("/config")}   — Open the configuration dashboard
  ${chalk.white.bold("/doctor")}   — Run environment health check
  ${chalk.white.bold("/simulate")} — Toggle Dry-Run mode
  ${chalk.white.bold("/explain")}  — Show explanation for last command
  ${chalk.white.bold("/exit")}     — Return to your shell
  `;
  console.log(
    boxen(helpText, { padding: 1, borderColor: "gray", borderStyle: "round" }),
  );
};

const showHistory = () => {
  if (queryHistory.length === 0) {
    console.log(chalk.gray("\nHistory is empty. Ask something first!"));
    return;
  }

  console.log(orange.bold("\n📜 Command History:"));
  queryHistory.forEach((item, i) => {
    console.log(
      `${chalk.gray(i + 1 + ".")} ${chalk.white(item.prompt)} ${chalk.gray("→")} ${chalk.green(item.command)}`,
    );
  });
};

const startInteractiveMode = async () => {
  console.log(orange("\n🤖 Welcome to Terminally Interactive Mode."));
  console.log(chalk.gray("Type your request or use '/help' for options.\n"));

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

    const lowerQuery = trimmedQuery.toLowerCase();

    // Slash Commands Handling
    if (trimmedQuery.startsWith("/")) {
      if (lowerQuery === "/exit") {
        console.log(orange("\n👋 See you soon!"));
        break;
      }

      if (lowerQuery === "/help") {
        showHelp();
        continue;
      }

      if (lowerQuery === "/history") {
        showHistory();
        continue;
      }

      if (lowerQuery === "/config") {
        await runConfig();
        continue;
      }

      if (lowerQuery === "/doctor") {
        await runDoctor();
        continue;
      }

      if (lowerQuery === "/simulate") {
        simulateMode = !simulateMode;
        console.log(
          simulateMode
            ? chalk.cyan("\n🧪 Simulation Mode Enabled.")
            : chalk.gray("\n🧪 Simulation Mode Disabled."),
        );
        continue;
      }

      if (lowerQuery === "/explain") {
        if (!lastResult) {
          console.log(
            chalk.gray(
              "\nNo command suggested yet. Try asking for something first.",
            ),
          );
        } else {
          const explText = `\n${chalk.white.bold("📝 DEEP DIVE EXPLANATION")}\n${chalk.whiteBright(lastResult.explanation)}`;
          console.log(
            boxen(explText, {
              padding: 1,
              borderColor: "white",
              borderStyle: "double",
            }),
          );
        }
        continue;
      }

      // Final catch-all for unknown slash commands
      console.log(
        chalk.red(
          `\n✖ Unknown command: ${trimmedQuery}. Type /help for options.`,
        ),
      );
      continue;
    }

    // Support plain exit
    if (lowerQuery === "exit" || lowerQuery === "quit") {
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
  .action(async (query, options) => {
    if (options.simulate) simulateMode = true;

    if (!query || query.length === 0) {
      await startInteractiveMode();
    } else {
      const fullQuery = query.join(" ");
      await processQuery(fullQuery);
    }
  });

program.parse(process.argv);
