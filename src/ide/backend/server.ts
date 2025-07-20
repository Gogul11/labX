import type { IpcMainInvokeEvent } from 'electron'
import express, {type Request, type Response} from 'express'
import {Server} from 'socket.io';
import { createServer } from "http";

export const startServer = (
    _event : IpcMainInvokeEvent,
    roomId : string
) => {

    const app = express()
    const labXSever = createServer(app)
    const io = new Server(labXSever)

    const currentRoomId = roomId
    
    io.on('connection', (socket) => {
        socket.on('join', ({username, room}) => {
            if(room !== currentRoomId){
                socket.disconnect(true)
                return
            }

            console.log(username, room)
        })
    })


    app.get("/test", (req : Request, res : Response) => {
        res.status(200).json({test : "success"})
    })

    labXSever.listen(5000, () => {
        console.log("server is running")
    })
}