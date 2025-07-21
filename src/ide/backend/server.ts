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

    const joinedStudentsList = new Map<
            string,
            { name: string; rollNo: string; startTime: Date; endTime?: Date }
            >();
    
    io.on('connection', (socket) => {
        socket.on('join', ({name, regNo, roomId}) => {
            if(roomId !== currentRoomId){
                socket.disconnect(true)
                return
            }

            if(!joinedStudentsList.has(socket.id)){
                console.log(name, regNo, roomId, socket.id)
                joinedStudentsList.set(socket.id, {
                    name : name,
                    rollNo : regNo,
                    startTime : new Date(),
                })
            }

            if(adminSocketId){
                socket.emit('joined-response')
                socket.to(adminSocketId).emit('joined-studs', {name, regNo})
                console.log('hi from backend')
            }
            else{
                socket.emit('join-failed', { message : "Either host down or Server is not initialized.."})
            }
            
        })
        
        socket.on('admin-join', () => {
            adminSocketId = socket.id
            console.log("Admin joined:", socket.id);
        })
        // socket.on('disconnect')
    })


    app.get("/test", (req : Request, res : Response) => {
        console.log(joinedStudentsList)
        res.status(200).json({test : "success"})
    })

    labXSever.listen(parseInt(portNo), '0.0.0.0',() => {
        console.log("server is running", portNo)
    })
}