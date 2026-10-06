document.addEventListener('DOMContentLoaded', () => {
    // 1. Contador Regressivo
    const timerContainer = document.querySelector('.countdown-timer');
    if (timerContainer) {
        const targetDateStr = timerContainer.getAttribute('data-date');
        const dataCasamento = new Date(targetDateStr).getTime();

        const atualizarContagem = () => {
            const agora = new Date().getTime();
            const diferenca = dataCasamento - agora;

            if (diferenca > 0) {
                const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
                const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
                const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

                document.getElementById('dias').innerText = String(dias).padStart(2, '0');
                document.getElementById('horas').innerText = String(horas).padStart(2, '0');
                document.getElementById('minutos').innerText = String(minutos).padStart(2, '0');
                document.getElementById('segundos').innerText = String(segundos).padStart(2, '0');
            }
        };

        setInterval(atualizarContagem, 1000);
        atualizarContagem();
    }

    // 2. Formulário de Confirmação de Presença
    const form = document.getElementById('form-confirmacao');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Presença confirmada com sucesso! Muito obrigado.');
            form.reset();
        });
    }

    // 3. Filtro do Álbum de Fotos por Sessões
    const botoesFiltro = document.querySelectorAll('.btn-filtro');
    const itensAlbum = document.querySelectorAll('.album-item');

    if (botoesFiltro.length > 0 && itensAlbum.length > 0) {
        botoesFiltro.forEach(botao => {
            botao.addEventListener('click', (e) => {
                // Remove a classe ativo de todos os botões e coloca no clicado
                botoesFiltro.forEach(btn => btn.classList.remove('ativo'));
                e.target.classList.add('ativo');

                const sessao = e.target.getAttribute('data-sessao');

                // Mostra ou oculta as fotos com base na categoria
                itensAlbum.forEach(item => {
                    if (sessao === 'todas' || item.getAttribute('data-sessao') === sessao) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
});