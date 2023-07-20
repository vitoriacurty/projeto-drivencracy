import dayjs from "dayjs"
import { db } from "../database/db.connection.js"

export async function createPoll(req, res) {
    const { title, expireAt } = req.body

    if (!expireAt) {
        expireAt = dayjs().add(30, "day").format("YYYY-MM-DD HH:mm") //ex: const b = a.add(7, 'day')
    }

    try {
        await db.collection("poll").insertOne({ title, expireAt })
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getPoll(req, res) {
    try {
        const polls = await db.collection("poll").find().toArray()
        res.send(polls)
    } catch (err) {
        res.status(500).send(err.message)
    }
}