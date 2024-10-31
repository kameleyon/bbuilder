import { create } from 'zustand';
import { useWebContainerStore } from './webcontainer';

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileNode[];
  content?: string;
}

interface FileSystemState {
  files: FileNode[];
  currentFile: string | null;
  setFiles: (files: FileNode[]) => void;
  setCurrentFile: (path: string | null) => void;
  createFile: (path: string, content: string) => Promise<void>;
  createDirectory: (path: string) => Promise<void>;
  updateFile: (path: string, content: string) => Promise<void>;
  deleteFile: (path: string) => Promise<void>;
  readFile: (path: string) => Promise<string>;
}

export const useFileSystemStore = create<FileSystemState>((set, get) => ({
  files: [],
  currentFile: null,
  setFiles: (files) => set({ files }),
  setCurrentFile: (path) => set({ currentFile: path }),

  createFile: async (path: string, content: string) => {
    const instance = useWebContainerStore.getState().instance;
    if (!instance) throw new Error('WebContainer not initialized');

    await instance.fs.writeFile(path, content);
    await updateFileTree(instance, get().setFiles);
  },

  createDirectory: async (path: string) => {
    const instance = useWebContainerStore.getState().instance;
    if (!instance) throw new Error('WebContainer not initialized');

    await instance.fs.mkdir(path);
    await updateFileTree(instance, get().setFiles);
  },

  updateFile: async (path: string, content: string) => {
    const instance = useWebContainerStore.getState().instance;
    if (!instance) throw new Error('WebContainer not initialized');

    await instance.fs.writeFile(path, content);
    await updateFileTree(instance, get().setFiles);
  },

  deleteFile: async (path: string) => {
    const instance = useWebContainerStore.getState().instance;
    if (!instance) throw new Error('WebContainer not initialized');

    await instance.fs.rm(path, { recursive: true });
    await updateFileTree(instance, get().setFiles);
  },

  readFile: async (path: string) => {
    const instance = useWebContainerStore.getState().instance;
    if (!instance) throw new Error('WebContainer not initialized');

    const file = await instance.fs.readFile(path, 'utf-8');
    return file;
  },
}));

async function updateFileTree(instance: any, setFiles: (files: FileNode[]) => void) {
  const buildFileTree = async (path: string = '/'): Promise<FileNode[]> => {
    const entries = await instance.fs.readdir(path, { withFileTypes: true });
    const nodes: FileNode[] = [];

    for (const entry of entries) {
      const fullPath = path === '/' ? `/${entry.name}` : `${path}/${entry.name}`;
      if (entry.isDirectory()) {
        nodes.push({
          name: entry.name,
          type: 'directory',
          path: fullPath,
          children: await buildFileTree(fullPath),
        });
      } else {
        nodes.push({
          name: entry.name,
          type: 'file',
          path: fullPath,
        });
      }
    }

    return nodes.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'directory' ? -1 : 1;
    });
  };

  const fileTree = await buildFileTree();
  setFiles(fileTree);
}
