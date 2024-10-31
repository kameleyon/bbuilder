import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { useWebContainerStore } from '../../../lib/stores/webcontainer';
import 'xterm/css/xterm.css';

export const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const { instance } = useWebContainerStore();

  useEffect(() => {
    if (!terminalRef.current || !instance) return;

    // Initialize xterm.js
    const terminal = new XTerm({
      cursorBlink: true,
      theme: {
        background: '#1a1b26',
        foreground: '#c0caf5',
        cursor: '#c0caf5',
        black: '#32344a',
        red: '#f7768e',
        green: '#9ece6a',
        yellow: '#e0af68',
        blue: '#7aa2f7',
        magenta: '#ad8ee6',
        cyan: '#449dab',
        white: '#787c99',
        brightBlack: '#444b6a',
        brightRed: '#ff7a93',
        brightGreen: '#b9f27c',
        brightYellow: '#ff9e64',
        brightBlue: '#7da6ff',
        brightMagenta: '#bb9af7',
        brightCyan: '#0db9d7',
        brightWhite: '#acb0d0',
      },
      fontFamily: '"Fira Code", monospace',
      fontSize: 14,
      lineHeight: 1.2,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    terminal.loadAddon(fitAddon);
    terminal.loadAddon(webLinksAddon);

    terminal.open(terminalRef.current);
    fitAddon.fit();

    // Write welcome message
    terminal.writeln('\x1b[1;34mBuddyBuilder Terminal\x1b[0m');
    terminal.writeln('\x1b[90m-------------------\x1b[0m');
    terminal.writeln('');

    // Create a shell process
    const startShell = async () => {
      try {
        const shellProcess = await instance.spawn('bash', {
          terminal: {
            cols: terminal.cols,
            rows: terminal.rows,
          },
        });

        // Create a buffer for collecting output
        let outputBuffer = '';

        // Handle shell output
        const processOutput = async () => {
          const reader = shellProcess.output.getReader();
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              outputBuffer += value;
              terminal.write(value);
            }
          } catch (error) {
            console.error('Error reading output:', error);
          } finally {
            reader.releaseLock();
          }
        };

        // Start processing output
        processOutput();

        // Handle terminal input
        terminal.onData((data) => {
          // Convert input to Uint8Array
          const encoder = new TextEncoder();
          const uint8Array = encoder.encode(data);
          
          // Create a new writer for each input
          const writer = shellProcess.input.getWriter();
          try {
            writer.write(uint8Array);
          } finally {
            writer.releaseLock();
          }
        });

        // Handle terminal resize
        terminal.onResize(({ cols, rows }) => {
          shellProcess.resize({
            cols,
            rows,
          });
        });

      } catch (error) {
        console.error('Failed to start shell:', error);
        terminal.writeln('\x1b[1;31mFailed to start shell. Please try again.\x1b[0m');
      }
    };

    startShell();
    xtermRef.current = terminal;

    // Handle window resize
    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      terminal.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [instance]);

  return (
    <div className="h-full bg-gray-900">
      <div className="p-2 border-b border-gray-700 flex items-center justify-between">
        <span>Terminal</span>
      </div>
      <div ref={terminalRef} className="h-[calc(100%-2.5rem)]" />
    </div>
  );
};
