const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const axios = require('axios');


const OPENAI_API_KEY = "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"; // Tu clave API
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/ask', async (req, res) => {
    const userQuestion = req.body.question.toLowerCase();
    let selectedCar = req.body.selectedCar;
    console.log(`Question ${selectedCar}`);

    // if (selectedCar === null){
    //     return res.json({ response: "Introduzca la palabra \"Agendar\" o seleccione su vehículo." });

    // }

    if (selectedCar === "Car1"){ // Tang EV
        sourceId = "cha_wua3hbptWhvhMN3W1Sfgj";
    }
    else if (selectedCar === "Car2"){ // Han EV
        sourceId = "cha_o1nrlSars2ax4LYBd9a5f";
    }
    else if (selectedCar === "Car3"){ // Yuan Plus EV
        sourceId = "cha_3Re6lgmJs4dmpGdvLDU8P";
    }

    if (selectedCar) {
        try {
            const chatpdfResponse = await axios.post('https://api.chatpdf.com/v1/chats/message', {
                referenceSources: true,
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