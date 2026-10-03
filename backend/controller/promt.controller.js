import OpenAI from "openai";
import { Promt } from "../model/promt.model.js";

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY
})
console.log(openai.apiKey)

export const sendPromt = async (req, res) => {
    const { content } = req.body
    const userId=req.userId

    if (!content || content.trim() === '') {
        return res.status(400).json({ errors: "Promt content is required" })
    }
    try {

        // save user promt
        const userPromt = await Promt.create({
            userId,
            role: "user",
            content
        })

        // send OpenAI
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: content }],
            model: 'inclusionai/ling-3.1-flash'
        });
        const aiContent = completion.choices[0].message.content

        // save assistant promt
        const aiMessage = await Promt.create({
            userId,
            role: "assistant",
            content: aiContent
        })
        return res.status(200).json({ reply: aiContent })
    } catch (error) {
        console.log("Error in promt: ", error)
        return res.status(500).json({ error: "Something went wrong with the AI response" })
    }
}