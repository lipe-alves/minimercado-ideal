document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('button[data-btn-add-carrinho="true"]').forEach(btn => {
        const produtoCard = btn.closest(".produto-card");
        const produto = {...produtoCard.dataset};

        if (carrinho.contem(produto.nome)) {
            btn.innerText = "Remover do Carrinho";
        }

        btn.addEventListener("click", () => {
            if (carrinho.contem(produto.nome)) {
                carrinho.remover(produto.nome);
                btn.innerText = "Adicionar ao Carrinho";
            } else {
                carrinho.adicionar(produto);
                btn.innerText = "Remover do Carrinho";
            }
        });
    });
});