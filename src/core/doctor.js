import chalk from "chalk";
import ora from "ora";
import config from "./config.js";
import { GoogleGenAI } from "@google/genai";
import dns from "dns";

const orange = chalk.hex("#F97316");

export async function runDoctor() {
  console.log(orange("\n🩺 Terminally Health Check\n"));

  const spinner = ora("Checking environment...").start();
  let issues = 0;

  // 1. Check Node Version
  const nodeVersion = process.versions.node;
  const majorVersion = parseInt(nodeVersion.split(".")[0]);
  if (majorVersion < 18) {
    spinner.fail(
      chalk.red(`Node.js version is ${nodeVersion}. Minimum required is v18.`),
    );
    issues++;
  } else {
    spinner.succeed(chalk.green(`Node.js version is ${nodeVersion}.`));
  }

  // 2. Check Internet Connectivity
  spinner.start("Checking internet connection...");
  const hasInternet = await new Promise((resolve) => {
    dns.lookup("google.com", (err) => resolve(!err));
  });

  if (!hasInternet) {
    spinner.fail(
      chalk.red("No internet connection detected. AI features will not work."),
    );
    issues++;
  } else {
    spinner.succeed(chalk.green("Internet connection is active."));
  }

  // 3. Check API Key
  spinner.start("Verifying API Key...");
  const apiKey = config.get("apiKey") || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    spinner.fail(
      chalk.red(
        "GEMINI_API_KEY is not set. Run 'terminally config' to set it.",
      ),
    );
    issues++;
  } else {
    spinner.succeed(chalk.green("API Key is configured."));

    // 4. Validate AI Client
    try {
      new GoogleGenAI({ apiKey });
      spinner.succeed(chalk.green("AI engine is initialized."));
    } catch (error) {
      spinner.fail(chalk.red(`AI initialization failed: ${error.message}`));
      issues++;
    }
  }

  console.log("\n" + "─".repeat(40));
  if (issues === 0) {
    console.log(
      chalk.green.bold(
        "\n✨ All systems nominal! Terminally is ready for action.",
      ),
    );
  } else {
    console.log(
      chalk.yellow.bold(
        `\n⚠️ Found ${issues} issue(s). Please fix them to ensure best performance.`,
      ),
    );
  }
}
