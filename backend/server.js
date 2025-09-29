// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rota de teste
app.get("/", (req, res) => {
  res.send("Servidor de envio de e-mails está rodando 🚀");
});

async function startServer() {
  try {
    // Cria o transporter SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // Ex: smtp.gmail.com
      port: Number(process.env.SMTP_PORT), // Ex: 587
      secure: false,
      auth: {
        user: process.env.SMTP_USER, // Seu email
        pass: process.env.SMTP_PASS, // Sua senha ou app password
      },
    });

    // Verifica a conexão SMTP
    await transporter.verify();
    console.log(`SMTP conectado com sucesso!`);

    // Rota para envio de e-mail
    app.post("/send-email", async (req, res) => {
      const { from_name, reply_to, message } = req.body;

      if (!from_name || !reply_to || !message) {
        return res
          .status(400)
          .json({ error: "Todos os campos são obrigatórios." });
      }

      try {
        const mailOptions = {
          from: `"${from_name}" <${reply_to}>`,
          to: process.env.DESTINO_EMAIL,
          subject: "Novo contato via Currículo Inteligente",
          text: message,
        };

        await transporter.sendMail(mailOptions);

        return res
          .status(200)
          .json({ success: true, message: "E-mail enviado com sucesso!" });
      } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        return res
          .status(500)
          .json({ success: false, error: "Erro ao enviar o e-mail." });
      }
    });

    app.listen(PORT, () => {
      console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao conectar SMTP:", error);
    process.exit(1); // Encerra o processo com erro
  }
}

startServer();
