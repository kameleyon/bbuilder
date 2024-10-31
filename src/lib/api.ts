import { useWebContainerStore } from './stores/webcontainer';

const API_URL = import.meta.env.VITE_API_URL;

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  return response.json();
}

export async function executeInWebContainer(command: string, args: string[] = []): Promise<string> {
  const { instance } = useWebContainerStore.getState();
  if (!instance) {
    throw new Error('WebContainer not initialized');
  }

  const process = await instance.spawn(command, args);
  let output = '';

  process.output.pipeTo(
    new WritableStream({
      write(data) {
        output += data;
      },
    })
  );

  const exitCode = await process.exit;
  if (exitCode !== 0) {
    throw new Error(`Command failed with exit code ${exitCode}`);
  }

  return output;
}

export async function enhancePrompt(prompt: string): Promise<ApiResponse<string>> {
  try {
    const response = await fetch(`${API_URL}/api/enhancer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to enhance prompt',
    };
  }
}

export async function sendChatMessage(message: string): Promise<ApiResponse<string>> {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    return handleResponse(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message',
    };
  }
}
