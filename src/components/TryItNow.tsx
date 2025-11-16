"use client";

import { useState, useRef, useCallback } from "react";
import FileTree from "./FileTree";
import Toast from "./Toast";
import MarkdownPreview from "./MarkdownPreview";
import { TreeNode, OutputMode } from "@/types";
import {
  checkFileSystemSupport,
  buildFileTree,
  collectSelectedFiles,
  countTreeNodes,
  readGitignore
} from "@/lib/fileSystemUtils";
import {
  generateMinimalMode,
  generateCompactMode,
  generateFullMode
} from "@/lib/markdownGenerator";

interface ToastMessage {
  id: number;
  message: string;
  type: 'info' | 'error' | 'success' | 'warning';
}

type ViewMode = 'raw' | 'preview';

export default function TryItNow() {
  const [directoryName, setDirectoryName] = useState("Nenhuma pasta selecionada");
  const [fileTreeData, setFileTreeData] = useState<TreeNode | null>(null);
  const [treeVersion, setTreeVersion] = useState(0);
  const [outputMode, setOutputMode] = useState<OutputMode>("full");
  const [markdownOutput, setMarkdownOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState("");
  const [showDownload, setShowDownload] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('raw');

  const directoryHandleRef = useRef<FileSystemDirectoryHandle | null>(null);
  const fileNodeMapRef = useRef<Map<string, TreeNode>>(new Map());
  const gitignorePatternsRef = useRef<string[]>([]);
  const toastIdRef = useRef(0);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = toastIdRef.current++;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const handleSelectFolder = async () => {
    if (!checkFileSystemSupport()) return;

    try {
      const dirHandle = await window.showDirectoryPicker({ mode: 'read' });
      directoryHandleRef.current = dirHandle;
      setDirectoryName(dirHandle.name);

      // Tenta ler .gitignore primeiro
      const gitignorePatterns = await readGitignore(dirHandle);
      gitignorePatternsRef.current = gitignorePatterns;

      // Constrói a árvore com os padrões do .gitignore
      fileNodeMapRef.current.clear();
      const startTime = performance.now();
      const tree = await buildFileTree(dirHandle, dirHandle.name, fileNodeMapRef.current, false, gitignorePatterns);
      const endTime = performance.now();

      setFileTreeData(tree);

      // Estatísticas
      const stats = countTreeNodes(tree);
      console.log(`Árvore carregada em ${(endTime - startTime).toFixed(0)}ms - ${stats.files} arquivos, ${stats.folders} pastas`);

    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Erro ao selecionar pasta:', error);
        showToast('Erro ao selecionar pasta: ' + error.message, 'error');
      }
    }
  };

  const handleSelectAll = useCallback(() => {
    if (fileTreeData) {
      fileTreeData.setSelected(true);
      setTreeVersion(v => v + 1);
    }
  }, [fileTreeData]);

  const handleDeselectAll = useCallback(() => {
    if (fileTreeData) {
      fileTreeData.setSelected(false);
      setTreeVersion(v => v + 1);
    }
  }, [fileTreeData]);

  const handleTreeUpdate = useCallback(() => {
    setTreeVersion(v => v + 1);
  }, []);

  const progressCallback = useCallback((current: number, total: number, fileName: string) => {
    const percent = Math.round((current / total) * 100);
    setLoadingProgress(`${current}/${total} arquivos (${percent}%) - ${fileName}`);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!fileTreeData) {
      showToast('Por favor, selecione um diretório primeiro usando o botão "Selecionar"!', 'warning');
      return;
    }

    const selectedFiles = collectSelectedFiles(fileTreeData);

    if (selectedFiles.length === 0) {
      showToast('Nenhum arquivo selecionado! Marque pelo menos um arquivo.', 'warning');
      return;
    }

    setIsLoading(true);
    setShowDownload(false);
    setViewMode('raw'); // SEMPRE inicia em RAW para evitar freeze ao renderizar markdown grande

    try {
      let result = '';
      const rootName = directoryHandleRef.current?.name || 'projeto';

      if (outputMode === 'minimal') {
        result = await generateMinimalMode(selectedFiles, rootName, progressCallback);
      } else if (outputMode === 'compact') {
        result = await generateCompactMode(selectedFiles, rootName, progressCallback);
      } else {
        result = await generateFullMode(selectedFiles, rootName, progressCallback);
      }

      setMarkdownOutput(result);
      setShowDownload(true);
      showToast(`Arquivo gerado com sucesso! ${selectedFiles.length} arquivo(s) processado(s).`, 'success');

    } catch (error: any) {
      console.error('Erro ao gerar markdown:', error);
      setMarkdownOutput(`ERRO ao gerar markdown:\n${error.message}`);
      showToast(`Erro ao gerar markdown: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
      setLoadingProgress('');
    }
  }, [fileTreeData, outputMode, progressCallback, showToast]);

  const handleDownload = () => {
    if (!markdownOutput) return;

    const blob = new Blob([markdownOutput], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    const dirName = directoryHandleRef.current ? directoryHandleRef.current.name : 'projeto';
    a.download = `${dirName}_context.md`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="try-it-now" className="section-padding">
      <div className="container mx-auto px-6">
        <h2 className="section-title text-center" data-aos="fade-up">
          Aplicação
        </h2>

        <div className="form-container mt-16" data-aos="zoom-in" data-aos-delay="100">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

            {/* Coluna de Configuração */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white mb-4 uppercase text-primary">
                [ Configuração ]
              </h3>

              {/* Input do Diretório */}
              <div>
                <label htmlFor="directoryInput" className="form-label">Diretório Raiz:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="directoryInput"
                    value={directoryName}
                    className="form-input flex-grow"
                    readOnly
                  />
                  <button
                    onClick={handleSelectFolder}
                    className="btn-secondary flex-shrink-0 uppercase"
                  >
                    Selecionar
                  </button>
                </div>
              </div>

              {/* Árvore de Arquivos */}
              {fileTreeData && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="form-label mb-0">Selecione os Arquivos:</label>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSelectAll}
                        className="btn-secondary text-xs uppercase px-2 py-1"
                      >
                        Todos
                      </button>
                      <button
                        onClick={handleDeselectAll}
                        className="btn-secondary text-xs uppercase px-2 py-1"
                      >
                        Nenhum
                      </button>
                    </div>
                  </div>
                  <FileTree
                    node={fileTreeData}
                    onUpdate={handleTreeUpdate}
                    fileNodeMap={fileNodeMapRef.current}
                    gitignorePatterns={gitignorePatternsRef.current}
                    treeVersion={treeVersion}
                  />
                </div>
              )}

              {/* Modo de Geração */}
              {fileTreeData && (
                <div>
                  <label className="form-label">Modo de Saída:</label>
                  <div className="space-y-2">
                    <label className="checkbox-container cursor-pointer">
                      <input
                        type="radio"
                        name="outputMode"
                        value="full"
                        checked={outputMode === 'full'}
                        onChange={(e) => setOutputMode(e.target.value as OutputMode)}
                        className="custom-radio"
                      />
                      <div className="flex-grow">
                        <span className="checkbox-label font-bold">[ FULL_CONTEXT ]</span>
                        <p className="text-xs text-gray-400 ml-8">
                          Índice navegável + metadados + avisos + estatísticas completas
                        </p>
                      </div>
                    </label>
                    <label className="checkbox-container cursor-pointer">
                      <input
                        type="radio"
                        name="outputMode"
                        value="compact"
                        checked={outputMode === 'compact'}
                        onChange={(e) => setOutputMode(e.target.value as OutputMode)}
                        className="custom-radio"
                      />
                      <div className="flex-grow">
                        <span className="checkbox-label font-bold">[ COMPACT ]</span>
                        <p className="text-xs text-gray-400 ml-8">
                          Sem índice, metadados básicos, agrupamento por pasta
                        </p>
                      </div>
                    </label>
                    <label className="checkbox-container cursor-pointer">
                      <input
                        type="radio"
                        name="outputMode"
                        value="minimal"
                        checked={outputMode === 'minimal'}
                        onChange={(e) => setOutputMode(e.target.value as OutputMode)}
                        className="custom-radio"
                      />
                      <div className="flex-grow">
                        <span className="checkbox-label font-bold">[ MINIMAL_TOKENS ]</span>
                        <p className="text-xs text-gray-400 ml-8">
                          Apenas código puro, sem headers/metadados. Máxima economia de tokens
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Botão de Gerar */}
              <button
                onClick={handleGenerate}
                className="w-full btn-accent-go"
                data-aos="zoom-in"
                data-aos-delay="200"
              >
                Gerar Arquivo
              </button>
            </div>

            {/* Coluna de Resultado */}
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-3xl font-bold text-white uppercase text-primary">
                  [ Saída ]
                </h3>
                <div className="flex gap-2 items-center">
                  {/* Toggle Raw/Preview */}
                  {markdownOutput && (
                    <div className="view-mode-toggle">
                      <button
                        onClick={() => setViewMode('raw')}
                        className={`toggle-btn ${viewMode === 'raw' ? 'active' : ''}`}
                      >
                        <span className="toggle-icon">&lt;/&gt;</span> RAW
                      </button>
                      <button
                        onClick={() => setViewMode('preview')}
                        className={`toggle-btn ${viewMode === 'preview' ? 'active' : ''}`}
                      >
                        <span className="toggle-icon">▶</span> PREVIEW
                      </button>
                    </div>
                  )}
                  {showDownload && (
                    <button onClick={handleDownload} className="btn-accent-download">
                      Download
                    </button>
                  )}
                </div>
              </div>

              {/* Área de Saída */}
              <div className="output-container flex-grow relative">
                <div className="markdown-output h-full">
                  {markdownOutput ? (
                    viewMode === 'raw' ? (
                      <pre className="whitespace-pre-wrap break-words">{markdownOutput}</pre>
                    ) : (
                      <MarkdownPreview content={markdownOutput} />
                    )
                  ) : (
                    <p className="text-gray-500 p-6">
                      {'//'} A saída do seu markdown aparecerá aqui...
                      <br />
                      {'//'} Clique em [GERAR ARQUIVO] para começar.
                    </p>
                  )}
                </div>

                {/* Overlay de Loading */}
                {isLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center transition-opacity duration-300">
                    <div className="text-center">
                      <svg
                        className="animate-spin h-10 w-10 text-primary mx-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <p className="mt-4 text-lg font-semibold uppercase">
                        Gerando em modo {outputMode.toUpperCase()}...
                      </p>
                      {loadingProgress && (
                        <p className="mt-2 text-sm text-gray-400">{loadingProgress}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .section-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 4rem;
          color: var(--color-primary);
          text-transform: uppercase;
          border: 4px solid var(--color-primary);
          padding: 1rem 1.5rem;
          display: inline-block;
          box-shadow: 8px 8px 0px 0px rgba(255, 255, 0, 0.3);
        }
        .form-container {
          background-color: var(--color-secondary);
          border: 4px solid var(--color-primary);
          padding: 2rem;
          box-shadow: 10px 10px 0px 0px var(--color-primary);
        }
        .form-label {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: var(--color-text-light);
          text-transform: uppercase;
        }
        .form-input {
          background-color: var(--color-secondary);
          border: 3px solid var(--color-text-light);
          color: var(--color-text-light);
          padding: 0.75rem 1rem;
          width: 100%;
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          transition: all 0.15s ease-out;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--color-primary);
          background-color: #111;
          box-shadow: 0 0 0 3px var(--color-primary);
        }
        .btn-secondary {
          background-color: var(--color-secondary);
          color: var(--color-primary);
          border: 3px solid var(--color-primary);
          font-weight: 700;
          padding: 0.5rem 1rem;
          transition: all 0.15s ease;
        }
        .btn-secondary:hover {
          background-color: var(--color-primary);
          color: var(--color-secondary);
        }
        .btn-accent-go {
          background-color: var(--color-accent-go);
          color: var(--color-secondary);
          font-weight: 700;
          padding: 1rem 2.5rem;
          border: 3px solid var(--color-secondary);
          box-shadow: 6px 6px 0px 0px var(--color-secondary);
          font-size: 1.125rem;
          text-transform: uppercase;
          transition: all 0.15s ease-out;
        }
        .btn-accent-go:hover {
          transform: translate(2px, 2px);
          box-shadow: 4px 4px 0px 0px var(--color-secondary);
        }
        .btn-accent-download {
          background-color: var(--color-accent-download);
          color: var(--color-secondary);
          font-weight: 700;
          padding: 0.75rem 2rem;
          border: 3px solid var(--color-secondary);
          box-shadow: 6px 6px 0px 0px var(--color-secondary);
          text-transform: uppercase;
          transition: all 0.15s ease-out;
        }
        .btn-accent-download:hover {
          transform: translate(2px, 2px);
          box-shadow: 4px 4px 0px 0px var(--color-secondary);
        }
        .checkbox-container {
          display: flex;
          align-items: center;
          margin-bottom: 0.75rem;
          cursor: pointer;
        }
        .checkbox-label {
          color: var(--color-text-light);
          transition: color 0.15s ease;
        }
        .checkbox-container:hover .checkbox-label {
          color: var(--color-primary);
        }
        .custom-radio {
          appearance: none;
          width: 20px;
          height: 20px;
          border: 3px solid var(--color-primary);
          border-radius: 50%;
          margin-right: 0.75rem;
          position: relative;
          transition: all 0.15s ease;
          flex-shrink: 0;
          cursor: pointer;
          background-color: var(--color-secondary);
        }
        .custom-radio:checked {
          background-color: var(--color-primary);
          box-shadow: 0 0 0 3px var(--color-secondary), 0 0 0 6px var(--color-primary);
        }
        .custom-radio:checked::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background-color: var(--color-secondary);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .output-container {
          background-color: var(--color-secondary);
          border: 4px solid var(--color-text-light);
          height: 100%;
          min-height: 500px;
          font-size: 0.875rem;
          position: relative;
        }
        .markdown-output {
          padding: 1.5rem;
          height: 100%;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--color-primary) var(--color-secondary);
        }
        .markdown-output::-webkit-scrollbar {
          width: 10px;
        }
        .markdown-output::-webkit-scrollbar-thumb {
          background-color: var(--color-primary);
        }

        /* View Mode Toggle */
        .view-mode-toggle {
          display: flex;
          gap: 0;
          border: 3px solid var(--color-primary);
          background-color: var(--color-secondary);
        }

        .toggle-btn {
          padding: 0.5rem 1rem;
          font-weight: 700;
          font-size: 0.875rem;
          text-transform: uppercase;
          background-color: var(--color-secondary);
          color: var(--color-text-light);
          border: none;
          border-right: 2px solid var(--color-primary);
          transition: all 0.15s ease;
          cursor: pointer;
          font-family: 'Space Mono', monospace;
        }

        .toggle-btn:last-child {
          border-right: none;
        }

        .toggle-btn:hover {
          background-color: rgba(255, 255, 0, 0.1);
          color: var(--color-primary);
        }

        .toggle-btn.active {
          background-color: var(--color-primary);
          color: var(--color-secondary);
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
        }

        .toggle-icon {
          display: inline-block;
          margin-right: 0.25rem;
          font-weight: 900;
        }

        /* Mobile Optimizations */
        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
            padding: 0.75rem 1rem;
            box-shadow: 4px 4px 0px 0px rgba(255, 255, 0, 0.3);
          }

          .app-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          /* Larger touch targets for buttons */
          .btn-secondary {
            min-height: 44px;
            min-width: 44px;
            padding: 0.75rem 1.5rem;
            font-size: 0.875rem;
          }

          .btn-accent-download {
            min-height: 44px;
            padding: 0.75rem 1.5rem;
            font-size: 0.875rem;
          }

          /* Responsive output container */
          .output-container {
            min-height: 400px;
          }

          /* Responsive titles */
          h3 {
            font-size: 1.5rem !important;
          }

          /* Stack toggle buttons on very small screens */
          @media (max-width: 480px) {
            .view-mode-toggle {
              flex-direction: column;
            }

            .toggle-btn {
              border-right: none;
              border-bottom: 2px solid var(--color-primary);
              padding: 0.75rem;
            }

            .toggle-btn:last-child {
              border-bottom: none;
            }
          }

          /* Responsive radio button labels */
          .checkbox-container {
            flex-wrap: wrap;
          }

          .checkbox-label {
            font-size: 0.875rem;
          }

          /* Smaller form labels */
          .form-label {
            font-size: 0.875rem;
          }
        }
      `}</style>

      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </section>
  );
}
