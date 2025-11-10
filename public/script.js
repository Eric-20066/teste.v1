const listaEl = document.getElementById("lista");
let numeros = [];


async function carregar() {
const res = await fetch("/numeros");
numeros = await res.json();
renderizar();
}


function renderizar() {
listaEl.innerHTML = "";


numeros.forEach(n => {
const div = document.createElement("div");
div.className = "numero " + (n.ocupado ? "ocupado" : "livre");
div.textContent = n.valor;


div.onclick = async () => {
if (n.ocupado) return;


const menorLivre = numeros.find(x => !x.ocupado);
if (!menorLivre) return;


if (n.valor !== menorLivre.valor) {
alert(`Você só pode selecionar o número: ${menorLivre.valor}`);
return;
}


const ok = confirm(`Deseja selecionar o número ${n.valor}?`);
if (!ok) return;


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