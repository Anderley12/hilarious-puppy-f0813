const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método no permitido" };
  }

  try {
    const datosRecibidos = JSON.parse(event.body);
    const mensajeDelUsuario = datosRecibidos.message || datosRecibidos.mensaje;

    const inteligenciaArtificial = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const modeloAI = inteligenciaArtificial.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "Eres el asistente virtual oficial de la Universidad Luis Vargas Torres (UTELVT). Responde siempre en español de manera corta, educada y precisa. Tu único conocimiento se limita a: Información de la institución, Carreras disponibles, Horarios de clases, Servicios universitarios e Información académica en general. Si te preguntan algo ajeno a la universidad, di amablemente que no posees esa información."
    });

    const peticion = await modeloAI.generateContent(mensajeDelUsuario);
    const respuestaAI = await peticion.response;
    const textoRespuesta = respuestaAI.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ respuesta: textoRespuesta }),
    };
  } catch (error) {
    console.error("Error detallado del servidor:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno al procesar la IA." }),
    };
  }
};