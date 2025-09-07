document.addEventListener("DOMContentLoaded", () => {
    atualizarCarrinho();
});

function atualizarCarrinho() {
    const produtos = carrinho.produtos();
    const listaCarrinho = document.querySelector("#lista-carrinho");
    const carrinhoVazio = document.querySelector("#carrinho-vazio");
    
    listaCarrinho.innerHTML = "";

    const formatador = new Intl.NumberFormat("pt-br", {
        style: "currency",
        currency: "BRL" 
    });

    for (const produto of produtos) {
        let preco = formatador.format(produto.preco);
        let quantidade = produto.quantidade || 1;
        let step = 1;
        let min = 1;
        
        if (produto.unidade === "kg") {
            preco += " / kg";
            step = 0.001;
            min = 0.001;
            quantidade = quantidade.toFixed(3);
        }

        listaCarrinho.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img 
                        class="img-thumbnail me-3" 
                        src="${produto.imagem}" 
                        alt="${produto.nome}" 
                        style="width: 80px;"
                    >
                    <div>
                        <h5 class="mb-1">${produto.nome}</h5>
                        <small>${preco}</small>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <div class="d-flex align-items-center gap-1">
                        <input 
                            type="number" 
                            class="form-control me-2" 
                            style="width: 80px;"
                            oninput="formatarQuantidade(this, '${produto.unidade}')"
                            value="${quantidade}" 
                            min="${min}"
                            step="${step}"
                            data-item="maca"
                        >
                        <span>${produto.unidade}</span>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="removerProduto('${produto.nome}')">
                        Remover
                    </button>
                </div>
            </li>

        `;
    }

    if (produtos.length === 0) {
        carrinhoVazio.classList.remove("d-none");
    } else {
        carrinhoVazio.classList.add("d-none");
    }
}

function formatarQuantidade(input, unidade) {
    if (unidade === "kg") {
        input.value = Number(input.value).toFixed(3);
    } else {
        input.value = parseInt(input.value) || 1;
    }
}

function removerProduto(nomeProduto) {
}