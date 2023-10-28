const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const OPENAI_API_KEY = "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"; // Tu clave API
const openai = new OpenAI(OPENAI_API_KEY);

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/ask', async (req, res) => {
    try {
        const userQuestion = req.body.question;
        console.log("Pregunta recibida:", userQuestion);

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "system", 
                    content: "Eres AutoBotMX, el asistente virtual de Liverpool especializado en vehículos eléctricos en México. Tu objetivo es proporcionar información sobre productos, programar pruebas de manejo, resolver consultas sobre mantenimiento, garantías y dudas en general. También puedes ayudar con la elección de vehículos, proporcionar información sobre concesionarios y manuales de usuario, y asistir en problemas postventa. Asegúrate de ofrecer una experiencia excepcional a los usuarios y reflejar los valores y estándares de Liverpool." 
                },
                { role: "user", content: userQuestion }
            ]
        });

        console.log("Respuesta completa de OpenAI:", completion);

        if (completion && completion.choices && completion.choices.length > 0) {
            const responseText = completion.choices[0].message.content;
            res.json({ response: responseText });
        } else {
            console.error("Error al procesar la respuesta de OpenAI:", completion);
            res.status(500).json({ error: "Error al obtener respuesta de OpenAI." });
        }
    } catch (error) {
        console.error("Error al procesar la pregunta:", error);
        res.status(500).json({ error: "Error al procesar la pregunta." });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});