import { TreeNode } from "@/types";

/**
 * Parse .gitignore file and return array of patterns
 */
export function parseGitignore(content: string): string[] {
  const lines = content.split('\n');
  const patterns: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (trimmed === '' || trimmed.startsWith('#')) {
      continue;
    }

    patterns.push(trimmed);
  }

  return patterns;
}

/**
 * Check if a path matches a gitignore pattern
 * Simplified implementation (not full gitignore spec)
 */
export function matchesGitignorePattern(path: string, pattern: string): boolean {
  // Remove leading slash
  const cleanPattern = pattern.startsWith('/') ? pattern.slice(1) : pattern;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Directory pattern (ends with /)
  if (cleanPattern.endsWith('/')) {
    const dirPattern = cleanPattern.slice(0, -1);
    return cleanPath === dirPattern || cleanPath.startsWith(dirPattern + '/');
  }

  // Exact match
  if (!cleanPattern.includes('*')) {
    return cleanPath === cleanPattern || cleanPath.endsWith('/' + cleanPattern);
  }

  // Wildcard pattern (*.ext or folder/*)
  const regexPattern = cleanPattern
    .replace(/\./g, '\\.')
    .replace(/\*/g, '.*');

  const regex = new RegExp(`(^|/)${regexPattern}$`);
  return regex.test(cleanPath);
}

/**
 * Check if path is ignored by any gitignore patterns
 */
export function isIgnoredByGitignore(path: string, gitignorePatterns: string[]): boolean {
  for (const pattern of gitignorePatterns) {
    if (matchesGitignorePattern(path, pattern)) {
      return true;
    }
  }
  return false;
}

/**
 * Attempts to read .gitignore from the selected directory
 */
export async function readGitignore(dirHandle: FileSystemDirectoryHandle): Promise<string[]> {
  try {
    const gitignoreHandle = await dirHandle.getFileHandle('.gitignore');
    const file = await gitignoreHandle.getFile();
    const content = await file.text();
    const patterns = parseGitignore(content);
    console.log(`✅ Loaded .gitignore with ${patterns.length} patterns`);
    return patterns;
  } catch (error) {
    // .gitignore não existe ou não pôde ser lido
    console.log('ℹ️ No .gitignore found, using default patterns');
    return [];
  }
}

export function checkFileSystemSupport(): boolean {
  if (typeof window === 'undefined') return false;
  if (!('showDirectoryPicker' in window)) {
    alert('Seu navegador não suporta File System Access API.\nUse Chrome/Edge 86+ ou outro navegador moderno.');
    return false;
  }
  return true;
}

/**
 * Verifica se uma pasta deve iniciar colapsada (fechada)
 * Usa .gitignore como fonte primária, com fallback para lista padrão
 */
export function shouldAutoCollapse(folderPath: string, folderName: string, gitignorePatterns: string[] = []): boolean {
  // Primeiro verifica .gitignore
  if (gitignorePatterns.length > 0 && isIgnoredByGitignore(folderPath, gitignorePatterns)) {
    return true;
  }

  // Fallback: lista padrão de pastas comuns
  const autoCollapseFolders = [
    'node_modules',    // Dependencies (Node.js)
    '.git',            // Git metadata
    '.next',           // Next.js build
    '.nuxt',           // Nuxt.js build
    'dist',            // Build output
    'build',           // Build output
    'out',             // Output folder
    '.cache',          // Cache files
    'coverage',        // Test coverage
    '.turbo',          // Turborepo cache
    '.vercel',         // Vercel config
    '.netlify',        // Netlify config
    '__pycache__',     // Python cache
    'venv',            // Python virtual env
    '.venv',           // Python virtual env
    'vendor',          // PHP/Go dependencies
    'target',          // Rust/Java build
    '.gradle',         // Gradle cache
    '.maven',          // Maven cache
    '.idea',           // IntelliJ IDEA
    '.vscode',         // VS Code (opcional, mas comum)
    '.DS_Store',       // macOS metadata
  ];

  // Colapsa pastas que começam com ponto (exceto algumas úteis)
  if (folderName.startsWith('.')) {
    const usefulDotFolders = ['.github', '.husky', '.storybook'];
    return !usefulDotFolders.includes(folderName);
  }

  return autoCollapseFolders.includes(folderName.toLowerCase());
}

