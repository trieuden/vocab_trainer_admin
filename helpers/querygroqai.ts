import groq from "./configgroqal";

const queryGroqAI = async (prompt: string, model = "llama-3.1-8b-instant") => {
    try {
        const res = await groq.chat.completions.create({
            model: model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 100,
            top_p: 1,
        });
        
        return res.choices[0]?.message?.content || null;
    } catch (err) {
        console.log('Groq API Error:', err);
        throw err;
    }
};

export default queryGroqAI;