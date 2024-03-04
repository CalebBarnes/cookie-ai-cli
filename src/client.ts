import { Interface, createInterface } from "readline";

// Assuming colors utility is defined elsewhere and imported
// If not, you can define a simple version here for demonstration
const colors = {
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
  red: "\x1b[31m",
};

export class Client {
  private _rl: Interface;

  constructor() {
    this._rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  // Getter for the readline interface
  get rl(): Interface {
    return this._rl;
  }

  // Setter allows replacing the readline interface
  set rl(newRl: Interface) {
    this._rl = newRl;
  }

  // Method to close the readline interface
  public closeRl(): void {
    this._rl.close();
  }

  // Integrated askQuestion method
  public askQuestion(query: string, options: string[] = []): Promise<string> {
    return new Promise((resolve) => {
      let fullQuery = `${colors.cyan}${query}${colors.reset}`;
      if (options.length > 0) {
        fullQuery += "\n";
        options.forEach((option, index) => {
          fullQuery += `${index + 1}. ${option}\n`;
        });
        fullQuery += `Enter your choice (1-${options.length}): `;
      } else {
        fullQuery += " ";
      }

      this._rl.question(fullQuery, (answer) => {
        if (options.length > 0) {
          const choice = parseInt(answer, 10);
          // Validate the choice
          if (!isNaN(choice) && choice >= 1 && choice <= options.length) {
            resolve(options[choice - 1]);
          } else {
            console.log(
              `${colors.red}Invalid choice, please try again.${colors.reset}`
            );
            // Recursively ask again by resolving the promise with a recursive call
            resolve(this.askQuestion(query, options));
          }
        } else {
          resolve(answer);
        }
      });
    });
  }
}
