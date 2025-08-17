"use client";

import { lazy, useEffect, useReducer, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import useConstant from "use-constant";
import { useAtom } from "jotai/react";
import { log } from "next-axiom/dist/logger";

import { Panel as ResizablePanel, PanelGroup } from "react-resizable-panels";

import { createSingleton, useSetState } from "../hooks";
import { Worker } from "../worker";
import Tree from "../components/elements-tree";
import BoxSizing from "../components/box-sizing";
import {
  Buttons,
  Version,
  ResizeHandle,
  ScrollBox,
  DebugFont,
  DebugInfo,
  Styles,
  BoxInfo,
  PreviewPanel,
  HeaderControls,
  FooterControls,
  EmptyDebugger,
  Preview,
  Error,
  GithubButton,
} from "../components/repl-layout";
import { loader } from "../components/viewer.module.css";
import {
  page,
  pagesCount,
  canDecrease,
  canIncrease,
  increase,
  decrease,
} from "../state/page";

import { layoutAtom, selectedAtom } from "../state/debugger";

import { decompress, gzCompress, gzDecompress } from "../code/lz";
import { code as defCode } from "../code/default-example";

const Viewer = lazy(() => import("../components/viewer"));

const useWorker = createSingleton(
  () => (typeof document !== "undefined" ? new Worker() : null),
  (worker) => worker?.terminate()
);

function useMediaQuery(query) {
  const getMatches = (query) => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState(() => getMatches(query));

  useEffect(() => {
    function handleChange() {
      setMatches(getMatches(query));
    }

    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    matchMedia.addEventListener("change", handleChange);

    return () => {
      matchMedia.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

const ClientOnly = ({ children }) => {
  const [isClient, set] = useState(false);

  useEffect(() => set(true), []);

  return isClient ? children : null;
};

const Loader = () => <div className={loader} />;

const addId = (node, parent, prefix, postfix) => {
  if (parent) node.parent = parent;
  node._id = [prefix, node.type, postfix].filter((v) => v).join("__");

  if (node.children)
    node.children.forEach((child, index) => {
      addId(child, node, node._id, index + 1);
    });

  return node;
};

const createLink = (options) => {
  const link = new URL(window.location);

  link.searchParams.set("gz_code", gzCompress(options.code));

  if (options.modules) {
    link.searchParams.set("modules", options.modules);
  }

  return link.toString();
};

const Repl = () => {
  const urlParams = useConstant(() => {
    if (typeof window === "undefined") return {};

    return Object.fromEntries(
      Array.from(new URLSearchParams(window.location.search).entries()).map(
        ([key, value]) => {
          if (key.startsWith("cp_")) {
            return [key.slice(3), decompress(value)];
          }
          if (key.startsWith("gz_")) {
            return [key.slice(3), gzDecompress(value)];
          }

          return [key, value];
        }
      )
    );
  });

  const isMobile = useMediaQuery("(max-width: 600px)");

  const [options, updateOptions] = useSetState(() => ({
    modules: urlParams.code ? Boolean(urlParams.modules) : true,
  }));

  const timeout = useRef(20_000);

  const [state, update] = useSetState(() => ({
    url: null,
    version: null,
    time: null,
    error: null,
    isDebuggingSupported: options.modules,
    isDebugging: true,
    isEditing: true,
  }));

  const [isReady, setReady] = useState(false);
  const [code, setCode] = useState(() => urlParams.code ?? defCode);
  const [v, forceRender] = useReducer((v) => !v);
  const [examples, setExamples] = useState([]);
  const [selectedExample, setSelectedExample] = useState("");

  const [pageV] = useAtom(page);
  const [, setPagesCount] = useAtom(pagesCount);
  const [canDecreaseV] = useAtom(canDecrease);
  const [, decreaseS] = useAtom(decrease);
  const [canIncreaseV] = useAtom(canIncrease);
  const [, increaseS] = useAtom(increase);

  const [layout, setLayout] = useAtom(layoutAtom);
  const [selectedNode] = useAtom(selectedAtom);

  const pdf = useWorker();

  const debuggerAPI = useRef();
  const editorPanelAPI = useRef();

  // Fetch examples on mount
  useEffect(() => {
    fetch('/api/examples')
      .then(res => res.json())
      .then(data => {
        if (data.examples) {
          setExamples(data.examples);
        }
      })
      .catch(err => console.error('Failed to fetch examples:', err));
  }, []);

  // Handle example selection
  const handleExampleChange = (exampleName) => {
    if (!exampleName) return;
    
    setSelectedExample(exampleName);
    fetch(`/api/examples?name=${exampleName}`)
      .then(res => res.json())
      .then(data => {
        if (data.code) {
          // Process the code to handle imports properly
          let processedCode = data.code;
          
          // Remove ReactPDF.render() calls as they're not needed in the playground
          processedCode = processedCode.replace(/ReactPDF\.render\([^)]*\);?/g, '');
          
          // Check if there are commented import statements
          const hasCommentedImports = processedCode.includes('// import');
          
          if (hasCommentedImports) {
            // Extract ALL import statements (could be multiple lines)
            const importMatches = processedCode.match(/\/\/ import.*?from.*?;?\n/g);
            if (importMatches) {
              // Collect all imports, but avoid duplicates with different names
              const allImports = new Set();
              const baseImports = new Set(); // Track base names to avoid conflicts
              
              importMatches.forEach(match => {
                const importContent = match.match(/\{([^}]+)\}/);
                if (importContent) {
                  const imports = importContent[1].split(',').map(i => i.trim());
                  imports.forEach(imp => {
                    // Check if it's a renamed import (e.g., "Text as SvgText")
                    if (imp.includes(' as ')) {
                      const [baseName, ] = imp.split(' as ').map(s => s.trim());
                      // Skip if we already have the base import
                      if (!baseImports.has(baseName)) {
                        // Don't add renamed imports if base is already there
                        if (baseName === 'Text') {
                          // Skip Text as SvgText since we'll use Text directly
                          return;
                        }
                        allImports.add(imp);
                        baseImports.add(baseName);
                      }
                    } else {
                      allImports.add(imp);
                      baseImports.add(imp);
                    }
                  });
                }
              });
              
              if (allImports.size > 0) {
                // Add all imports at the beginning and remove all comment lines
                processedCode = `import { ${Array.from(allImports).join(', ')} } from '@react-pdf/renderer';\n\n` + 
                               processedCode.replace(/^\/\/.*\n/gm, '');
              }
            }
          } else {
            // Check if any React-PDF components are used without imports
            const hasImports = processedCode.includes("from '@react-pdf/renderer'");
            if (!hasImports) {
              // Detect which components are being used - comprehensive list
              const componentsUsed = new Set();
              
              // All possible React-PDF exports
              const allComponents = [
                // Core components
                'Document', 'Page', 'View', 'Text', 'Link', 'Image', 'Note', 'Canvas',
                // Style utilities
                'StyleSheet', 'Font',
                // SVG components
                'Svg', 'SVG', 'Line', 'Polyline', 'Polygon', 'Path', 'Rect', 
                'Circle', 'Ellipse', 'Tspan', 'G', 
                'Stop', 'Defs', 'ClipPath', 'LinearGradient', 'RadialGradient',
                // Hooks
                'usePDF',
                // Renderers
                'PDFViewer', 'PDFDownloadLink', 'BlobProvider',
                // Other utilities
                'pdf', 'renderToStream', 'renderToString', 'renderToFile',
                'createInstance'
              ];
              
              allComponents.forEach(comp => {
                // Check for component usage in various contexts
                const patterns = [
                  `<${comp}[\\s>]`, // JSX usage
                  `${comp}\\.`, // Static method calls
                  `\\b${comp}\\(`, // Function calls
                  `const.*=.*${comp}`, // Assignments
                ];
                
                const regex = new RegExp(patterns.join('|'), 'g');
                if (regex.test(processedCode)) {
                  componentsUsed.add(comp);
                }
              });
              
              // Always include commonly used ones if Document is present
              if (processedCode.includes('<Document')) {
                ['Document', 'Page', 'View', 'Text', 'StyleSheet'].forEach(comp => {
                  componentsUsed.add(comp);
                });
              }
              
              // Add imports if components are detected
              if (componentsUsed.size > 0) {
                const importList = Array.from(componentsUsed).join(', ');
                processedCode = `import { ${importList} } from '@react-pdf/renderer';\n\n` + processedCode;
              }
            }
            
            // Remove regular comment lines but keep imports
            processedCode = processedCode.replace(/^\/\/(?!.*import).*\n/gm, '');
          }
          
          // Handle ReactPDF namespace if still present
          if (processedCode.includes('ReactPDF')) {
            processedCode = `import * as ReactPDF from '@react-pdf/renderer';\n` + processedCode;
          }
          
          // Ensure there's a default export
          if (!processedCode.includes('export default')) {
            // Try to find the main component and export it
            const componentMatch = processedCode.match(/const (\w+) = \(\) => \(\s*<Document/);
            if (componentMatch) {
              processedCode += `\nexport default ${componentMatch[1]};`;
            } else {
              // Check for direct JSX assignment
              const docMatch = processedCode.match(/const (\w+) = \(\s*<Document/);
              if (docMatch) {
                processedCode += `\nexport default () => ${docMatch[1]};`;
              }
            }
          }
          
          setCode(processedCode);
        }
      })
      .catch(err => console.error('Failed to load example:', err));
  };

  useEffect(() => {
    if (isReady) {
      pdf.call("version").then(({ version, isDebuggingSupported }) =>
        update({
          version,
          isDebuggingSupported: options.modules && isDebuggingSupported,
        })
      );
    } else {
      // Ensure worker is started and then initialize
      if (pdf) {
        pdf.start();
        pdf.call("init").then(() => setReady(true));
      }
    }
  }, [pdf, update, isReady, options.modules]);

  useEffect(() => {
    if (isReady && pdf) {
      // Add a small delay for the first render to ensure worker is fully ready
      const delay = state.url === null ? 100 : 0;
      
      setTimeout(() => {
        const startTime = Date.now();
        pdf
          .call("evaluate", {
            code,
            options: { modules: options.modules },
            timeout: timeout.current,
          })
          .then(({ url, layout }) => {
            if (layout) {
              setLayout(addId(layout));
            } else {
              setLayout(null);
            }
            update({ url, time: Date.now() - startTime, error: null });
          })
          .catch((error) => {
            if (error.fatal) {
              log.error(error.message, {
                link: createLink({ code, ...options }),
              });
            }
            update({ time: Date.now() - startTime, error });
          });
      }, delay);
    }
  }, [pdf, code, update, isReady, setLayout, options, v]);

  const editorPanel = (
    <ResizablePanel
      ref={editorPanelAPI}
      defaultSize={50}
      minSize={20}
      collapsible
      onCollapse={(collapsed) => update({ isEditing: !collapsed })}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ 
          padding: '8px', 
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fafafa',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <label style={{ fontSize: '12px', fontWeight: '500' }}>
            Examples:
          </label>
          <select 
            value={selectedExample}
            onChange={(e) => handleExampleChange(e.target.value)}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'pointer',
              flex: 1,
              maxWidth: '300px'
            }}
          >
            <option value="">Select an example...</option>
            <optgroup label="Basic">
              {examples.filter(ex => ['quick-start', 'text', 'images', 'emoji'].includes(ex)).map(example => (
                <option key={example} value={example}>
                  {example.replace(/-/g, ' ')}
                </option>
              ))}
            </optgroup>
            <optgroup label="Styling">
              {examples.filter(ex => ['inline-styles', 'styles', 'mixed-styles', 'media-queries'].includes(ex)).map(example => (
                <option key={example} value={example}>
                  {example.replace(/-/g, ' ')}
                </option>
              ))}
            </optgroup>
            <optgroup label="Layout">
              {examples.filter(ex => ['page-breaks', 'page-numbers', 'page-wrap', 'fixed-components'].includes(ex)).map(example => (
                <option key={example} value={example}>
                  {example.replace(/-/g, ' ')}
                </option>
              ))}
            </optgroup>
            <optgroup label="Advanced">
              {examples.filter(ex => ['resume', 'fractals', 'font-register'].includes(ex)).map(example => (
                <option key={example} value={example}>
                  {example.replace(/-/g, ' ')}
                </option>
              ))}
            </optgroup>
            <optgroup label="All Examples">
              {examples.map(example => (
                <option key={example} value={example}>
                  {example.replace(/-/g, ' ')}
                </option>
              ))}
            </optgroup>
          </select>
          {selectedExample && (
            <button
              onClick={() => {
                setSelectedExample("");
                setCode(defCode);
              }}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <Editor
            loading={<Loader />}
            language="javascript"
            value={code}
            onChange={(newCode) => {
              setCode(newCode ?? "");
            }}
            beforeMount={(_monaco) => {
              _monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                allowNonTsExtensions: true,
                checkJs: true,
                allowJs: true,
                noLib: true,
                jsx: "react",
              });
              _monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
                { noSemanticValidation: true }
              );
            }}
            options={{
              wordWrap: "on",
              tabSize: 2,
              minimap: {
                enabled: false,
              },
              contextmenu: false,
            }}
          />
        </div>
      </div>
    </ResizablePanel>
  );

  const viewerPanel = (
    <ResizablePanel minSize={20}>
      <PanelGroup autoSaveId="react-pdf-repl-debug" direction="vertical">
        <ResizablePanel minSize={20}>
          <PreviewPanel>
            <HeaderControls>
              <Version time={state.time} value={state.version} />

              {pageV && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button disabled={!canDecreaseV} onClick={() => decreaseS()}>
                    {"<"}
                  </button>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0px 0px 3px 5px",
                    }}
                  >
                    page:
                    <div style={{ textAlign: "center", minWidth: 20 }}>
                      {pageV}
                    </div>
                  </div>
                  <button disabled={!canIncreaseV} onClick={() => increaseS()}>
                    {">"}
                  </button>
                </div>
              )}

              <Buttons>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      createLink({ code, ...options })
                    )
                  }
                >
                  copy link
                </button>

                <button
                  onClick={() => {
                    window.open(state.url);
                  }}
                >
                  open pdf
                </button>

                <GithubButton />
              </Buttons>
            </HeaderControls>

            <Preview style={{ overflow: state.error ? "hidden" : "scroll" }}>
              <ScrollBox>
                <Viewer
                  url={state.url}
                  page={pageV}
                  isDebugging={state.isDebugging}
                  layout={layout}
                  onParse={({ pagesCount }) => setPagesCount(pagesCount)}
                />
              </ScrollBox>

              {state.error && (
                <Error
                  error={state.error}
                  actions={[
                    [
                      "restart",
                      () => {
                        pdf.start();
                        forceRender();
                      },
                    ],

                    [
                      "increase timeout and restart",
                      () => {
                        pdf.start();
                        timeout.current = timeout.current * 2;
                        forceRender();
                      },
                    ],
                  ]}
                />
              )}
            </Preview>

            <FooterControls>
              <button
                onClick={() => {
                  const panel = editorPanelAPI.current;
                  if (panel) {
                    if (state.isEditing) {
                      panel.collapse();
                    } else {
                      panel.expand();
                    }
                  }
                }}
              >
                {state.isEditing ? "hide" : "show"} editor
              </button>
              <button
                onClick={() => {
                  const panel = debuggerAPI.current;
                  if (panel) {
                    if (state.isDebugging) {
                      panel.collapse();
                    } else {
                      panel.expand();
                    }
                  }
                }}
              >
                {state.isDebugging ? "hide" : "show"} debugger
              </button>
            </FooterControls>
          </PreviewPanel>
        </ResizablePanel>

        <ResizeHandle />

        <ResizablePanel
          minSize={20}
          collapsible
          onCollapse={(collapsed) => update({ isDebugging: !collapsed })}
          ref={debuggerAPI}
        >
          {state.isDebuggingSupported ? (
            <PanelGroup
              autoSaveId="react-pdf-repl-debug-info"
              direction="horizontal"
            >
              <ResizablePanel>
                {layout && (
                  <ScrollBox>
                    <DebugFont>
                      <Tree nodes={[layout]} />
                    </DebugFont>
                  </ScrollBox>
                )}
              </ResizablePanel>
              <ResizeHandle />
              <ResizablePanel>
                <ScrollBox>
                  <DebugInfo>
                    {selectedNode && selectedNode.style && (
                      <Styles>
                        <pre>
                          {Object.entries(selectedNode.style)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join("\n")}
                        </pre>
                      </Styles>
                    )}

                    {selectedNode && (
                      <BoxInfo>
                        <BoxSizing box={selectedNode.box} />
                      </BoxInfo>
                    )}
                  </DebugInfo>
                </ScrollBox>
              </ResizablePanel>
            </PanelGroup>
          ) : (
            <EmptyDebugger>{`Debugger doesn't supported by this @react-pdf/renderer version`}</EmptyDebugger>
          )}
        </ResizablePanel>
      </PanelGroup>
    </ResizablePanel>
  );

  return (
    <ClientOnly>
      {isMobile ? (
        <PanelGroup
          key="mobile"
          autoSaveId="react-pdf-repl-mobile"
          direction="vertical"
        >
          {viewerPanel}
          <ResizeHandle />
          {editorPanel}
        </PanelGroup>
      ) : (
        <PanelGroup
          key="desktop"
          autoSaveId="react-pdf-repl"
          direction="horizontal"
        >
          {editorPanel}
          <ResizeHandle />
          {viewerPanel}
        </PanelGroup>
      )}
    </ClientOnly>
  );
};

export default Repl;
