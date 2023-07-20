import { Router } from "express";
import { createChoice, createPoll, getPoll } from "../controllers/controller.js";
import { schemaValidation } from "../middlewares/schemaValidation.middleware.js";
import { schemaEnquete, schemaOpcaoDeVoto } from "../schemas/schemas.js";

const voteRouter = Router()

voteRouter.post("/poll", schemaValidation(schemaEnquete), createPoll)
voteRouter.get("/poll", getPoll)
voteRouter.post("/choice", schemaValidation(schemaOpcaoDeVoto), createChoice)

export default voteRouter