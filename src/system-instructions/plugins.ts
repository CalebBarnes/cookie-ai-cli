import { userSystemInfoPlugin } from "./user-system-info-instructions.js";
import { type Plugin } from "./plugin-types.js";

export const loadedPlugins: Plugin[] = [userSystemInfoPlugin];

// import { nextjsInstructionsPlugin } from "./nextjs-instructions.js";

// export const availablePlugins: Plugin[] = [
//   userSystemInfoPlugin,
//   nextjsInstructionsPlugin,
// ];

// export function loadPlugin(name: string): Plugin[] | undefined {
//   if (loadedPlugins.find((plugin) => plugin.name === name)) {
//     logger.debug(`Plugin "${name}" already loaded`);
//     return;
//   }
//   const selectedPlugin = availablePlugins.find(
//     (plugin) => plugin.name === name
//   );
//   if (!selectedPlugin) {
//     logger.error(`Plugin "${name}" not found`);
//     return;
//   }
//   loadedPlugins.push(selectedPlugin);
//   return loadedPlugins;
// }
