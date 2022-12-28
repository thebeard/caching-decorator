const consoleLogHistory: string[] = [],
  consoleDebugHistory: string[] = [],
  { debug, log } = console;

console.log = function (logMessage) {
  consoleLogHistory.push(logMessage);
  log(logMessage);
};

console.debug = function (logMessage) {
  consoleDebugHistory.push(logMessage);
  debug(logMessage);
};

export function getLogHistory(): [string[], string[]] {
  return [consoleDebugHistory, consoleLogHistory];
}

export function clearLogHistory(): void {
  while (consoleDebugHistory.length) {
    consoleDebugHistory.shift();
  }

  while (consoleLogHistory.length) {
    consoleLogHistory.shift();
  }
}
