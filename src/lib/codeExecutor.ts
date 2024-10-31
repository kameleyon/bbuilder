interface ExecutionResult {
  output: string;
  error?: string;
}

export async function executeCode(code: string): Promise<ExecutionResult> {
  try {
    // Create a safe execution context
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    
    // Capture console output
    let output: string[] = [];
    const virtualConsole = {
      log: (...args: any[]) => {
        output.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      },
      error: (...args: any[]) => {
        output.push(`Error: ${args.join(' ')}`);
      },
      warn: (...args: any[]) => {
        output.push(`Warning: ${args.join(' ')}`);
      }
    };

    // Wrap code in try-catch and add console capture
    const wrappedCode = `
      const console = ${JSON.stringify(virtualConsole)};
      try {
        ${code}
      } catch (e) {
        console.error(e.message);
      }
    `;

    const executor = new AsyncFunction(wrappedCode);
    await executor();

    return {
      output: output.join('\n')
    };
  } catch (error) {
    return {
      output: '',
      error: `Error executing code: ${error.message}`
    };
  }
}