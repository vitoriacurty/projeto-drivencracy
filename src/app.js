import express from "express"
import cors from "cors"
import voteRouter from "./routes/routes.js"

const app = express()
app.use(cors())
app.use(express.json())
app.use(voteRouter)

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`))