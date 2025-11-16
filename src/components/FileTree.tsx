"use client";

import React, { useCallback, useState } from "react";
import { TreeNode } from "@/types";
import { loadFolderChildren } from "@/lib/fileSystemUtils";

interface FileTreeProps {
  node: TreeNode;
  onUpdate: () => void;
  fileNodeMap: Map<string, TreeNode>;
  gitignorePatterns?: string[];
  treeVersion?: number;
  depth?: number;
}

function FileTreeNode({ node, onUpdate, fileNodeMap, gitignorePatterns = [], depth = 0, treeVersion }: FileTreeProps) {
  // getCheckState is now cached internally in TreeNode class
  const checkState = node.getCheckState();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Se está expandindo e não tem filhos carregados, carregar agora
    if (!node.expanded && node.type === 'directory' && node.children.length === 0) {
      setIsLoading(true);
      try {
        await loadFolderChildren(node, fileNodeMap, gitignorePatterns);
      } catch (error) {
        console.error('Erro ao carregar filhos:', error);
      } finally {
        setIsLoading(false);
      }
    }

    node.expanded = !node.expanded;
    onUpdate();
  }, [node, onUpdate, fileNodeMap, gitignorePatterns]);

  const handleCheckbox = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !node.selected;
    node.setSelected(newState);
    onUpdate();
  }, [node, onUpdate]);

  return (
    <div>
      <div
        className="tree-item"
        style={{ paddingLeft: `${depth * 0.5}rem` }}
      >
        <div className="tree-item-content">
          {/* Toggle */}
          <span
            className="tree-toggle"
            onClick={handleToggle}
            style={{ cursor: node.type === 'directory' ? 'pointer' : 'default' }}
          >
            {node.type === 'directory' ? (
              isLoading ? (
                <span className="tree-loading">●</span>
              ) : node.expanded ? (
                '▼'
              ) : (
                '▶'
              )
            ) : (
              ' '
            )}
          </span>

          {/* Checkbox */}
          <input
            type="checkbox"
            className={`tree-checkbox ${checkState === 'indeterminate' ? 'indeterminate' : ''}`}
            checked={checkState === 'checked'}
            onClick={handleCheckbox}
            readOnly
          />

          {/* Icon */}
          <span className={`tree-icon ${node.type}`}>
            {node.type === 'directory' ? '▣' : '▫'}
          </span>

          {/* Label */}
          <span className="tree-label">{node.name}</span>
        </div>
      </div>

      {/* Children */}
      {node.type === 'directory' && node.children.length > 0 && (
        <div className={`tree-children ${node.expanded ? '' : 'collapsed'}`}>
          {node.children.map((child, index) => (
            <FileTreeNode
              key={`${child.path}-${index}`}
              node={child}
              onUpdate={onUpdate}
              fileNodeMap={fileNodeMap}
              gitignorePatterns={gitignorePatterns}
              treeVersion={treeVersion}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .tree-item {
          display: flex;
          align-items: center;
          padding: 0.35rem 0.5rem;
          cursor: pointer;
          transition: background-color 0.1s ease;
          user-select: none;
        }
        .tree-item:hover {
          background-color: rgba(255, 255, 0, 0.1);
        }
        .tree-item-content {
          display: flex;
          align-items: center;
          flex-grow: 1;
        }
        .tree-toggle {
          width: 16px;
          height: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.25rem;
          color: var(--color-primary);
          font-weight: 700;
          flex-shrink: 0;
        }
        .tree-icon {
          margin-right: 0.5rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .tree-icon.folder {
          color: var(--color-primary);
        }
        .tree-icon.file {
          color: var(--color-accent-download);
        }
        .tree-label {
          color: var(--color-text-light);
          font-weight: 400;
        }
        .tree-checkbox {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid var(--color-primary);
          margin-right: 0.5rem;
          position: relative;
          transition: all 0.1s ease;
          flex-shrink: 0;
          cursor: pointer;
        }
        .tree-checkbox:checked {
          background-color: var(--color-primary);
        }
        .tree-checkbox:checked::after {
          content: 'X';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--color-secondary);
          font-size: 14px;
          font-weight: 700;
        }
        .tree-checkbox.indeterminate {
          background-color: rgba(255, 255, 0, 0.3);
        }
        .tree-checkbox.indeterminate::after {
          content: '−';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--color-primary);
          font-size: 16px;
          font-weight: 700;
        }
        .tree-children {
          margin-left: 1.5rem;
          border-left: 1px solid rgba(255, 255, 0, 0.2);
          padding-left: 0.5rem;
        }
        .tree-children.collapsed {
          display: none;
        }
        .tree-loading {
          animation: spin 1s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function FileTree({ node, onUpdate, fileNodeMap, gitignorePatterns = [], treeVersion }: Omit<FileTreeProps, 'depth'>) {
  return (
    <div className="file-tree-container">
      <FileTreeNode node={node} onUpdate={onUpdate} fileNodeMap={fileNodeMap} gitignorePatterns={gitignorePatterns} treeVersion={treeVersion} depth={0} />

      <style jsx>{`
        .file-tree-container {
          background-color: var(--color-secondary);
          border: 3px solid var(--color-primary);
          max-height: 500px;
          overflow-y: auto;
          padding: 1rem;
          font-size: 0.875rem;
          scrollbar-width: thin;
          scrollbar-color: var(--color-primary) var(--color-secondary);
        }
        .file-tree-container::-webkit-scrollbar {
          width: 8px;
        }
        .file-tree-container::-webkit-scrollbar-thumb {
          background-color: var(--color-primary);
        }
      `}</style>
    </div>
  );
}
