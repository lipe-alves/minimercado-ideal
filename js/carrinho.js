document.addEventListener("DOMContentLoaded", () => {
    atualizarCarrinho();
    atualizarContagens();

    const dadosUsuario = usuario.dados();
    const camposEndereco = ["cep", "rua", "numero", "bairro", "cidade", "complemento"];

    if (dadosUsuario) {
        for (const campo of camposEndereco) {
            document.querySelector(`#${campo}`).value = dadosUsuario[campo] || "";
        }
    }

    document.querySelector("#retirada-local").addEventListener("change", atualizarContagens);
    document.querySelector("#tele-entrega").addEventListener("change", atualizarContagens);
    document.querySelector("#form-carrinho").addEventListener("submit", finalizarCompra);
});

function atualizarCarrinho() {
    const produtos = carrinho.produtos();
    const listaCarrinho = document.querySelector("#lista-carrinho");
    
    listaCarrinho.innerHTML = `
        <li id="carrinho-vazio" class="carrinho-vazio">
            <p>Seu carrinho está vazio.</p>
            <p>Explore nossas categorias para adicionar produtos e serviços!</p>
        </li>
    `;

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
                            onchange="atualizarQuantidade(this, '${produto.nome}')"
                            value="${quantidade}" 
                            min="${min}"
                            step="${step}"
                            data-item="maca"
                        >
                        <span>${produto.unidade}</span>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="confirmarRemoverProduto('${produto.nome}')">
                        Remover
                    </button>
                </div>
            </li>

        `;
    }
    
    const carrinhoVazio = document.querySelector("#carrinho-vazio");
    if (produtos.length === 0) {
        carrinhoVazio.classList.remove("d-none");
    } else {
        carrinhoVazio.classList.add("d-none");
    }
}

function atualizarContagens() {
    const produtos = carrinho.produtos();
    const subtotal = document.querySelector("#subtotal");
    const frete = document.querySelector("#frete");
    const total = document.querySelector("#total");
    const teleEntrega = document.querySelector("#tele-entrega");

    const conts = {
        subtotal: 0,
        frete: teleEntrega.checked ? 10 : 0,
        total: 0
    };

    for (const produto of produtos) {
        conts.subtotal += produto.quantidade * produto.preco;
    }

    const formatador = new Intl.NumberFormat("pt-br", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    conts.total = conts.subtotal + conts.frete;

    subtotal.innerHTML = formatador.format(conts.subtotal);
    frete.innerHTML = formatador.format(conts.frete);
    total.innerHTML = formatador.format(conts.total);
}

function formatarQuantidade(input, unidade) {
    if (unidade === "kg") {
        input.value = Number(input.value).toFixed(3);
    } else {
        input.value = parseInt(input.value) || 1;
    }
}

function confirmarRemoverProduto(nomeProduto) {
    modal.mostrar({
        titulo: `Removendo ${nomeProduto}`,
        corpo: `<p>Tem certeza que deseja remover ${nomeProduto}?</p>`,
        rodape: `
            <button
                type="button"
                class="btn btn-danger"
                data-dismiss="modal"
                onclick="modal.fechar()"
            >
                Cancelar
            </button>
            <button
                type="button"
                class="btn btn-success"
                onclick="removerProduto('${nomeProduto}')"
            >
                Confirmar
            </button>
        `,
    });
}

function removerProduto(nomeProduto) {
    modal.fechar();
    carrinho.remover(nomeProduto);
    atualizarCarrinho();
    atualizarContagens();
}

function atualizarQuantidade(input, nomeProduto) {
    carrinho.atualizar(nomeProduto, { quantidade: input.value });
    atualizarContagens();
}

function finalizarCompra(evt) {
    if (evt) evt.preventDefault();
        
    const produtos = carrinho.produtos();

    if (produtos.length === 0) {
        return toast.erro("Necessário adicionar pelo menos 1 item no carrinho");
    }

    const dadosUsuario = usuario.dados();

    if (!dadosUsuario) {
        modal.mostrar({
            titulo: "Formulário de Cadastro do Cliente",
            corpo: `
                <div class="container">
                    <form id="form-cadastro-cliente" onsubmit="salvarUsuario(event, this)">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="nome" class="form-label">Nome completo <span style="color:red;">*</span></label>
                                <input type="text" class="form-control" id="nome" name="nome" placeholder="Digite seu nome" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="cpf" class="form-label">CPF <span style="color:red;">*</span></label>
                                <input type="text" class="form-control" id="cpf" name="cpf" placeholder="000.000.000-00" required>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="email" class="form-label">E-mail <span style="color:red;">*</span></label>
                                <input type="email" class="form-control" id="email" name="email" placeholder="exemplo@email.com" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="telefone" class="form-label">Telefone <span style="color:red;">*</span></label>
                                <input type="tel" class="form-control" id="telefone" name="telefone" placeholder="(99) 99999-9999" required>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label for="sexo" class="form-label">Sexo <span style="color:red;">*</span></label><br>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="sexo" id="sexo-m" value="Masculino" required>
                                    <label class="form-check-label" for="sexo-m">Masculino</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="sexo" id="sexo-f" value="Feminino">
                                    <label class="form-check-label" for="sexo-f">Feminino</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="sexo" id="sexo-o" value="Outro">
                                    <label class="form-check-label" for="sexo-o">Outro</label>
                                </div>
                            </div>
                            <div class="col-md-8 mb-3">
                                <label for="data-nascimento" class="form-label">Data de Nascimento <span style="color:red;">*</span></label>
                                <input type="date" class="form-control" id="data-nascimento" name="data-nascimento" required>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Preferências de contato:</label><br>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" id="pref-email" name="preferencias" value="email">
                                <label class="form-check-label" for="pref-email">E-mail</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" id="pref-whatsapp" name="preferencias" value="whatsapp">
                                <label class="form-check-label" for="pref-whatsapp">WhatsApp</label>
                            </div>
                        </div>
                    </form>
                </div>
            `,
            rodape: `
                <button class="btn btn-success" onclick="confirmarCadastro()">
                    Cadastrar
                </button>
            `
        });
    } else {
        modal.fechar();
        toast.sucesso("Compra agendada com sucesso!");
        carrinho.esvaziar();
        setTimeout(() => window.location.reload(), 5000);
    }
}

function confirmarCadastro() {
    document.querySelector("#form-cadastro-cliente").requestSubmit();
}

function salvarUsuario(evt, form) {
    evt.preventDefault();

    const formData = new FormData(form);
    const dadosUsuario = Object.fromEntries(formData.entries());

    dadosUsuario.cep = document.querySelector("#cep").value;
    dadosUsuario.rua = document.querySelector("#rua").value;
    dadosUsuario.numero = document.querySelector("#numero").value;
    dadosUsuario.bairro = document.querySelector("#bairro").value;
    dadosUsuario.cidade = document.querySelector("#cidade").value;
    dadosUsuario.complemento = document.querySelector("#complemento").value;

    usuario.salvar(dadosUsuario);

    finalizarCompra();
}
