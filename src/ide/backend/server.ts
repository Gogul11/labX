import type { IpcMainInvokeEvent } from 'electron'
import express, {type Request, type Response} from 'express'
import {Server} from 'socket.io';
import { createServer } from "http";
import multer from 'multer'
import path from 'path';
import fs from 'fs'
import cors from 'cors'
import AdmZip from 'adm-zip';

interface FileData {
  name: string;
  url: string;
}

export const startServer = (
    _event : IpcMainInvokeEvent,
    roomId : string,
    _roomName : string,
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
            { name: string; rollNo: string; startTime: Date; endTime?: Date, status : "active" | "ended" | "disconnected", zippedPath ?: string }
            >();

    const broadcastedFiles : FileData[]= [];
    
    io.on('connection', (socket) => {
        console.log(socket.id)

        //admin-join
        socket.on('admin-join', () => {
            adminSocketId = socket.id
            socket.join('admin-room')
            console.log("Admin joined:", socket.id);
        })

        //Student-join
        socket.on('join', ({name, regNo, roomId}) => {
            if(roomId !== currentRoomId){
                socket.disconnect(true)
                return
            }
            socket.data.regNo = regNo;
            
            if(!joinedStudentsList.has(regNo)){
                console.log(name, regNo, roomId, socket.id)
                joinedStudentsList.set(regNo, {
                    name : name,
                    rollNo : regNo,
                    startTime : new Date(),
                    status : "active"
                })
            }
            else {
                const rejoinStud = joinedStudentsList.get(regNo)
                if(rejoinStud){
                    if(rejoinStud?.status === 'ended'){
                        socket.emit('rejoin-failed', { message: "You cannot rejoin after ending the session." })
                        console.log('rejoin failed')
                        socket.disconnect(true)
                        return;
                    }
                    else{
                        rejoinStud.status = "active";
                        joinedStudentsList.set(regNo, rejoinStud)
                        console.log("stud-rejoined", rejoinStud);
                        socket.to('admin-room').emit('joined-studs', 
                        Array.from(joinedStudentsList.entries())
                        .map(([regNo , student]) => ({
                            regNo : regNo,
                            name : student.name,
                            startTime : student.startTime,
                            endTime : student.endTime,
                            status : student.status
                        })))
                    }   
                }
            }

            if(adminSocketId){
                socket.join('student-room')
                socket.emit('joined-response')
                socket.to('admin-room').emit('joined-studs', 
                    Array.from(joinedStudentsList.entries())
                    .map(([regNo , student]) => ({
                        regNo : regNo,
                        name : student.name,
                        startTime : student.startTime,
                        endTime : student.endTime,
                        status : student.status
                })))
                console.log('hi from backend')
            }
            else{
                socket.emit('join-failed', { message : "Either host down or Server is not initialized.."})
            }
            
        })

        socket.on('refresh-students', () => {
            socket.to('admin-room').emit('joined-studs', 
                    Array.from(joinedStudentsList.entries())
                    .map(([regNo , student]) => ({
                        regNo : regNo,
                        name : student.name,
                        startTime : student.startTime,
                        endTime : student.endTime,
                        status : student.status
            })))
        })

        //get student join
        socket.on('get-student-folder', (regNo) => {
            console.log('get-student-folder', regNo);

            const student = joinedStudentsList.get(regNo);

            if (!student) {
                socket.emit('student-not-found');
            } else if (!student.zippedPath) {
                socket.emit('student-folder-not-found');
            } else {
                socket.emit('student-folder-found', student.zippedPath);
            }
        });

        //Chat
        socket.on("chatMessage", ({ roll, message }) => {
            socket.broadcast.emit("messageReply", message, roll);
        });


        //end-student
        socket.on('end-session', ({regNo}) => {
            console.log(regNo)
            const stud = joinedStudentsList.get(regNo)
            if(stud){
                stud.endTime = new Date(),
                stud.status = "ended",
                joinedStudentsList.set(regNo, stud)
                socket.to('admin-room').emit('joined-studs', 
                    Array.from(joinedStudentsList.entries())
                    .map(([regNo , student]) => ({
                        regNo : regNo,
                        name : student.name,
                        startTime : student.startTime,
                        endTime : student.endTime,
                        status : student.status
                })))
                socket.leave('student-room')
                socket.disconnect(true)
                console.log(`${regNo} ended the session`);
            }

        })
        
        

        socket.on('disconnect', (reason) => {
            const regNo = socket.data.regNo;
            console.log(regNo)
            if(!regNo) return;

            const stud = joinedStudentsList.get(regNo)
            if(stud){
                if(stud.status !== 'ended'){
                    stud.status = 'disconnected',
                    joinedStudentsList.set(regNo, stud)
                    socket.to('admin-room').emit('joined-studs', 
                    Array.from(joinedStudentsList.entries())
                    .map(([regNo , student]) => ({
                        regNo : regNo,
                        name : student.name,
                        startTime : student.startTime,
                        endTime : student.endTime,
                        status : student.status
                    })))
                    console.log(`${regNo} has disconnected`);
                }
            }
        })
    })


    //test for develop10.16.32.194ment
    app.get("/test", (_req : Request, res : Response) => {
        console.log(joinedStudentsList)
        res.status(200).json({test : "success"})
    })

    //Checks whether a student is present in the room or not
    app.post("/check", (req : Request, res : Response) => {
        try {     
            const {regNo} = req.body
            if(joinedStudentsList.has(regNo))
                return res.status(200).json({success : 1})
            return res.status(200).json({success : 2})
        } catch (error) {
            console.log(error)
            return res.status(404).json({message : error})
        }
    })




    //Comitin logic
    const zipUpload = multer({dest : storageDir})

    app.post("/commit", zipUpload.single('zipfile'),(req : Request, res : Response) => {
        try {
            
            const { regNo } = req.body
            const uploadedZipFile = req.file

            if(!joinedStudentsList.has(regNo))
                return res.status(200).json({success : 1, message : `${regNo} is not joined in the room, Either wrong register number or Try rejoining`})

            if(!uploadedZipFile)
                return res.status(200).json({success : 2, message : 'Missing Zip file'})

            const newFileName = `${regNo}-${roomId}`
            const newPath = path.join(storageDir, newFileName)

            // fs.renameSync(uploadedZipFile.path, newPath)
            if(!fs.existsSync(newPath)){
                fs.mkdirSync(newPath, {recursive : true})
            }

            const admZip = new AdmZip(uploadedZipFile.path)
            admZip.extractAllTo(newPath, true)

            fs.unlinkSync(uploadedZipFile.path)

            const exsisting = joinedStudentsList.get(regNo)
            if(exsisting){
                joinedStudentsList.set(regNo, {
                    ...exsisting,
                    zippedPath : newPath
                })
            }
            
            return res.status(200).json({ success : 3, message: "Commit received successfully" });
        } catch (error) {
            console.log(error)
            return res.status(404).json({message : error})
        }
    })

    const upload = path.join(storageDir, 'uploads')
    if(!fs.existsSync(upload)){
        fs.mkdirSync(upload)
    }

    const broadCastedUpload = multer({dest : upload})
    app.use("/files", express.static(upload));

    app.post("/upload", broadCastedUpload.single("file"), (req: Request, res: Response) => {
        try{

            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            const newPath = path.join(upload, req.file.originalname)
             fs.renameSync(req.file.path, newPath)
            const fileData = {
                name: req.file.originalname,
                url: `/files/${req.file.originalname}`
            };
            
            broadcastedFiles.push(fileData)
            
            res.status(200).json({success : true});
        }
        catch(err){
            console.log(err)
            return res.status(404).json({message : err})
        }
    });

    app.get('/getFiles', (_req : Request, res : Response) => {
        try {
            return res.status(200).json({success : true, files : broadcastedFiles})
        } catch (error) {
            return res.status(404).json({message : error})
        }
    })



    labXSever.listen(parseInt(portNo), '0.0.0.0',() => {
        console.log("server is running", portNo)
        console.log("dir : ", storageDir)
    })
}