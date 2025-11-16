export type TreeNodeType = 'file' | 'directory';

export type CheckState = 'checked' | 'unchecked' | 'indeterminate';

export type OutputMode = 'full' | 'compact' | 'minimal';

export class TreeNode {
  name: string;
  type: TreeNodeType;
  handle: FileSystemHandle | null;
  path: string;
  children: TreeNode[];
  selected: boolean;
  expanded: boolean;
  parent: TreeNode | null;
  private _checkStateCache: CheckState | null = null;

  constructor(name: string, type: TreeNodeType, handle: FileSystemHandle | null = null, path = '') {
    this.name = name;
    this.type = type;
    this.handle = handle;
    this.path = path;
    this.children = [];
    this.selected = true;
    this.expanded = true;
    this.parent = null;
  }

  addChild(child: TreeNode): void {
    child.parent = this;
    this.children.push(child);
  }

  private invalidateCacheRecursive(): void {
    this._checkStateCache = null;
    if (this.parent) {
      this.parent.invalidateCacheRecursive();
    }
  }

  getCheckState(): CheckState {
    // Return cached value if available
    if (this._checkStateCache !== null) {
      return this._checkStateCache;
    }

    // Calculate and cache
    let result: CheckState;

    if (this.type === 'file') {
      result = this.selected ? 'checked' : 'unchecked';
    } else if (this.children.length === 0) {
      result = this.selected ? 'checked' : 'unchecked';
    } else {
      const childStates = this.children.map(c => c.getCheckState());
      const allChecked = childStates.every(s => s === 'checked');
      const noneChecked = childStates.every(s => s === 'unchecked');

      if (allChecked) {
        result = 'checked';
      } else if (noneChecked) {
        result = 'unchecked';
      } else {
        result = 'indeterminate';
      }
    }

    this._checkStateCache = result;
    return result;
  }

  setSelected(selected: boolean): void {
    this.selected = selected;
    // Invalida o cache deste nó e de todos os seus ancestrais
    this.invalidateCacheRecursive();
    // Propaga a mudança para baixo para os filhos
    this.children.forEach(child => child.setSelected(selected));
  }

  updateParentStates(nodeMap: Map<string, TreeNode>): void {
    const pathParts = this.path.split('/');
    if (pathParts.length > 1) {
      pathParts.pop();
      const parentPath = pathParts.join('/');
      const parent = nodeMap.get(parentPath);
      if (parent) {
        parent.updateParentStates(nodeMap);
      }
    }
  }
}
