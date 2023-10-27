const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const axios = require('axios');

const OPENAI_API_KEY = "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";
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const app = express();

app.use(cors());
app.use(bodyParser.json());

const manuals = {
    'manual 1': { id: 'cha_yUDAKT1pi2eAWWMFuh0W8', description: 'Este manual cubre la introducción básica a los vehículos eléctricos' },
    'manual 2': { id: 'cha_uOQxnZkRqlgneRbDJPSfO', description: 'Este manual aborda temas avanzados sobre mantenimiento y cuidado' },
    // Añade más manuales y sus descripciones según sea necesario
};

const getSourceIdForManual = (question) => {
    for (const [key, value] of Object.entries(manuals)) {
        if (question.toLowerCase().includes(key)) return value.id;
    }
    return null;
}

app.post('/ask', async (req, res) => {
    const userQuestion = req.body.question.toLowerCase();
    console.log("Pregunta recibida:", userQuestion);

    if (userQuestion.includes('qué manuales') || userQuestion.includes('cuáles manuales') || userQuestion.includes('¿Qué manuales tienes?') || userQuestion.includes('¿Cuáles manuales')|| userQuestion.includes('Cuáles manuales tienes?')) {
        const manualDescriptions = Object.entries(manuals).map(([key, value]) => `${key}: ${value.description}`).join(', ');
        return res.json({ response: "Los manuales disponibles son: " + manualDescriptions });
    }

    const sourceId = getSourceIdForManual(userQuestion);
    if (sourceId) {
        try {
            const chatpdfResponse = await axios.post('https://api.chatpdf.com/v1/chats/message', {
                sourceId: sourceId,
                messages: [{ role: "user", content: userQuestion }]
            }, {
                headers: {
                    'x-api-key': 'sec_ehtR2NdH0YIN3XtIQrn0MoweLWojXfW8',
                    'Content-Type': 'application/json',
                }
            });

            if (chatpdfResponse.status === 200) {
                return res.json({ response: chatpdfResponse.data['content'] });
            }
        } catch (error) {
            console.error('Error con chatpdf API:', error);
            return res.status(500).json({ error: "Error al procesar la pregunta del manual." });
        }
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { 
                    role: "system", 
                    content: "Eres AutoBotMX, el asistente virtual de Liverpool especializado en vehículos eléctricos en México." 
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
