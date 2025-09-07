document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#carrossel-categorias [data-link-categoria]").forEach(item => {
        item.addEventListener("click", () => {
            window.location.href = item.dataset.linkCategoria;
        });
    });
});