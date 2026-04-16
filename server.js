require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 465,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Endpoint de contacto
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: process.env.CONTACT_EMAIL,
            subject: `Nuevo mensaje de contacto de: ${name}`,
            html: `<h3>Nuevo mensaje de ÓleoNatura</h3>
                   <p><strong>Nombre:</strong> ${name}</p>
                   <p><strong>Correo:</strong> ${email}</p>
                   <p><strong>Mensaje:</strong><br>${message.replace(/\n/g, '<br>')}</p>`,
            replyTo: email
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Correo enviado exitosamente' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
});

// Endpoint del Chatbot de IA - PERSONALIZADO PARA ÓLEONATURA
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Mensaje requerido.' });

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey || apiKey === "TU_LLAVE_AQUI") {
            return res.status(500).json({ error: 'Configura tu API Key en el archivo .env' });
        }

        const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `Tu nombre es ÓleoBot. Eres el experto oficial de ÓleoNatura en Barranquilla. 
                        NO eres un asistente general. Solo sabes sobre bienestar natural y aceites vegetales.
                        
                        CONTEXTO DE LA TIENDA (index.html):
                        - Lema: "Bienestar integral con la pureza del Aceite Vegetal".
                        - Propósito: Cuidado personal, uso culinario y hogar con productos 100% naturales.
                        - Ubicación: Ciudad Natura, Av. Verde 123.
                        - Contacto: contacto@oleonatura.com.

                        REGLAS DE RESPUESTA:
                        1. Saluda siempre como ÓleoBot 🌿.
                        2. Si preguntan por productos, enfócate en la nutrición celular y bienestar físico.
                        3. Si preguntan por temas que no sean de la tienda (como tecnología o historia), di amablemente que solo eres experto en la esencia pura de la naturaleza.
                        4. Sé breve, amable y usa emojis de plantas ✨.`
                    },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await groqResponse.json();
        res.status(200).json({ reply: data.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error inesperado al procesar la petición.' });
    }
});

app.listen(port, () => {
    console.log(`===============================================`);
    console.log(`🚀 Servidor ÓleoNatura corriendo en: http://localhost:${port}`);
    console.log(`===============================================`);
});