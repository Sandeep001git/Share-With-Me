import { Router } from "express";
import {createUser} from '../controllers/Connection.controller.js'

const router=Router()

// router.post("/connect",connection)
router.get("/user",createUser)

export default router