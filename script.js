const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

document.addEventListener('DOMContentLoaded', (event) => {
    displayBotMessage("¡Hola! Soy el asistente virtual de Liverpool. ¿En qué puedo ayudarte? ¿Quieres agendar una cita, obtener ayuda con un manual o algo más?");
});

function displayUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user-message';
    messageDiv.innerText = message;
    chatArea.appendChild(messageDiv);
}

function displayBotMessage(message) {
    // Primero, ocultamos la animación
    document.querySelector('.typing-animation').style.display = 'none';

    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot-message';
    messageDiv.innerText = message;
    chatArea.appendChild(messageDiv);
}

sendBtn.addEventListener('click', async function() {
    const message = userInput.value.trim();
    
    if(message) {
        displayUserMessage(message);

        // Muestra la animación "escribiendo"
        const typingAnimation = document.createElement('div');
        typingAnimation.className = 'typing-animation';
        chatArea.appendChild(typingAnimation);
        
        try {
            const response = await fetch('http://localhost:3000/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: message })
            });

            const data = await response.json();
            displayBotMessage(data.response);
        } catch (error) {
            // En caso de error, también oculta la animación
            document.querySelector('.typing-animation').style.display = 'none';

            console.error("Error fetching response:", error);
            displayBotMessage("Lo siento, hubo un error procesando tu pregunta. Por favor, inténtalo de nuevo más tarde.");
        }
    }
    
    userInput.value = '';  // Limpiar el input
});
