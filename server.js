import express from "express";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

app.post("/upload", async (req, res) => {
  try {
    const { image } = req.body;

    const base64 = image.split(",")[1];
    const buffer = Buffer.from(base64, "base64");

    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("photo", buffer, { filename: "photo.png" });

    await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
      form,
      { headers: form.getHeaders() }
    );

    res.send("sent");
  } catch (err) {
    console.error("Telegram error:", err.response?.data || err);
    res.status(500).send("error");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
