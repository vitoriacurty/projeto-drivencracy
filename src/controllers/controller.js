import dayjs from "dayjs"
import { ObjectId } from "mongodb"
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

export async function createChoice(req, res) {
    const { title, pollId } = req.body

    try {
        const existingPoll = await db.collection("poll").findOne({ _id: new ObjectId(pollId) })
        if (!existingPoll) {
            return res.sendStatus(404)
        }

        const existingOption = await db.collection("choice").findOne({ title })
        if (existingOption) {
            return res.sendStatus(409)
        }

        // status 403
        if (dayjs(existingPoll.expireAt).isBefore(dayjs())) {
            return res.sendStatus(403)
        }

        await db.collection("choice").insertOne({ title, pollId })
        res.sendStatus(201)
    } catch (err) {
        res.status(500).sednd(err.message)
    }
}

export async function getChoice(req, res) {
    const { id } = req.params

    try {
        const polls = await db.collection("poll").findOne({ _id: new ObjectId(id) })
        if (!polls) {
            return res.sendStatus(404)
        }

        const voteOption = await db.collection("choice").find({ pollId: id }).toArray()
        res.send(voteOption)
    } catch (err) {
        res.status(500).send(err.message)
    }
}