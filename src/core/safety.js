import chalk from "chalk";
import inquirer from "inquirer";
import config from "./config.js";

/**
 * Analyzes the risk of a command and handles verification if necessary.
 * @param {Object} aiResult - The result from the AI (command, riskScore, riskAnalysis)
 * @returns {Promise<boolean>} - True if safe to proceed, false otherwise
 */
/**
 * Logic-only check for high risk.
 */
export function isCommandHighRisk(riskScore) {
  const safetyEnabled = config.get("safetyMode");
  return riskScore >= 8 && safetyEnabled;
}

export async function verifyCommandSafety(aiResult) {
  const isHighRisk = isCommandHighRisk(aiResult.riskScore);

  if (!isHighRisk) {
    const confirm = await inquirer.prompt([
      {
        type: "confirm",
        name: "execute",
        message: "Run this command?",
        default: false,
      },
    ]);
    return confirm.execute;
  }

  // High-Risk Protocol
  console.log(
    chalk.red.bold(`\n 🔥 HIGH RISK DETECTED (${aiResult.riskScore}/10)`),
  );
  console.log(
    chalk.red(
      ` This command is potentially destructive. To proceed, you MUST type ${chalk.white.bold(
        "YES",
      )} in all caps.`,
    ),
  );

  const confirm = await inquirer.prompt([
    {
      type: "input",
      name: "verification",
      message: chalk.red("Verification:"),
    },
  ]);

  if (confirm.verification === "YES") {
    return true;
  }

  console.log(chalk.gray("\n✖ Execution blocked (incorrect verification)."));
  return false;
}
