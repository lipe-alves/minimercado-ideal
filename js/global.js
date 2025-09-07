const carrinho = {
    produtos() {
        const produtos = JSON.parse(localStorage.getItem("carrinho") || "[]");
        return produtos;
    },
    adicionar(produto) {
        const produtos = this.produtos();
        produto.preco = Number(produto.preco);
        produto.quantidade = 1;
        produtos.push(produto);
        localStorage.setItem("carrinho", JSON.stringify(produtos));
    },
    remover(nomeProduto) {
        let produtos = this.produtos();
        produtos = produtos.filter(p => p.nome !== nomeProduto);
        localStorage.setItem("carrinho", JSON.stringify(produtos));
    },
    contem(nomeProduto) {
        const produtos = this.produtos();
        const contem = produtos.some(p => p.nome === nomeProduto);
        return contem;
    }
};

const modal = {
    dom() {
        return document.querySelector(".modal");
    },
    
    mostrar({
        titulo,
        corpo,
        rodape
    }) {
        modal.querySelector(".modal-title").innerHTML = titulo;
        modal.querySelector(".modal-body").innerHTML = corpo;
        modal.querySelector(".modal-footer").innerHTML = rodape;
    }
};