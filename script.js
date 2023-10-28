const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const scheduleBtn = document.querySelector('.schedule-btn');
const scheduleForm = document.querySelector('.form-container');

var selectedCar = null;

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

car1.addEventListener("click", async function() {
    selectedCar = "Car1"; 
    updateHeaderAndButtonsVisibility(selectedCar);
  });
  
car2.addEventListener("click", async function() {
    selectedCar = "Car2"; 
    updateHeaderAndButtonsVisibility(selectedCar);
});

car3.addEventListener("click", async function() {
    selectedCar = "Car3"; 
    updateHeaderAndButtonsVisibility(selectedCar);
});

returnButton.addEventListener("click", function() {
    handleReturnButtonClick();
    selectedCar = null;
});

function updateHeaderAndButtonsVisibility(carName) {
    // Insert any asynchronous operations here
    document.getElementById("header").innerText = carName;
    document.getElementById("car1").style.display = "none";
    document.getElementById("car2").style.display = "none";
    document.getElementById("car3").style.display = "none";
    document.getElementById("return").style.display = "inline";
}

function handleReturnButtonClick() {
    document.getElementById("header").innerText = "";
    document.getElementById("car1").style.display = "inline";
    document.getElementById("car2").style.display = "inline";
    document.getElementById("car3").style.display = "inline";
    document.getElementById("return").style.display = "none";
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
                body: JSON.stringify({ question: message, selectedCar: selectedCar })
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