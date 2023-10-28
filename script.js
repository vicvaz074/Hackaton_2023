const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const scheduleBtn = document.querySelector('.schedule-btn');
const scheduleForm = document.querySelector('.form-container');
const modal = document.getElementById("imageModal");
const closeModal = document.getElementById("closeModal");
const uploadImageBtn = document.getElementById("uploadImageBtn");

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
    document.querySelector('.typing-animation').style.display = 'none';
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot-message';
    messageDiv.innerText = message;
    chatArea.appendChild(messageDiv);
}

sendBtn.addEventListener('click', async function() {
    const message = userInput.value.trim();

    if (message) {
        displayUserMessage(message);

        if (message.toLowerCase().includes('agendar') || message.toLowerCase().includes('cita')) {
            displayBotMessage("¡Genial! Por favor, llena el formulario que aparecerá abajo para agendar tu cita.");
            showForm();
            userInput.value = '';
            return;
        }

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
            document.querySelector('.typing-animation').style.display = 'none';
            console.error("Error fetching response:", error);
            displayBotMessage("Lo siento, hubo un error procesando tu pregunta. Por favor, inténtalo de nuevo más tarde.");
        }
    }
    
    userInput.value = '';
});

function showForm() {
    if (scheduleForm.classList.contains('hidden')) {
        scheduleForm.classList.remove('hidden');
        scheduleForm.style.maxHeight = scheduleForm.scrollHeight + "px";
    } else {
        scheduleForm.style.maxHeight = '0';
        setTimeout(() => {
            scheduleForm.classList.add('hidden');
        }, 500);
    }
}

// Inicializar EmailJS
emailjs.init("QGSc5jsPsYfsiYScA");

document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const template_params = {
        "to_name": "Administrador",
        "from_name": "AutoBotMX",
        "message": `Nombre: ${document.getElementById('nombre').value}, Email: ${document.getElementById('email').value}, Celular: ${document.getElementById('cel').value}, Fecha deseada: ${document.getElementById('fecha').value}`
    }

    template_params.to_email = 'vicentito987@gmail.com'; 

    emailjs.send("service_w6lwqo2", "template_1thethc", template_params)
        .then(function (response) {
            console.log('Correo enviado exitosamente!', response.status, response.text);
        }, function (error) {
            console.log('Error al enviar correo:', error);
        });

    document.getElementById('contact-form').reset();
});

scheduleBtn.addEventListener('click', showForm);

userInput.addEventListener('keydown', function(event) {
    if (event.keyCode === 13 && userInput.value.trim() !== '') {  // 13 es el código para la tecla "Enter"
        event.preventDefault();  // Evita el comportamiento predeterminado de "Enter" (como un salto de línea)
        sendBtn.click();  // Simula un clic en el botón de envío
    }
});

// Al hacer clic en el botón de imagen, mostrar el modal
document.getElementById("imageBtn").addEventListener('click', () => {
    modal.style.display = "block";
});

// Al hacer clic en el botón de cerrar (x), cerrar el modal
closeModal.addEventListener('click', () => {
    modal.style.display = "none";
});

// Al hacer clic fuera del modal, cerrarlo
window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

// Aquí puedes agregar la lógica para manejar la imagen y la descripción cuando el usuario haga clic en "Subir"
uploadImageBtn.addEventListener('click', () => {
    const fileInput = document.getElementById("modalImageInput");
    const description = document.getElementById("imageDescription").value;

    // Aquí puedes manejar la imagen y la descripción. Por ejemplo, enviarlos a un servidor.

    // Cerrar el modal después de procesar
    modal.style.display = "none";
});