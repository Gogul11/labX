import * as pty from 'node-pty'

const shell = 'bash'

const ptyProcess= (dir : string) =>( pty.spawn(shell, [], {
    name : 'xterm-256color',
    cwd : dir,
    env : process.env
}))

export const initiateTerminal = (dir : string) => {
    return ptyProcess(dir)
}