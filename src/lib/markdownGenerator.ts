import { TreeNode } from "@/types";
import {
  isBinaryFile,
  getFileExtension,
  organizeByDirectory,
  createSlug,
  formatSize
} from "./fileSystemUtils";

type ProgressCallback = (current: number, total: number, fileName: string) => void;

// Utility: Yield control back to browser to keep UI responsive
async function yieldToMain() {
  return new Promise(resolve => {
    if ('scheduler' in window && 'yield' in (window as any).scheduler) {
      // Use Scheduler API if available (Chrome 94+)
      (window as any).scheduler.yield().then(resolve);
    } else {
      // Fallback to setTimeout
      setTimeout(resolve, 0);
    }
  });
}

// MODO MINIMAL - Apenas código essencial
export async function generateMinimalMode(
  selectedFiles: TreeNode[],
  rootName: string,
  progressCallback?: ProgressCallback
): Promise<string> {
  const startTime = performance.now();
  selectedFiles.sort((a, b) => a.path.localeCompare(b.path));

  let output = `# ${rootName}\n\n`;
  let ioTime = 0;
  let concatenationTime = 0;

  for (let i = 0; i < selectedFiles.length; i++) {
    const fileNode = selectedFiles[i];

    if (progressCallback) {
      progressCallback(i + 1, selectedFiles.length, fileNode.name);
    }

    try {
      // Measure I/O time
      const ioStart = performance.now();
      const file = await (fileNode.handle as FileSystemFileHandle).getFile();
      const isBinary = isBinaryFile(fileNode.name);

      if (!isBinary) {
        const content = await file.text();
        ioTime += performance.now() - ioStart;

        // Measure concatenation time
        const concatStart = performance.now();
        const extension = getFileExtension(fileNode.name);
        output += `${fileNode.path}\n\`\`\`${extension}\n`;
        output += content;
        if (!content.endsWith('\n')) output += '\n';
        output += `\`\`\`\n\n`;
        concatenationTime += performance.now() - concatStart;
      } else {
        ioTime += performance.now() - ioStart;
      }

      // Yield to browser every 5 files to keep UI responsive
      if (i > 0 && i % 5 === 0) {
        await yieldToMain();
      }
    } catch (error) {
      // Silenciosamente ignora erros no modo minimal
    }
  }

  const totalTime = performance.now() - startTime;
  console.log(`[MINIMAL MODE] Performance:`, {
    totalTime: `${totalTime.toFixed(0)}ms`,
    ioTime: `${ioTime.toFixed(0)}ms (${((ioTime / totalTime) * 100).toFixed(1)}%)`,
    concatenationTime: `${concatenationTime.toFixed(0)}ms (${((concatenationTime / totalTime) * 100).toFixed(1)}%)`,
    filesProcessed: selectedFiles.length,
    avgTimePerFile: `${(totalTime / selectedFiles.length).toFixed(1)}ms`
  });

  return output;
}

// MODO COMPACT - Agrupado por pasta, metadados básicos
export async function generateCompactMode(
  selectedFiles: TreeNode[],
  rootName: string,
  progressCallback?: ProgressCallback
): Promise<string> {
  const startTime = performance.now();
  selectedFiles.sort((a, b) => a.path.localeCompare(b.path));
  const structure = organizeByDirectory(selectedFiles);
  const directories = Object.keys(structure).sort();

  let output = `# ${rootName}\n`;
  output += `Arquivos: ${selectedFiles.length} | ${new Date().toLocaleString('pt-BR')}\n\n`;

  let processedCount = 0;
  let currentFileIndex = 0;
  let ioTime = 0;

  for (const dirPath of directories) {
    const files = structure[dirPath];
    const displayPath = dirPath === '[raiz]' ? 'Raiz' : dirPath.replace(rootName + '/', '');

    output += `## ${displayPath}\n\n`;

    for (const fileNode of files) {
      currentFileIndex++;

      if (progressCallback) {
        progressCallback(currentFileIndex, selectedFiles.length, fileNode.name);
      }

      try {
        const ioStart = performance.now();
        const file = await (fileNode.handle as FileSystemFileHandle).getFile();
        const isBinary = isBinaryFile(fileNode.name);

        output += `### ${fileNode.name}\n`;
        output += `\`${fileNode.path}\` - ${formatSize(file.size)}\n\n`;

        if (!isBinary) {
          const content = await file.text();
          ioTime += performance.now() - ioStart;
          const extension = getFileExtension(fileNode.name);

          output += `\`\`\`${extension}\n`;
          output += content;
          if (!content.endsWith('\n')) output += '\n';
          output += `\`\`\`\n\n`;
          processedCount++;
        } else {
          ioTime += performance.now() - ioStart;
          output += `[Binário]\n\n`;
        }

        // Yield every 5 files
        if (currentFileIndex > 0 && currentFileIndex % 5 === 0) {
          await yieldToMain();
        }

      } catch (error) {
        output += `[Erro: ${(error as Error).message}]\n\n`;
      }
    }
  }

  output += `---\n${processedCount} arquivos processados\n`;

  const totalTime = performance.now() - startTime;
  console.log(`[COMPACT MODE] Performance:`, {
    totalTime: `${totalTime.toFixed(0)}ms`,
    ioTime: `${ioTime.toFixed(0)}ms (${((ioTime / totalTime) * 100).toFixed(1)}%)`,
    filesProcessed: selectedFiles.length,
    avgTimePerFile: `${(totalTime / selectedFiles.length).toFixed(1)}ms`
  });

  return output;
}

