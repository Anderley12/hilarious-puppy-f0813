// ==========================================
// MÓDULO 1: CHATBOT INSTITUCIONAL INTELIGENTE (GEMINI)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const botonChat = document.getElementById('boton-chat');
    const ventanaChat = document.getElementById('ventana-chat');
    const botonCerrar = document.getElementById('boton-cerrar');
    const botonEnviar = document.getElementById('boton-enviar');
    const entradaUsuario = document.getElementById('entrada-usuario');

    // Mostrar u ocultar ventana flotante
    if (botonChat) {
        botonChat.addEventListener('click', () => {
            ventanaChat.classList.toggle('d-none');
        });
    }

    if (botonCerrar) {
        botonCerrar.addEventListener('click', () => {
            ventanaChat.classList.add('d-none');
        });
    }

    if (botonEnviar) {
        botonEnviar.addEventListener('click', procesarMensaje);
    }

    if (entradaUsuario) {
        entradaUsuario.addEventListener('keypress', (evento) => {
            if (evento.key === 'Enter') {
                procesarMensaje();
            }
        });
    }
});

async function procesarMensaje() {
    const campoTexto = document.getElementById('entrada-usuario');
    const mensajeTexto = campoTexto.value.trim();

    if (!mensajeTexto) return;

    // Mostrar mensaje del usuario (esUsuario = true)
    dibujarMensajeEnPantalla(mensajeTexto, true);
    campoTexto.value = "";

    try {
        const respuestaServidor = await fetch('/.netlify/functions/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mensaje: mensajeTexto })
        });

        const datos = await respuestaServidor.json();

        if (respuestaServidor.ok) {
            dibujarMensajeEnPantalla(datos.respuesta, false);
        } else {
            dibujarMensajeEnPantalla('Lo siento, no pude procesar eso ahora.', false);
        }
    } catch (error) {
        dibujarMensajeEnPantalla('Error de conexión con el servidor.', false);
    }
}

// Dibuja los mensajes usando TUS estilos de style.css (.user-msg y .bot-msg)
function dibujarMensajeEnPantalla(texto, esUsuario) {
    const cajaMensajes = document.getElementById('caja-mensajes');
    const contenedorMensaje = document.createElement('div');

    // Selecciona tus clases según quién escribe
    const claseTipo = esUsuario ? 'user-msg' : 'bot-msg bg-white';

    // Aplica tu clase .chat-msg que controla el tamaño y la fuente
    contenedorMensaje.className = `chat-msg ${claseTipo} p-2 rounded-3 shadow-sm mb-3`;

    const textoFormateado = texto.replace(/\n/g, '<br>');
    contenedorMensaje.innerHTML = textoFormateado;

    cajaMensajes.appendChild(contenedorMensaje);
    cajaMensajes.scrollTop = cajaMensajes.scrollHeight;
}


// ==========================================
// MÓDULO 2: SIMULADOR ACADÉMICO (INNOVACIÓN)
// ==========================================
function calcularProyeccion() {
    const p1 = parseFloat(document.getElementById('p1').value);
    const p2 = parseFloat(document.getElementById('p2').value);
    const alertBox = document.getElementById('contenedor-resultado');

    alertBox.className = "mt-4 alert d-none border-0 shadow-sm";

    if (isNaN(p1) || isNaN(p2) || p1 < 0 || p1 > 10 || p2 < 0 || p2 > 10) {
        alertBox.innerText = "Error: Las calificaciones ingresadas deben estar comprendidas estrictamente en la escala matemática de 0 a 10.";
        alertBox.classList.add('alert-danger');
        alertBox.classList.remove('d-none');
        return;
    }

    const acumulado = p1 + p2;
    const requeridoExamen = 21 - acumulado;

    alertBox.classList.remove('d-none');

    if (requeridoExamen > 10) {
        alertBox.innerHTML = `<strong>Diagnóstico Crítico:</strong> Has acumulado ${acumulado.toFixed(2)} pts. Necesitarías obtener un valor de <strong>${requeridoExamen.toFixed(2)}</strong> en el examen de fin de ciclo. Condición: Reprobación inminente o examen de gracia.`;
        alertBox.classList.add('alert-danger');
    } else if (requeridoExamen <= 0) {
        alertBox.innerHTML = `<strong>Diagnóstico Exitoso:</strong> Registras un acumulado de ${acumulado.toFixed(2)} pts. <strong>¡Asignatura aprobada automáticamente!</strong> Ya cumples la base requerida.`;
        alertBox.classList.add('alert-success');
    } else {
        alertBox.innerHTML = `<strong>Proyección de Estudio:</strong> Registras un acumulado de ${acumulado.toFixed(2)} pts. Estás en zona de evaluación. Necesitas una nota mínima de <strong>${requeridoExamen.toFixed(2)} / 10</strong> en tu examen final para aprobar la asignatura.`;
        alertBox.classList.add('alert-info');
    }
}

