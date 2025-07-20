import type { IpcMainInvokeEvent } from 'electron'
import express, {type Request, type Response} from 'express'
import {Server} from 'socket.io';
import { createServer } from "http";

export const startServer = (
    _event : IpcMainInvokeEvent,
    roomId : string,
    roomName : string,
    portNo : string
) => {

    const app = express()
    const labXSever = createServer(app)
    const io = new Server(labXSever, {
        cors : {
            origin : "*",
            methods : ["GET", "POST"]
        }
    })

    const currentRoomId = roomId
    let adminSocketId : string | null = null;
    
    io.on('connection', (socket) => {
        socket.on('join', ({name, regNo, roomId}) => {
            if(roomId !== currentRoomId){
                socket.disconnect(true)
                return
            }
            console.log(name, regNo, roomId)
            
        })
        
        socket.on('admin-join', () => {
            adminSocketId = socket.id
            console.log("Admin joined:", socket.id);
        })
    })


    app.get("/test", (req : Request, res : Response) => {
        res.status(200).json({test : "success"})
    })

    labXSever.listen(parseInt(portNo), '0.0.0.0',() => {
        console.log("server is running", portNo)
    })
}