/**
 * Verifica se um arquivo deve iniciar desmarcado
 * Usa .gitignore como fonte primária, com fallback para lista padrão
 */
export function shouldAutoDeselect(filePath: string, fileName: string, gitignorePatterns: string[] = []): boolean {
  // Primeiro verifica .gitignore
  if (gitignorePatterns.length > 0 && isIgnoredByGitignore(filePath, gitignorePatterns)) {
    return true;
  }

  // Fallback: lista padrão de arquivos comuns
  const autoDeselectFiles = [
    // Lock files
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    'bun.lockb',
    'composer.lock',
    'Gemfile.lock',
    'poetry.lock',
    'Cargo.lock',

    // Log files
    '*.log',
    'npm-debug.log',
    'yarn-error.log',

    // OS files
    '.DS_Store',
    'Thumbs.db',
    'desktop.ini',

    // IDE files
    '*.swp',
    '*.swo',
    '*~',

    // Build artifacts
    '*.map',
    '*.min.js',
    '*.min.css',

    // Large data files
    '*.sqlite',
    '*.db',

    // Images (usually binary and not useful in code context)
    '*.png',
    '*.jpg',
    '*.jpeg',
    '*.gif',
    '*.ico',
    '*.svg',
    '*.webp',
    '*.bmp',

    // Fonts
    '*.ttf',
    '*.otf',
    '*.woff',
    '*.woff2',
    '*.eot',

    // Videos/Audio
    '*.mp4',
    '*.mp3',
    '*.wav',
    '*.avi',
    '*.mov',

    // Documents
    '*.pdf',
    '*.doc',
    '*.docx',
  ];

  const lowerFileName = fileName.toLowerCase();

  // Verifica se arquivo termina com alguma extensão da lista
  for (const pattern of autoDeselectFiles) {
    if (pattern.includes('*')) {
      // Pattern matching simples
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      if (regex.test(lowerFileName)) {
        return true;
      }
    } else {
      // Exact match
      if (lowerFileName === pattern.toLowerCase()) {
        return true;
      }
    }
  }

  return false;
}

export function isBinaryFile(fileName: string): boolean {
  const binaryExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.ico',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    '.zip', '.rar', '.7z', '.tar', '.gz',
    '.exe', '.dll', '.so', '.dylib',
    '.mp3', '.mp4', '.avi', '.mov', '.wav',
    '.ttf', '.otf', '.woff', '.woff2',
    '.db', '.sqlite', '.bin'
  ];
  return binaryExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
}

export function getFileExtension(fileName: string): string {
  const parts = fileName.split('.');
  if (parts.length > 1) {
    return parts[parts.length - 1].toLowerCase();
  }
  return 'txt';
}

/**
 * Constrói a árvore de arquivos com lazy loading
 * Pastas colapsadas são criadas como "stub" sem carregar conteúdo
 * @param skipLazyLoad - Se true, carrega todo o conteúdo (útil para testes)
 * @param gitignorePatterns - Padrões do .gitignore para auto-collapse e deselect
 */
