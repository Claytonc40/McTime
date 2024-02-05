const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3001;

mongoose.connect(
  "mongodb+srv://clayton_c40:81045782@cluster0.0qpnh90.mongodb.net/cronometros",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const Cronometro = mongoose.model("Cronometro", {
  nome: String,
  tempo: Number,
  startTime: Date,
  initialStartTime: Date,
  isPaused: Boolean,
});

app.use(cors());
app.use(bodyParser.json());

// Rota para buscar todos os cronômetros
app.get("/api/cronometros", async (req, res) => {
  try {
    const cronometros = await Cronometro.find();
    res.json(cronometros);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar cronômetros." });
  }
});

// Rota para buscar um cronômetro específico
app.get("/api/cronometros/:id", async (req, res) => {
  try {
    const cronometro = await Cronometro.findById(req.params.id);
    res.json(cronometro);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar cronômetro." });
  }
});

// Rota para atualizar um cronômetro
app.put("/api/cronometros/:id", async (req, res) => {
  try {
    const { seconds, startTime, isPaused, initialStartTime } = req.body;
    const cronometro = await Cronometro.findByIdAndUpdate(
      req.params.id,
      { tempo: seconds, startTime, isPaused, initialStartTime },
      { new: true }
    );
    res.json(cronometro);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar cronômetro." });
  }
});

// Rota para criar um novo cronômetro
app.post("/api/cronometros", async (req, res) => {
  try {
    const { nome, tempo } = req.body;
    const startTime = new Date();
    const cronometro = new Cronometro({
      nome,
      tempo,
      startTime,
      initialStartTime: startTime,
      isPaused: true,
    });
    await cronometro.save();
    res.json(cronometro);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar cronômetro." });
  }
});

/// Rota para excluir um cronômetro
app.delete("/api/cronometros/:id", async (req, res) => {
  try {
    const cronometro = await Cronometro.findByIdAndDelete(req.params.id);
    res.json(cronometro);
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir cronômetro." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
