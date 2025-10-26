import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Servidor de envio de e-mails (Vercel) está rodando 🚀");
});

app.post("/send-email", async (req, res) => {
  const { from_name, reply_to, message } = req.body;
  if (!from_name || !reply_to || !message) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${from_name}" <${reply_to}>`,
      to: process.env.DESTINO_EMAIL,
      subject: "Novo contato via Currículo Inteligente",
      text: message,
    });

    res.status(200).json({ success: true, message: "E-mail enviado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Erro ao enviar o e-mail." });
  }
});

export default app;
