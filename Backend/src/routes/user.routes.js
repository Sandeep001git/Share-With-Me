import { Router } from "express";
import {createUser , peerConnection , deleteSender , deleteReciver } from '../controllers/Connection.controller.js'

const router=Router()

// router.post("/connect",connection)
router.post("/peerjs/create/user",createUser)
router.post("/connect/user",peerConnection)
router.post("/sender/delete",deleteSender)
router.post("/reciver/delete",deleteReciver)

export default router