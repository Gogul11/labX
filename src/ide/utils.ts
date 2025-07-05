import { BrowserWindow } from "electron";
import fs from 'fs'

export const contextMenuItems = (win : BrowserWindow, filePath : string) => [
    {
        label: 'New file',
        click: () => {
            win.webContents.send('new-file-folder', false)
        },
    },
    {
        label: 'New folder',
        click: () => {
            win.webContents.send('new-file-folder', true)
        },
    },
    {
        label: 'Rename',
        click: () => {
            const isDir = fs.statSync(filePath).isDirectory()
            win.webContents.send('select-rename-file-folder')
        },
    },
    {
        label: 'Delete',
        click: () => {
        console.log('delete');
        },
    },
    {
        label: 'Copy',
        click: () => {
        console.log('copy');
        },
    },
    {
        label: 'Paste',
        click: () => {
        console.log('paste');
        },
    },
    {
        label: 'Cut',
        click: () => {
        console.log('cut');
        },
    },
];