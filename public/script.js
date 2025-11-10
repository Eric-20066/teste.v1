const listaEl = document.getElementById("lista");
let numerosCache = [];


async function carregar() {
const res = await fetch("/numeros");
const dados = await res.json();
numerosCache = dados;
renderizar();
}


function renderizar() {
listaEl.innerHTML = "";
numerosCache.forEach(n => {
const div = document.createElement("div");
div.className = "numero " + (n.ocupado ? "ocupado" : "livre");
div.textContent = n.valor;


div.onclick = async () => {
if (n.ocupado) return;
await fetch("/toggle", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ valor: n.valor })
});
carregar();
};


listaEl.appendChild(div);
});
}


carregar();