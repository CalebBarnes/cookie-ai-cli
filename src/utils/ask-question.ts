import readline from "node:readline";
import { colors } from "./colors.js";
import { logger } from "./logger.js";

export function askQuestion(
  query: string,
  options?: string[]
): Promise<string> {
  return new Promise((resolve) => {
    let fullQuery = `${colors.cyan}${query}${colors.reset}`;
    if (Array.isArray(options) && options.length > 0) {
      fullQuery += "\n";
      options.forEach((option, index) => {
        fullQuery += `${index + 1}. ${option}\n`;
      });
      fullQuery += `Enter your choice (1-${options.length}): `;
    } else {
      fullQuery += " ";
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(fullQuery, (answer) => {
      if (Array.isArray(options) && options.length > 0) {
        const choice = parseInt(answer, 10);
        if (!isNaN(choice) && choice >= 1 && choice <= options.length) {
          resolve(options[choice - 1]!);
        } else {
          logger.error(
            `${colors.red}Invalid choice, please try again.${colors.reset}`
          );
          rl.close();
          resolve(askQuestion(query, options));
        }
      } else {
        rl.close();
        resolve(answer);
      }
    });
  });
}
