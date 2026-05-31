exports.handler = async (event) => {
  // 1. Solo permitir peticiones POST
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Método no permitido" };

  try {
    // 2. Extraer el mensaje del usuario
    const datosRecibidos = JSON.parse(event.body);
    const mensajeDelUsuario = datosRecibidos.mensaje || "Hola";
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return { statusCode: 200, body: JSON.stringify({ respuesta: "❌ Error: La clave API no está configurada en Netlify." }) };
    }

    // 3. URL del modelo (Usamos gemini-1.5-flash porque es el oficial y compatible)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    // 4. Llamada a la API de Google
    const respuestaGoogle = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ 
            parts: [{ text: `Eres el asistente oficial de la universidad UTELVT. Responde de forma breve y educada únicamente temas sobre la universidad: ${mensajeDelUsuario}` }] 
        }]
      })
    });

    const datosIA = await respuestaGoogle.json();

    // 5. Verificación de seguridad por si Google devuelve error
    if (datosIA.error) {
       return { statusCode: 200, body: JSON.stringify({ respuesta: "❌ Error de Google: " + datosIA.error.message }) };
    }
    
    if (!datosIA.candidates || datosIA.candidates.length === 0) {
      return { statusCode: 200, body: JSON.stringify({ respuesta: "No obtuve una respuesta, intenta de nuevo." }) };
    }

    // 6. Retornar respuesta exitosa
    return {
      statusCode: 200,
      body: JSON.stringify({ respuesta: datosIA.candidates[0].content.parts[0].text }),
    };

  } catch (error) {
    return { statusCode: 200, body: JSON.stringify({ respuesta: "❌ Error interno: " + error.message }) };
  }
};
