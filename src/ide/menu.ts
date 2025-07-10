import { BrowserWindow, type MenuItemConstructorOptions, shell } from 'electron';

export const MenuTemplate = (mainWindow: BrowserWindow): MenuItemConstructorOptions[] => {
  const isMac = process.platform === 'darwin';

  return [
    ...(isMac
      ? [
          {
            label: 'LabX',
            submenu: [
              { role: 'about' as const },
              { type: 'separator' as const },
              { role: 'services' as const },
              { type: 'separator' as const },
              { role: 'hide' as const },
              { role: 'hideOthers' as const },
              { role: 'unhide' as const },
              { type: 'separator' as const },
              { role: 'quit' as const },
            ],
          },
        ]
      : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'New File',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-file');
          },
        },
        {
          label: 'Open File...',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow.webContents.send('menu-open-file');
          },
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('menu-save');
          },
        },
        { type: 'separator' as const },
        ...(isMac ? [{ role: 'close' as const }] : [{ role: 'quit' as const }]),
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' as const },
        { role: 'redo' as const },
        { type: 'separator' as const },
        { role: 'cut' as const },
        { role: 'copy' as const },
        { role: 'paste' as const },
        ...(isMac
          ? [
              { role: 'pasteAndMatchStyle' as const },
              { role: 'delete' as const },
              { role: 'selectAll' as const },
            ]
          : [
              { role: 'delete' as const },
              { type: 'separator' as const },
              { role: 'selectAll' as const },
            ]),
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Sidebar',
          accelerator: 'CmdOrCtrl+B',
          click: () => {
            mainWindow.webContents.send('menu-toggle-sidebar');
          },
        },
        {
          label: 'Toggle Terminal',
          accelerator: 'CmdOrCtrl+K',
          click: () => {
            mainWindow.webContents.send('menu-toggle-terminal');
          },
        },
        {
          label: 'Color Theme',
          submenu: [
            {
              label: 'Light',
              type: 'radio',
              click: () => {
                mainWindow.webContents.send('theme-change', 'light');
              },
            },
            {
              label: 'Dark',
              type: 'radio',
              click: () => {
                mainWindow.webContents.send('theme-change', 'dark');
              },
            },
            {
              label: 'System',
              type: 'radio',
              checked: true,
              click: () => {
                mainWindow.webContents.send('theme-change', 'system');
              },
            },
          ],
        },
        { type: 'separator' as const },
        { role: 'reload' as const },
        { role: 'forceReload' as const },
        { role: 'toggleDevTools' as const },
        { type: 'separator' as const },
        { role: 'resetZoom' as const },
        { role: 'zoomIn' as const },
        { role: 'zoomOut' as const },
        { type: 'separator' as const },
        { role: 'togglefullscreen' as const },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'GitHub Repo',
          click: async () => {
            await shell.openExternal('https://github.com/Gogul11/labx');
          },
        },
        {
          label: 'Report Issue',
          click: async () => {
            await shell.openExternal('https://github.com/Gogul11/labx/issues');
          },
        },
      ],
    },
  ];
};