// ==========================================
// MÓDULO 3: JUEGO DE TRIVIA ACADÉMICA
// ==========================================
const datasetPreguntas = [
    { q: "¿Cuál es el paradigma de programación enfocado en objetos y clases?", o: ["Estructural", "Funcional", "Orientado a Objetos", "Declarativo"], a: 2 },
    { q: "¿En qué semestre se imparte la materia de programación avanzada?", o: ["Primer Semestre", "Quinto Semestre", "Noveno Semestre", "Tercer Semestre"], a: 2 },
    { q: "En redes de datos, ¿qué protocolo asegura la transmisión confiable?", o: ["UDP", "TCP", "IPX", "ICMP"], a: 1 }
];

let indicePregunta = 0;
let score = 0;

function comenzarTrivia() {
    document.getElementById('pantalla-inicio').classList.add('d-none');
    document.getElementById('pantalla-resultados').classList.add('d-none');
    document.getElementById('pantalla-juego').classList.remove('d-none');
    indicePregunta = 0;
    score = 0;
    renderizarPregunta();
}

function renderizarPregunta() {
    if (indicePregunta >= datasetPreguntas.length) {
        finalizarTrivia();
        return;
    }

    document.getElementById('retroalimentacion').innerText = "";
    const pct = (indicePregunta / datasetPreguntas.length) * 100;
    document.getElementById('barra-progreso').style.width = `${pct}%`;

    const item = datasetPreguntas[indicePregunta];
    document.getElementById('texto-pregunta').innerText = item.q;

    const box = document.getElementById('caja-opciones');
    box.innerHTML = "";

    item.o.forEach((opc, idx) => {
        const btn = document.createElement('button');
        btn.className = "btn btn-outline-success text-start py-2 px-3 fw-medium";
        btn.innerText = `${idx + 1}. ${opc}`;
        btn.onclick = () => evaluarRespuesta(idx);
        box.appendChild(btn);
    });
}

function evaluarRespuesta(seleccionado) {
    const feedback = document.getElementById('retroalimentacion');
    const correcto = datasetPreguntas[indicePregunta].a;

    const btns = document.getElementById('caja-opciones').getElementsByTagName('button');
    for (let b of btns) b.disabled = true;

    if (seleccionado === correcto) {
        score++;
        feedback.className = "mt-3 text-center fw-bold fs-5 text-success";
        feedback.innerText = "¡Validación Correcta! ✔️";
    } else {
        feedback.className = "mt-3 text-center fw-bold fs-5 text-danger";
        feedback.innerText = "Error en el postulado. ❌";
    }

    setTimeout(() => {
        indicePregunta++;
        renderizarPregunta();
    }, 1200);
}

function finalizarTrivia() {
    document.getElementById('pantalla-juego').classList.add('d-none');
    const fin = document.getElementById('pantalla-resultados');
    fin.classList.remove('d-none');
    document.getElementById('puntuacion-final').innerText = `Tu puntaje final es de: ${score} / ${datasetPreguntas.length} respuestas correctas.`;
}

