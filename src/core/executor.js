import shell from "shelljs";
import chalk from "chalk";

/**
 * Executes a shell command and handles logging and errors.
 * @param {string} command - The shell command to run.
 */
export function executeCommand(command) {
  const orange = chalk.hex("#F97316");
  console.log(orange("\n🚀 Executing...\n"));

  try {
    const shellResult = shell.exec(command);

    if (shellResult.code !== 0) {
      console.error(
        chalk.red(`\n✖ Command failed with exit code: ${shellResult.code}`),
      );
      return {
        success: false,
        code: shellResult.code,
        stderr: shellResult.stderr,
      };
    }

    return { success: true, code: 0, stdout: shellResult.stdout };
  } catch (error) {
    console.error(chalk.red(`\n✖ Execution error: ${error.message}`));
    return { success: false, error: error.message, stderr: error.message };
  }
}
