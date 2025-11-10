const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const DADOS_PATH = path.join(__dirname, "dados.json");

function lerDados() {
  if (!fs.existsSync(DADOS_PATH)) return { numeros: [] };
  const txt = fs.readFileSync(DADOS_PATH, "utf8");
  try {
    return JSON.parse(txt);
  } catch (e) {
    console.error("Erro ao parsear dados.json:", e);
    return { numeros: [] };
  }
}

function salvarDados(dados) {
  const temp = DADOS_PATH + ".tmp";
  fs.writeFileSync(temp, JSON.stringify(dados, null, 2), "utf8");
  fs.renameSync(temp, DADOS_PATH);
}

app.use(express.static(path.join(__dirname, "public")));

app.get("/numeros", (req, res) => {
  const dados = lerDados();
  res.json(dados.numeros || []);
});

app.post("/toggle", (req, res) => {
  const valor = Number(req.body.valor);
  if (!Number.isFinite(valor)) {
    return res.status(400).json({ erro: "valor inválido" });
  }

  const dados = lerDados();
  const numero = dados.numeros.find(n => n.valor === valor);

  if (!numero) {
    return res.status(404).json({ erro: "número não encontrado" });
  }

  numero.ocupado = !numero.ocupado;

  try {
    salvarDados(dados);
    res.json({ ok: true, numero });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "falha ao salvar" });
  }
});

app.post("/repopular", (req, res) => {
  const start = Number(req.body.start) || 5500;
  const end = Number(req.body.end) || 7000;

  const arr = [];
  for (let v = start; v <= end; v++) {
    arr.push({ valor: v, ocupado: false });
  }

  salvarDados({ numeros: arr });

  res.json({ ok: true, qtd: arr.length });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
