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

export async function createVote(req, res) {
    const { id } = req.params

    try {
        const existingOption = await db.collection("choice").findOne({ _id: new ObjectId(id) })
        if (!existingOption) {
            return res.sendStatus(404)
        }

        const expiredPoll = await db.collection("poll").findOne({ _id: new ObjectId(existingOption.pollId) })
        if (dayjs(expiredPoll.expireAt).isBefore(dayjs())) {
            return res.sendStatus(403)
        }

        const registerVote = {
            createdAt: dayjs().format("YYYY-MM-DD HH:mm"),
            choiceId: existingOption._id
        }
        await db.collection("vote").insertOne(registerVote)
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function getResult(req, res) {
    const { id } = req.params

    try {
        const existingPoll = await db.collection("poll").findOne({ _id: new ObjectId(id) })
        console.log("teste2", existingPoll)

        if (!existingPoll) {
            return res.sendStatus(404)
        }

        const options = await db.collection("choice").find({ pollId: id }).toArray()
        console.log("teste1", options)

        const results = await Promise.all(
            options.map(async (option) => {
                const vote = await db.collection("vote").find({ choiceId: new ObjectId(option._id) }).toArray();
                return { title: option.title, votes: vote.length }
            })
        )

        results.sort((a, b) => b.votes - a.votes)

        const obj = {
            _id: existingPoll._id,
            title: existingPoll.title,
            expireAt: existingPoll.expireAt,
            result: {
                title: results[0].title,
                votes: results[0].votes
            }
        }

        return res.status(201).send(obj)
    } catch (err) {
        return res.status(500).send(err.message)
    }
}


