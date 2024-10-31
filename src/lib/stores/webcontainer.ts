import { create } from 'zustand';
import { WebContainer } from '@webcontainer/api';
import { setupDevEnvironment } from '../webcontainer/setup';

interface WebContainerState {
  instance: WebContainer | null;
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  setInstance: (instance: WebContainer) => void;
  setReady: (ready: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initializeWebContainer: () => Promise<WebContainer>;
}

export const useWebContainerStore = create<WebContainerState>((set, get) => ({
  instance: null,
  isReady: false,
  isLoading: false,
  error: null,
  
  setInstance: (instance) => set({ instance }),
  setReady: (ready) => set({ isReady: ready }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  initializeWebContainer: async () => {
    const store = get();
    if (store.instance) return store.instance;

    try {
      set({ isLoading: true, error: null });
      console.log('Starting WebContainer initialization...');

      // Boot WebContainer
      console.log('Booting WebContainer...');
      const instance = await WebContainer.boot();
      console.log('WebContainer booted successfully');
      
      // Set instance first
      set({ instance });

      // Set up development environment
      console.log('Setting up development environment...');
      await setupDevEnvironment(instance);
      console.log('Development environment setup complete');

      // Mark as ready only after setup is complete
      set({ isReady: true });
      console.log('WebContainer initialization complete');

      return instance;
    } catch (error) {
      console.error('WebContainer initialization failed:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to initialize development environment';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