// MODO FULL - Completo com índice, metadados, avisos e estatísticas
export async function generateFullMode(
  selectedFiles: TreeNode[],
  rootName: string,
  progressCallback?: ProgressCallback
): Promise<string> {
  const startTime = performance.now();
  selectedFiles.sort((a, b) => a.path.localeCompare(b.path));
  const structure = organizeByDirectory(selectedFiles);
  const directories = Object.keys(structure).sort();

  let output = `##############################################\n`;
  output += `# DIRETÓRIO: ${rootName}\n`;
  output += `# GERADO EM: ${new Date().toLocaleString('pt-BR')}\n`;
  output += `##############################################\n\n`;

  // --- ÍNDICE NAVEGÁVEL ---
  output += `## 📑 ÍNDICE\n\n`;
  output += `> Total de arquivos: **${selectedFiles.length}**\n\n`;

  for (const dirPath of directories) {
    const files = structure[dirPath];
    const displayPath = dirPath === '[raiz]' ? '📁 Raiz' : `📁 ${dirPath.replace(rootName + '/', '')}`;

    output += `### ${displayPath}\n\n`;

    files.forEach(file => {
      const slug = createSlug(file.path);
      const fileName = file.name;
      output += `- [${fileName}](#${slug})\n`;
    });

    output += `\n`;
  }

  output += `---\n\n`;

  // --- CONTEÚDO AGRUPADO POR DIRETÓRIO ---
  let processedCount = 0;
  let skippedCount = 0;
  let warningCount = 0;
  let totalLines = 0;
  let totalSize = 0;
  let ioTime = 0;

  let currentFileIndex = 0;

  for (const dirPath of directories) {
    const files = structure[dirPath];
    const displayPath = dirPath === '[raiz]' ? 'Raiz' : dirPath.replace(rootName + '/', '');

    output += `# 📂 ${displayPath}\n\n`;

    for (const fileNode of files) {
      currentFileIndex++;

      if (progressCallback) {
        progressCallback(currentFileIndex, selectedFiles.length, fileNode.name);
      }

      try {
        const ioStart = performance.now();
        const file = await (fileNode.handle as FileSystemFileHandle).getFile();
        const isBinary = isBinaryFile(fileNode.name);
        const slug = createSlug(fileNode.path);

        output += `<a id="${slug}"></a>\n\n`;
        output += `## 📄 ${fileNode.name}\n\n`;
        output += `**Caminho:** \`${fileNode.path}\`  \n`;
        output += `**Tamanho:** ${formatSize(file.size)}\n\n`;

        totalSize += file.size;

        if (isBinary) {
          ioTime += performance.now() - ioStart;
          output += `> ⚠️ **ARQUIVO BINÁRIO** - Conteúdo não exibido\n\n`;
          skippedCount++;
        } else {
          const content = await file.text();
          ioTime += performance.now() - ioStart;

          const lineCount = content.split('\n').length;
          totalLines += lineCount;

          output += `**Linhas:** ${lineCount}\n\n`;

          // Avisos para arquivos grandes
          const warnings = [];
          if (lineCount > 1000) warnings.push(`${lineCount} linhas`);
          if (file.size > 100 * 1024) warnings.push(formatSize(file.size));

          if (warnings.length > 0) {
            output += `> ⚠️ **ARQUIVO GRANDE** (${warnings.join(', ')}) - Considere revisar se é necessário incluir\n\n`;
            warningCount++;
          }

          const extension = getFileExtension(fileNode.name);

          output += `\`\`\`${extension}\n`;
          output += content;
          if (!content.endsWith('\n')) output += '\n';
          output += `\`\`\`\n\n`;
          processedCount++;
        }

        output += `---\n\n`;

        // Yield every 5 files to keep UI responsive
        if (currentFileIndex > 0 && currentFileIndex % 5 === 0) {
          await yieldToMain();
        }

      } catch (error) {
        output += `> ❌ **ERRO AO LER ARQUIVO:** ${(error as Error).message}\n\n`;
        output += `---\n\n`;
        skippedCount++;
      }
    }

    output += `\n`;
  }

  // --- ESTATÍSTICAS FINAIS ---
  output += `# 📊 ESTATÍSTICAS\n\n`;
  output += `## Resumo Geral\n\n`;
  output += `- **Total de arquivos:** ${selectedFiles.length}\n`;
  output += `- **Arquivos processados:** ${processedCount}\n`;
  output += `- **Arquivos binários/ignorados:** ${skippedCount}\n`;
  output += `- **Arquivos com avisos:** ${warningCount}\n`;
  output += `- **Total de linhas de código:** ${totalLines.toLocaleString('pt-BR')}\n`;
  output += `- **Tamanho total:** ${formatSize(totalSize)}\n\n`;

  output += `## Distribuição por Diretório\n\n`;
  for (const dirPath of directories) {
    const files = structure[dirPath];
    const displayPath = dirPath === '[raiz]' ? 'Raiz' : dirPath.replace(rootName + '/', '');
    output += `- **${displayPath}:** ${files.length} arquivo(s)\n`;
  }

  output += `\n---\n\n`;
  output += `*Gerado por Markdown Assembler em ${new Date().toLocaleString('pt-BR')}*\n`;

  const totalTime = performance.now() - startTime;
  console.log(`[FULL MODE] Performance:`, {
    totalTime: `${totalTime.toFixed(0)}ms`,
    ioTime: `${ioTime.toFixed(0)}ms (${((ioTime / totalTime) * 100).toFixed(1)}%)`,
    filesProcessed: selectedFiles.length,
    avgTimePerFile: `${(totalTime / selectedFiles.length).toFixed(1)}ms`,
    totalLines,
    totalSize: formatSize(totalSize)
  });

  return output;
}
