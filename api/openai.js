import OpenAI from "openai";

export default async function handler(req, res){
    if(req.method !== "POST"){
        return res.status(405).json({error:"Method not allowed"});
    }

    const {prompt} = req.body;
    if(!prompt) return res.status(400).json({error:"Prompt is required"});

    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    try{
        const response = await client.chat.completions.create({
            model: "gpt-4",
            messages: [{role:"user", content: prompt}],
            temperature: 0.7
        });

        const reply = response.choices[0].message.content;
        res.status(200).json({reply});
    }catch(err){
        console.error(err);
        res.status(500).json({error:"OpenAI API request failed"});
    }
}