export async function buildFileTree(
  dirHandle: FileSystemDirectoryHandle,
  currentPath = '',
  fileNodeMap: Map<string, TreeNode>,
  skipLazyLoad = false,
  gitignorePatterns: string[] = []
): Promise<TreeNode> {
  const node = new TreeNode(dirHandle.name, 'directory', dirHandle, currentPath);
  fileNodeMap.set(currentPath, node);

  // Aplica regras inteligentes: colapsa pastas comuns (com suporte a .gitignore)
  const shouldCollapse = shouldAutoCollapse(currentPath, dirHandle.name, gitignorePatterns);
  if (shouldCollapse) {
    node.expanded = false;
    node.selected = false; // Desmarca pastas colapsadas também
  }

  // OTIMIZAÇÃO CRÍTICA: Se a pasta está colapsada e não queremos lazy load,
  // criamos apenas um "stub" sem carregar os filhos
  // Isso economiza MUITO tempo com node_modules, .git, etc
  if (shouldCollapse && !skipLazyLoad) {
    // Cria um placeholder para indicar que há conteúdo não carregado
    // Os filhos serão carregados apenas quando o usuário expandir a pasta
    console.log(`⚡ Lazy loading: Skipping ${currentPath} (${dirHandle.name})`);
    return node;
  }

  try {
    const entries: FileSystemHandle[] = [];
    for await (const entry of dirHandle.values()) {
      entries.push(entry);
    }

    // Ordena: pastas primeiro, depois alfabeticamente
    entries.sort((a, b) => {
      if (a.kind !== b.kind) {
        return a.kind === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    for (const entry of entries) {
      const entryPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;

      if (entry.kind === 'directory') {
        const childNode = await buildFileTree(
          entry as FileSystemDirectoryHandle,
          entryPath,
          fileNodeMap,
          skipLazyLoad,
          gitignorePatterns
        );
        node.addChild(childNode);
      } else {
        const fileNode = new TreeNode(entry.name, 'file', entry, entryPath);

        // Aplica regras inteligentes: desmarca arquivos comuns (com suporte a .gitignore)
        if (shouldAutoDeselect(entryPath, entry.name, gitignorePatterns)) {
          fileNode.selected = false;
        }

        fileNodeMap.set(entryPath, fileNode);
        node.addChild(fileNode);
      }
    }
  } catch (error) {
    console.error('Erro ao construir árvore:', error);
  }

  return node;
}

/**
 * Carrega os filhos de uma pasta que estava com lazy loading
 * Chamado quando o usuário expande uma pasta pela primeira vez
 */
export async function loadFolderChildren(
  node: TreeNode,
  fileNodeMap: Map<string, TreeNode>,
  gitignorePatterns: string[] = []
): Promise<void> {
  // Se já tem filhos carregados, não faz nada
  if (node.children.length > 0) {
    return;
  }

  // Se não tem handle, não pode carregar
  if (!node.handle || node.type !== 'directory') {
    return;
  }

  const dirHandle = node.handle as FileSystemDirectoryHandle;

  try {
    const entries: FileSystemHandle[] = [];
    for await (const entry of dirHandle.values()) {
      entries.push(entry);
    }

    entries.sort((a, b) => {
      if (a.kind !== b.kind) {
        return a.kind === 'directory' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    for (const entry of entries) {
      const entryPath = node.path ? `${node.path}/${entry.name}` : entry.name;

      if (entry.kind === 'directory') {
        const childNode = await buildFileTree(
          entry as FileSystemDirectoryHandle,
          entryPath,
          fileNodeMap,
          false, // Mantém lazy loading para sub-pastas
          gitignorePatterns
        );
        node.addChild(childNode);
      } else {
        const fileNode = new TreeNode(entry.name, 'file', entry, entryPath);

        if (shouldAutoDeselect(entryPath, entry.name, gitignorePatterns)) {
          fileNode.selected = false;
        }

        fileNodeMap.set(entryPath, fileNode);
        node.addChild(fileNode);
      }
    }

    console.log(`✅ Loaded children for: ${node.path} (${node.children.length} items)`);
  } catch (error) {
    console.error(`Erro ao carregar filhos de ${node.path}:`, error);
  }
}

export function collectSelectedFiles(node: TreeNode, result: TreeNode[] = []): TreeNode[] {
  if (node.type === 'file' && node.selected) {
    result.push(node);
  } else if (node.type === 'directory') {
    node.children.forEach(child => collectSelectedFiles(child, result));
  }
  return result;
}

export function countTreeNodes(node: TreeNode): { files: number; folders: number } {
  let files = 0;
  let folders = 0;

  if (node.type === 'file') {
    files = 1;
  } else if (node.type === 'directory') {
    folders = 1;
    node.children.forEach(child => {
      const childCount = countTreeNodes(child);
      files += childCount.files;
      folders += childCount.folders;
    });
  }

  return { files, folders };
}

export function organizeByDirectory(files: TreeNode[]): Record<string, TreeNode[]> {
  const structure: Record<string, TreeNode[]> = {};

  files.forEach(file => {
    const parts = file.path.split('/');
    const dirPath = parts.slice(0, -1).join('/') || '[raiz]';

    if (!structure[dirPath]) {
      structure[dirPath] = [];
    }
    structure[dirPath].push(file);
  });

  return structure;
}

export function createSlug(text: string): string {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
