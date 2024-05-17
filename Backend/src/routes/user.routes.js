import { Router } from "express";
import {createUser , peerConnection , reciverDataStoreage , closeConnection} from '../controllers/Connection.controller.js'

const router=Router()

// router.post("/connect",connection)
router.post("/create/user",createUser)
router.post("/connect/user",peerConnection)

export default router