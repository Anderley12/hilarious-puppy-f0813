exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Método no permitido" };

  try {
    const datosRecibidos = JSON.parse(event.body);
    const mensajeDelUsuario = datosRecibidos.mensaje || "Hola";
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return { statusCode: 200, body: JSON.stringify({ respuesta: "❌ Error: API Key no configurada." }) };

    // CAMBIO AQUÍ: Usamos el modelo 2.0 Flash-Lite oficial
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;
    
    const respuestaGoogle = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Eres el asistente oficial de la UTELVT. Responde brevemente: ${mensajeDelUsuario}` }] }]
      })
    });

    const datosIA = await respuestaGoogle.json();

    if (datosIA.error) {
       return { statusCode: 200, body: JSON.stringify({ respuesta: "❌ Error: " + datosIA.error.message }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ respuesta: datosIA.candidates[0].content.parts[0].text }),
    };

  } catch (error) {
    return { statusCode: 200, body: JSON.stringify({ respuesta: "❌ Error interno: " + error.message }) };
  }
};
