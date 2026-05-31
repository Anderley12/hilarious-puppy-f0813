exports.handler = async (event) => {
  try {
    // 1. Verificamos si la clave API existe en Netlify
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { 
        statusCode: 200, 
        body: JSON.stringify({ respuesta: "❌ ERROR: No se encontró la clave GEMINI_API_KEY en las variables de entorno de Netlify." }) 
      };
    }

    // 2. Intentamos conectar con Google
    const datosRecibidos = JSON.parse(event.body);
    const mensaje = datosRecibidos.mensaje || "Hola";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const respuestaGoogle = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: mensaje }] }]
      })
    });

    const datosIA = await respuestaGoogle.json();

    // 3. Si Google devuelve un error, lo mostramos
    if (datosIA.error) {
      return { 
        statusCode: 200, 
        body: JSON.stringify({ respuesta: "❌ GOOGLE API ERROR: " + datosIA.error.message }) 
      };
    }

    // 4. Retornamos la respuesta exitosa
    return {
      statusCode: 200,
      body: JSON.stringify({ respuesta: datosIA.candidates[0].content.parts[0].text }),
    };

  } catch (error) {
    return {
      statusCode: 200, 
      body: JSON.stringify({ respuesta: "❌ ERROR DEL SERVIDOR: " + error.toString() }),
    };
  }
};
