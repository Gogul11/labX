const extensionToMonacoLanguageMap: Record<string, string> = {
  // Web
  "html": "html",
  "htm": "html",
  "css": "css",
  "scss": "scss",
  "less": "less",
  "js": "javascript",
  "jsx": "javascriptreact",
  "ts": "typescript",
  "tsx": "javascriptreact",

  // C/C++
  "c": "c",
  "cpp": "cpp",
  "cc": "cpp",
  "cxx": "cpp",
  "h": "cpp",
  "hpp": "cpp",

  // Java / C#
  "java": "java",
  "cs": "csharp",

  // Python / Go / Ruby
  "py": "python",
  "go": "go",
  "rb": "ruby",

  // Shell
  "sh": "shell",
  "bash": "shell",

  // PHP, Rust, Swift
  "php": "php",
  "rs": "rust",
  "swift": "swift",

  // SQL, JSON, YAML
  "sql": "sql",
  "json": "json",
  "yml": "yaml",
  "yaml": "yaml",

  // Markdown & Docs
  "md": "markdown",
  "xml": "xml",

  // Config & Misc
  "toml": "toml",
  "ini": "ini",
  "dockerfile": "dockerfile",
  "makefile": "makefile",
  "env": "properties",
  "gitignore": "properties",

  // Text
  "txt": "plaintext",
  "log": "plaintext",
};


export function getMonacoLanguageFromExtension(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  return extensionToMonacoLanguageMap[ext] || 'plaintext';
}