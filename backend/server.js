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
});

const Loja = mongoose.model("Loja", {
  nome: String,
  cronometros: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cronometro" }],
});

app.use(cors());
app.use(bodyParser.json());

// Rota para criar um cronômetro associado a uma loja
app.post("/api/cronometros/:lojaId", async (req, res) => {
  try {
    const { nome, tempo } = req.body;
    const startTime = new Date();
    const cronometro = new Cronometro({ nome, tempo, startTime });

    // Encontrar a loja pelo ID
    const loja = await Loja.findById(req.params.lojaId);

    if (!loja) {
      return res.status(404).json({ error: "Loja não encontrada." });
    }

    // Adicionar o ID do cronômetro à array de cronômetros da loja
    loja.cronometros.push(cronometro._id);

    // Salvar as alterações na loja e no cronômetro
    await loja.save();
    await cronometro.save();

    res.json(cronometro);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar cronômetro." });
  }
});

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
// ...

// Rota para criar uma nova loja
app.post("/api/lojas", async (req, res) => {
  try {
    const { nome } = req.body;
    const loja = new Loja({ nome });
    await loja.save();
    res.json(loja);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar loja." });
  }
});

// Rota para buscar todas as lojas
app.get("/api/lojas", async (req, res) => {
  try {
    const lojas = await Loja.find();
    res.json(lojas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar lojas." });
  }
});

// Rota para buscar uma loja específica pelo ID
app.get("/api/lojas/:id", async (req, res) => {
  try {
    const loja = await Loja.findById(req.params.id);
    res.json(loja);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar loja." });
  }
});

// Rota para atualizar uma loja pelo ID
app.put("/api/lojas/:id", async (req, res) => {
  try {
    const { nome } = req.body;
    const loja = await Loja.findByIdAndUpdate(req.params.id, { nome }, { new: true });
    res.json(loja);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar loja." });
  }
});

// Rota para excluir uma loja pelo ID
app.delete("/api/lojas/:id", async (req, res) => {
  try {
    await Loja.findByIdAndRemove(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir loja." });
  }
});

// ...

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
