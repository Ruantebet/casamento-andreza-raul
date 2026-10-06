document.addEventListener('DOMContentLoaded', () => {
    // 1. Contador Regressivo (Otimizado para evitar piscar)
    const timerContainer = document.querySelector('.countdown-timer');
    if (timerContainer) {
        const targetDateStr = timerContainer.getAttribute('data-date');
        const dataCasamento = new Date(targetDateStr).getTime();

        const atualizarContagem = () => {
            const agora = new Date().getTime();
            const diferenca = dataCasamento - agora;

            const elDias = document.getElementById('dias');
            const elHoras = document.getElementById('horas');
            const elMinutos = document.getElementById('minutos');
            const elSegundos = document.getElementById('segundos');

            if (diferenca > 0) {
                const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
                const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
                const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

                if (elDias) elDias.innerText = String(dias).padStart(2, '0');
                if (elHoras) elHoras.innerText = String(horas).padStart(2, '0');
                if (elMinutos) elMinutos.innerText = String(minutos).padStart(2, '0');
                if (elSegundos) elSegundos.innerText = String(segundos).padStart(2, '0');
            } else {
                if (elDias) elDias.innerText = '00';
                if (elHoras) elHoras.innerText = '00';
                if (elMinutos) elMinutos.innerText = '00';
                if (elSegundos) elSegundos.innerText = '00';
            }
        };

        atualizarContagem(); // Executa de imediato no carregamento para não piscar
        setInterval(atualizarContagem, 1000);
    }

    // 2. Formulário de Confirmação de Presença (Ligado ao Backend/PostgreSQL)
    const form = document.getElementById('form-confirmacao');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Recolhe os dados dos inputs do formulário
            const formData = new FormData(form);
            const dados = Object.fromEntries(formData.entries());

            try {
                // Ajusta '/api/convidados' para corresponder à rota exata configurada no teu Express
                const resposta = await fetch('/api/convidados', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dados)
                });

                if (resposta.ok) {
                    alert('Presença confirmada com sucesso! Muito obrigado.');
                    form.reset();
                } else {
                    alert('Ocorreu um erro ao gravar a tua confirmação. Tenta novamente.');
                }
            } catch (erro) {
                console.error('Erro na requisição:', erro);
                alert('Erro de ligação ao servidor.');
            }
        });
    }

    // 3. Filtro do Álbum de Fotos por Sessões
    const botoesFiltro = document.querySelectorAll('.btn-filtro');
    const itensAlbum = document.querySelectorAll('.album-item');

    if (botoesFiltro.length > 0 && itensAlbum.length > 0) {
        botoesFiltro.forEach(botao => {
            botao.addEventListener('click', (e) => {
                botoesFiltro.forEach(btn => btn.classList.remove('ativo'));
                e.target.classList.add('ativo');

                const sessao = e.target.getAttribute('data-sessao');

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