import { Interface } from "readline";
import { colors } from "./utils/colors";
import readline from "readline";

export function askQuestion(
  query: string,
  options?: string[]
  // rl?: Interface
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
        // Check if the choice is a valid number within the options range
        if (!isNaN(choice) && choice >= 1 && choice <= options.length) {
          resolve(options[choice - 1]);
        } else {
          console.log(
            `${colors.red}Invalid choice, please try again.${colors.reset}`
          );
          rl.close();
          resolve(askQuestion(query, options)); // Recursively ask again
        }
      } else {
        // For a simple query, directly resolve the answer
        rl.close();
        resolve(answer);
      }
    });
  });
}
