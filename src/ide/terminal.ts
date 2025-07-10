import * as pty from 'node-pty'

const shell = 'bash'

const ptyProcess = pty.spawn(shell, [], {
    name : 'xterm-256color',
    cwd : process.cwd(),
    env : process.env
})

export const initiateTerminal = () => {
    return ptyProcess
}