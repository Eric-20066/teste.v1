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
return JSON.parse(fs.readFileSync(DADOS_PATH, "utf8"));
}


function salvarDados(dados) {
fs.writeFileSync(DADOS_PATH, JSON.stringify(dados, null, 2), "utf8");
}


app.use(express.static(path.join(__dirname, "public")));


// GET — envia em ordem crescente
app.get("/numeros", (req, res) => {
const dados = lerDados();
dados.numeros.sort((a,b) => a.valor - b.valor);
res.json(dados.numeros);
});


// POST — ordem estrita
app.post("/toggle", (req, res) => {
const valor = Number(req.body.valor);
const dados = lerDados();


const lista = dados.numeros.sort((a,b) => a.valor - b.valor);


const menorLivre = lista.find(n => !n.ocupado);


if (!menorLivre) return res.json({ ok:false, msg:"Todos ocupados." });


if (valor !== menorLivre.valor)
return res.json({ ok:false, msg:`Você só pode selecionar o número ${menorLivre.valor}` });


const numero = lista.find(n => n.valor === valor);
if (!numero) return res.json({ ok:false, msg:"Não encontrado" });


numero.ocupado = true;
salvarDados({ numeros: lista });


res.json({ ok:true, numero });
});


app.post("/repopular", (req, res) => {
const arr = [];
for (let v = 5500; v <= 7009; v++) arr.push({ valor: v, ocupado:false });
salvarDados({ numeros: arr });
res.json({ ok:true });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));