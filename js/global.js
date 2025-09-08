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
    },
    atualizar(nomeProduto, atualizacoes) {
        const produtos = this.produtos();

        for (const produto of produtos) {
            if (produto.nome === nomeProduto) {
                for (const [k, v] of Object.entries(atualizacoes)) {
                    produto[k] = v;
                }
                
                produto.preco = Number(produto.preco);
                produto.quantidade = Number(produto.quantidade);
            }
        }

        localStorage.setItem("carrinho", JSON.stringify(produtos));
    },
    esvaziar() {
        localStorage.setItem("carrinho", "[]");
    }
};

const modal = {
    dom() {
        return document.querySelector("#modal");
    },
    mostrar({
        titulo = "",
        corpo = "",
        rodape = ""
    }) {
        const modalEl = this.dom();
        modalEl.querySelector(".modal-title").innerHTML = titulo;
        modalEl.querySelector(".modal-body").innerHTML = corpo;
        modalEl.querySelector(".modal-footer").innerHTML = rodape;
        $(modalEl).modal("show");
    },
    fechar() {
        const modalEl = this.dom();
        $(modalEl).modal("hide");
    }
};

const usuario = {
    dados() {
        let usuario = localStorage.getItem("usuario");
        if (!usuario) return null;
        usuario = JSON.parse(usuario);
        return usuario;
    },
    salvar(dados) {
        localStorage.setItem("usuario", JSON.stringify(dados));
    }
};

const toast = {
    sucesso(msg) {
        bulmaToast.toast({
            message: msg,
            type: "toast text-bg-success"
        });
    },
    erro(msg) {
        bulmaToast.toast({
            message: msg,
            type: "toast text-bg-danger"
        });
    }
};
