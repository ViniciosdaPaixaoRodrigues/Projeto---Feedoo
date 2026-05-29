const carrinho =
JSON.parse(localStorage.getItem("carrinho")) || [];

const resumoPedido =
document.getElementById("resumo-pedido");

const totalGeral =
document.getElementById("total-geral");

let total = 0;

if(carrinho.length === 0){

  resumoPedido.innerHTML = `
    <p>Nenhum item encontrado.</p>
  `;

}else{

  const itensAgrupados = {};

  carrinho.forEach(item => {

    if(!itensAgrupados[item.id]){
      itensAgrupados[item.id] = {
        ...item,
        quantidade: 0
      };
    }

    itensAgrupados[item.id].quantidade++;
  });

  Object.values(itensAgrupados).forEach(item => {

    const subtotal =
    item.preco * item.quantidade;

    total += subtotal;

    resumoPedido.innerHTML += `
      <div class="item-resumo">

        <span>
          ${item.nome}
          x${item.quantidade}
        </span>

        <strong>
          R$ ${subtotal.toFixed(2)}
        </strong>

      </div>
    `;
  });
}

totalGeral.innerText =
total.toFixed(2);

// FINALIZAR PEDIDO
document
.getElementById("checkout-form")
.addEventListener("submit", function(e){

  e.preventDefault();

  alert("Pedido realizado com sucesso!");

  localStorage.removeItem("carrinho");

  window.location.href =
  "catalogo.html";

});

const pagamento =
document.getElementById("pagamento");

const parcelamentoBox =
document.getElementById("parcelamento-box");

const parcelamento =
document.getElementById("parcelamento");

pagamento.addEventListener("change", atualizarParcelamento);

function atualizarParcelamento(){

  parcelamento.innerHTML = "";

  if(
    pagamento.value === "CREDITO" &&
    total >= 150
  ){

    parcelamentoBox.classList.remove("hidden");

    parcelamento.innerHTML = `
      <option value="1">
        1x de R$ ${total.toFixed(2)}
      </option>

      <option value="2">
        2x de R$ ${(total/2).toFixed(2)}
      </option>

      <option value="3">
        3x de R$ ${(total/3).toFixed(2)}
      </option>
    `;

  }else{

    parcelamentoBox.classList.add("hidden");

  }

}

atualizarParcelamento();