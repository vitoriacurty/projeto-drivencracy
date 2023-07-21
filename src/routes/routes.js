import { Router } from "express";
import { createChoice, createPoll, createVote, getChoice, getPoll, getResult } from "../controllers/controller.js";
import { schemaValidation } from "../middlewares/schemaValidation.middleware.js";
import { schemaEnquete, schemaOpcaoDeVoto } from "../schemas/schemas.js";

const voteRouter = Router()

voteRouter.post("/poll", schemaValidation(schemaEnquete), createPoll)
voteRouter.get("/poll", getPoll)
voteRouter.post("/choice", schemaValidation(schemaOpcaoDeVoto), createChoice)
voteRouter.get("/poll/:id/choice", getChoice)
voteRouter.post("/choice/:id/vote", createVote)
voteRouter.get("/poll/:id/result", getResult)

export default voteRouter