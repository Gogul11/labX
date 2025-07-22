import type { IpcMainInvokeEvent } from 'electron'
import express, {type Request, type Response} from 'express'
import {Server} from 'socket.io';
import { createServer } from "http";
import multer from 'multer'
import path from 'path';
import cors from 'cors'

export const startServer = (
    _event : IpcMainInvokeEvent,
    roomId : string,
    roomName : string,
    portNo : string,
    storageDir : string
) => {

    const app = express()
    const labXSever = createServer(app)
    const io = new Server(labXSever, {
        cors : {
            origin : "*",
            methods : ["GET", "POST"]
        }
    })

    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }));

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

            if(!joinedStudentsList.has(regNo)){
                console.log(name, regNo, roomId, socket.id)
                joinedStudentsList.set(regNo, {
                    name : name,
                    rollNo : regNo,
                    startTime : new Date(),
                })
            }

            if(adminSocketId){
                socket.join('student-room')
                socket.emit('joined-response')
                socket.to('admin-room').emit('joined-studs', {name, regNo})
                console.log('hi from backend')
            }
            else{
                socket.emit('join-failed', { message : "Either host down or Server is not initialized.."})
            }
            
        })
        
        socket.on('admin-join', () => {
            adminSocketId = socket.id
            socket.join('admin-room')
            console.log("Admin joined:", socket.id);
        })
        // socket.on('disconnect')
    })


    app.get("/test", (req : Request, res : Response) => {
        console.log(joinedStudentsList)
        res.status(200).json({test : "success"})
    })


    //Zip file handling
    const zipFileStorage = multer.diskStorage({
        destination : storageDir,
        filename : (req, file, cb) => {
            cb(null, req.body.regNo + '-' + roomId + '.zip')
        }
    })

    const zipUpload = multer({storage : zipFileStorage})

    app.post("/commit", zipUpload.single('zipfile'),(req : Request, res : Response) => {
        const { regNo } = req.body
        const uploadedZipFile = req.file

        if(!joinedStudentsList.has(regNo))
            return res.status(200).json({success : 1, message : `${regNo} is not joined in the room, Either wrong register number or Try rejoining`})

        if(!uploadedZipFile)
            return res.status(200).json({success : 2, message : 'Missing Zip file'})

        console.log("📁 File saved at:", path.join(storageDir, uploadedZipFile.filename));
        console.log(regNo)

         return res.status(200).json({ success : 3, message: "Commit received successfully" });

    })

    labXSever.listen(parseInt(portNo), '0.0.0.0',() => {
        console.log("server is running", portNo)
        console.log("dir : ", storageDir)
    })
}