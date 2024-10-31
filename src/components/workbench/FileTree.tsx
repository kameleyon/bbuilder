import React, { useEffect, useState } from 'react';
import { FileNode, useFileSystemStore } from '../../lib/stores/files';
import { FolderIcon, FileIcon, ChevronDownIcon, ChevronRightIcon } from 'lucide-react';

interface FileTreeNodeProps {
  node: FileNode;
  level: number;
  onSelect: (path: string) => void;
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({ node, level, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const currentFile = useFileSystemStore((state) => state.currentFile);

  const handleClick = () => {
    if (node.type === 'directory') {
      setIsExpanded(!isExpanded);
    } else {
      onSelect(node.path);
    }
  };

  const isSelected = currentFile === node.path;

  return (
    <div>
      <div
        className={`flex items-center px-2 py-1 cursor-pointer hover:bg-gray-800 ${
          isSelected ? 'bg-gray-700' : ''
        }`}
        style={{ paddingLeft: `${level * 1.5}rem` }}
        onClick={handleClick}
      >
        {node.type === 'directory' && (
          <span className="mr-1">
            {isExpanded ? (
              <ChevronDownIcon size={16} />
            ) : (
              <ChevronRightIcon size={16} />
            )}
          </span>
        )}
        {node.type === 'directory' ? (
          <FolderIcon size={16} className="mr-2 text-yellow-400" />
        ) : (
          <FileIcon size={16} className="mr-2 text-blue-400" />
        )}
        <span className="text-sm truncate">{node.name}</span>
      </div>
      {node.type === 'directory' && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              level={level + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileTree: React.FC = () => {
  const { files, setCurrentFile, readFile } = useFileSystemStore();

  const handleFileSelect = async (path: string) => {
    try {
      setCurrentFile(path);
      await readFile(path);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      <div className="p-2 border-b border-gray-700 flex items-center justify-between">
        <span>Files</span>
      </div>
      <div className="overflow-auto flex-1">
        {files.map((node) => (
          <FileTreeNode
            key={node.path}
            node={node}
            level={0}
            onSelect={handleFileSelect}
          />
        ))}
        {files.length === 0 && (
          <div className="p-4 text-gray-500 text-sm">No files</div>
        )}
      </div>
    </div>
  );
};
