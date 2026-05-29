const pedidos =
JSON.parse(
localStorage.getItem("historico")
) || [];

const historico =
document.getElementById("historico");

if(pedidos.length === 0){

  historico.innerHTML =
  "<p>Nenhum pedido encontrado.</p>";

}else{

  pedidos.reverse().forEach(pedido => {

    historico.innerHTML += `

      <div class="card">

        <div class="card-content">

          <h3>
            Pedido #${pedido.numero}
          </h3>

          <p>
            ${pedido.data}
          </p>

          <p>
            Status:
            ${pedido.status}
          </p>

          <h4>
            R$ ${pedido.total.toFixed(2)}
          </h4>

        </div>

      </div>

    `;

  });

}