// ==========================================
// MÓDULO 4: RECONOCIMIENTO BIOMÉTRICO (EMOCIONES)
// ==========================================

const video = document.getElementById('webcam');
let totalDetecciones = 0;
let detectorActivo = false;

async function cargarModelosIA() {
    try {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('./assets/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('./assets/models')
        ]);
        console.log("Modelos IA cargados correctamente");
    } catch (error) {
        console.error("Error cargando modelos:", error);
        alert("No se pudieron cargar los modelos de Inteligencia Artificial.");
    }
}

async function iniciarSistema() {
    if (detectorActivo) return;
    const btn = document.getElementById('btn-stream');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Inicializando IA...';
    btn.disabled = true;

    try {
        await cargarModelosIA();
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        detectorActivo = true;
        btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sistema Activo';
        detectarEmociones();
    } catch (error) {
        console.error(error);
        alert("No se pudo acceder a la cámara.");
        btn.innerHTML = '<i class="fa-solid fa-camera"></i> Activar Cámara';
        btn.disabled = false;
    }
}

function detectarEmociones() {
    setInterval(async () => {
        if (!video.srcObject) return;

        const detecciones = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();

        if (detecciones.length > 0) {
            const emociones = detecciones[0].expressions;
            let emocion = 'Neutral 😐';
            let precision = 0;

            for (const key in emociones) {
                if (emociones[key] > precision) {
                    precision = emociones[key];
                    emocion = traducirEmocion(key);
                }
            }

            const caja = document.getElementById('emocion');
            const porcentaje = document.getElementById('porcentaje');

            if (caja) caja.innerText = emocion;
            if (porcentaje) porcentaje.innerText = 'Precisión: ' + (precision * 100).toFixed(2) + '%';

            totalDetecciones++;
            actualizarEstadisticas(emocion);
        }
    }, 1500);
}

function traducirEmocion(valor) {
    switch (valor) {
        case 'happy': return 'Alegría 😀';
        case 'sad': return 'Tristeza 😢';
        case 'angry': return 'Enojo 😡';
        case 'surprised': return 'Sorpresa 😲';
        default: return 'Neutral 😐';
    }
}

function actualizarEstadisticas(emocion) {
    const total = document.getElementById('total');
    const ultima = document.getElementById('ultima');
    if (total) total.innerText = totalDetecciones;
    if (ultima) ultima.innerText = emocion;
}

function manual(emocion) {
    const manualResultado = document.getElementById('manualResultado');
    if (manualResultado) {
        manualResultado.innerText = 'Emoción seleccionada: ' + emocion;
    }
    totalDetecciones++;
    actualizarEstadisticas(emocion);
}

// ==========================================
// RECONOCIMIENTO POR IMAGEN
// ==========================================

const imagenInput = document.getElementById('imagenInput');

if (imagenInput) {
    imagenInput.addEventListener('change', async () => {
        const archivo = imagenInput.files[0];
        if (!archivo) return;

        const preview = document.getElementById('preview');
        preview.src = URL.createObjectURL(archivo);
        preview.classList.remove('d-none');

        preview.onload = async () => {
            const deteccion = await faceapi
                .detectSingleFace(preview, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();

            const resultado = document.getElementById('resultadoImagen');

            if (deteccion) {
                const emociones = deteccion.expressions;
                let emocion = 'Neutral 😐';
                let precision = 0;

                for (const key in emociones) {
                    if (emociones[key] > precision) {
                        precision = emociones[key];
                        emocion = traducirEmocion(key);
                    }
                }

                resultado.innerText = emocion + ' - ' + (precision * 100).toFixed(2) + '%';
                totalDetecciones++;
                actualizarEstadisticas(emocion);
            } else {
                resultado.innerText = 'No se detectó rostro';
            }
        };
    });
}