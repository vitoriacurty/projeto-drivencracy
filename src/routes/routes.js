import { Router } from "express";
import { createPoll, getPoll } from "../controllers/controller.js";
import { schemaValidation } from "../middlewares/schemaValidation.middleware.js";
import { schemaEnquete } from "../schemas/schemas.js";

const voteRouter = Router()

voteRouter.post("/poll", schemaValidation(schemaEnquete), createPoll)
voteRouter.get("/poll", getPoll)

export default voteRouter