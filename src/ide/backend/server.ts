import type { IpcMainInvokeEvent } from 'electron'
import express, {type Request, type Response} from 'express'


export const startServer = (
    _event : IpcMainInvokeEvent
) => {

    const app = express()
    
    app.get("/test", (req : Request, res : Response) => {
        res.status(200).json({test : "success"})
    })

    app.listen(5000, () => {
        console.log("server is running")
    })
}