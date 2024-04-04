import { Router } from "express";
import {connection} from '../controllers/Connection.controller.js'

const router=Router()

router.post("/connect",connection)

export default router