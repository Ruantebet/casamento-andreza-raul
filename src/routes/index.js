const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dadosCasamento = {
    noivos: "Andreza e Raul",
    data: "28 de Novembro de 2026",
    dataObj: "2026-11-28T16:00:00",
    verso: "“O coração do homem planeja o seu caminho, mas o Senhor lhe dirige os passos.” — Provérbios 16:9",
    historiaTexto: "Somos de lugares totalmente diferentes e o destinos nos juntou. Nos conhecemos na faculdade em 2018 e desde o primeiro contato nossa aproximação e união é plano de Deus. É indescritível, é único e verdadeiro. São quase 8 anos de grande momentos, grandes conquistas, amizade e amor. E agora estamos dando o passo mais importante do nosso relacionamento, o casamento…",
    cerimonia: {
        local: "Capela de Nossa Senhora da Boa Viagem",
        endereco: "Estância, Sergipe",
        horario: "16h",
        mapaEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.866743745952!2d-37.422188324555784!3d-11.297799588852122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x70x719d8a668450553%3A0xc62f8562e3b7c3a2!2sCapela%20de%20Nossa%20Senhora%20da%20Boa%20Viagem!5e0!3m2!1spt-BR!2sbr!4v1699900000000!5m2!1spt-BR!2sbr"
    },
    recepcao: {
        local: "Casa Gahulu",
        endereco: "Estância, Sergipe",
        mapaEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.0135274008185!2d-37.4179369245559!3d-11.285553988859847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x719d8bc0312c6a9%3A0x8e1f1c1c1c1c1c1c!2sCasa%20Gahulu!5e0!3m2!1spt-BR!2sbr!4v1699900100000!5m2!1spt-BR!2sbr"
    },
    presentes: [
        { id: 1, nome: "Jogo de panelas de cerâmica", link: "https://www.mercadolivre.com.br/jogo-de-panelas-ceramica-tramontina-10-pecas-antiaderente/up/MLBU4850446659", comprado: false },
        { id: 2, nome: "Frigideira grande de cerâmica", link: "https://www.mercadolivre.com.br/frigideira-ceramica-antiaderente-grande-fogao-inducao-30cm-bege/p/MLB77365700", comprado: false },
        { id: 3, nome: "Panela de pressão", link: "https://www.mercadolivre.com.br/panela-de-pressao-brinox-pressure-421-20-x-145-cm-vanilla-baunilha/p/MLB22663071", comprado: false },
        { id: 4, nome: "Jogo de taças", link: "https://www.mercadolivre.com.br/p/MLB66426957", comprado: false },
        { id: 5, nome: "Conjunto Garrafa + Copos de vidro", link: "https://www.mercadolivre.com.br/conjunto-garrafa-de-vidro-aqua-suco-c-6-copos-tampa-madeira-transparente/p/MLB73061454", comprado: false },
        { id: 6, nome: "Jogo de facas", link: "https://www.mercadolivre.com.br/tramontina-jogo-de-facas-plenus-com-6-pecas-em-aco-inox-e-suporte-de-madeira/p/MLB27490685", comprado: false },
        { id: 7, nome: "Jogo de marinex", link: "https://www.mercadolivre.com.br/p/MLB28025230", comprado: false },
        { id: 8, nome: "Toalhas de banho", link: "https://produto.mercadolivre.com.br/MLB-6210960302-kit-3-pecas-toalhas-teka-comfort-2-banho-mais-1-rosto-_JM", comprado: false },
        { id: 9, nome: "Lixeira de inox Tramontina (banheiro)", link: "https://www.mercadolivre.com.br/lixeira-tramontina-loop-de-12-litros-em-aco-inoxidavel-com-acabamento-polido-e-balde-interno/p/MLB53799872", comprado: false },
        { id: 10, nome: "Talheres Tramontina", link: "https://www.mercadolivre.com.br/tramontina-faqueiro-laguna-aco-inox-brilhoso-36-pecas/p/MLB32486245", comprado: false },
        { id: 11, nome: "Liquidificador", link: "https://www.mercadolivre.com.br/liquidificador-philco-1200w-31-12-velocidades-preto-ph900/p/MLB15578941", comprado: false },
        { id: 12, nome: "Sanduicheira/grill", link: "https://www.mercadolivre.com.br/grill-arno-dual-inox-180-abertura-placas-antiaderentes-cor-preto-110v/p/MLB70611281", comprado: false },
        { id: 13, nome: "Cafeteira elétrica", link: "https://www.mercadolivre.com.br/cafeteira-eletrica-electrolux-digital-38-xicaras-experience-programavel-com-timer-cor-inox-ecm30/p/MLB18723192", comprado: false },
        { id: 14, nome: "Aparelho de jantar 20 peças", link: "https://www.mercadolivre.com.br/aparelho-de-jantar-e-cha-donna-lirios-20-pecas-biona/p/MLB32633848", comprado: false },
        { id: 15, nome: "Jogo de Canecas", link: "https://www.mercadolivre.com.br/conjunto-de-6-uni-260ml-ryo-maresia/p/MLB25576807", comprado: false },
        { id: 16, nome: "Boleira", link: "https://www.mercadolivre.com.br/boleira-26-cm-oxford-flat-duna-off-white/p/MLB65413878", comprado: false },
        { id: 17, nome: "Air fryer", link: "https://www.mercadolivre.com.br/fritadeira-airfryer-serie-1000-xl-na13000-preto/p/MLB52188249", comprado: false },
        { id: 18, nome: "Cooktop", link: "https://www.mercadolivre.com.br/cooktop-itamaxi-itatiaia-5-bocas-preto/p/MLB43514330", comprado: false },
        { id: 19, nome: "Jogo de lençol king size", link: "https://www.mercadolivre.com.br/jogo-de-lencol-king-size-algodao-200-fios-4-pecas-branco-stinely-casa/p/MLB52704527", comprado: false },
        { id: 20, nome: "Edredom/colcha king size", link: "https://www.mercadolivre.com.br/edredom-ecopluma-king-size-280-x-260-cinza-camesa/p/MLB35682592", comprado: false },
        { id: 21, nome: "Conjunto travessas para servir", link: "https://www.mercadolivre.com.br/marinex-conjunto-de-assadeiras-opaline-6-pecas-branco/p/MLB75501920", comprado: false },
        { id: 22, nome: "Jogo de sobremesa", link: "https://www.mercadolivre.com.br/conjunto-6-tacas-de-sobremesa-250ml-e-bowl-vidro-sun-wolff/p/MLB38003482", comprado: false },
        { id: 23, nome: "Ferro de passar ou vaporizador", link: "https://www.mercadolivre.com.br/ferro-passar-a-vapor-electrolux-easyline-sie70-1200w/p/MLB23034870", comprado: false },
        { id: 24, nome: "Jogo de potes para mantimentos", link: "https://www.mercadolivre.com.br/kit-10-potes-hermeticos-vidro-tampa-bambu-seiri-para-mantimentos-cozinha/p/MLB57492845", comprado: false },
        { id: 25, nome: "Escorredor de louças premium", link: "https://www.mercadolivre.com.br/escorredor-de-louca-2-andares-e-porta-talheres-future-inox-cor-prateado/p/MLB24723202", comprado: false },
        { id: 26, nome: "Utensílios de cozinha", link: "https://www.mercadolivre.com.br/kit-utensilios-jogo-19-pecas-conjunto-em-silicone-de-cozinha/up/MLBU3929476762", comprado: false },
        { id: 27, nome: "Kit escorredor", link: "https://www.mercadolivre.com.br/kit-3-pecas-escorredor-de-arroz-em-inox-escorredor-de-macarrao-inox-grande-escorredor-de-alimentos-mariazinha/p/MLB67424667", comprado: false },
        { id: 28, nome: "Assadeira 34 cm", link: "https://www.mercadolivre.com.br/molde-antiaderente-de-teflon-tramontina-assadeira-cinza-brasileiro-de-34-cm/p/MLB27649798", comprado: false },
        { id: 29, nome: "Kit Vinho", link: "https://www.mercadolivre.com.br/kit-abridor-de-vinho-eletrico-inox-recarregavel-usb/up/MLBU1979761425", comprado: false },
        { id: 30, nome: "Jogo Americano de bambu", link: "https://www.mercadolivre.com.br/jogo-lugar-americano-bambu-cru-8-unidades-mimo-style-promo/up/MLBU601767760", comprado: false },
        { id: 31, nome: "Jogo de potes Tramontina", link: "https://www.mercadolivre.com.br/jogo-de-potes-para-alimentos-tramontina-341-7-pecas/up/MLBU3957282958", comprado: false }
    ]
};

router.get('/', (req, res) => {
    const pastaImg = path.join(__dirname, '../public/img');
    let fotosAlbum = [];

    try {
        const ficheiros = fs.readdirSync(pastaImg);
        fotosAlbum = ficheiros
            .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
            .map(file => {
                const nomeLower = file.toLowerCase();
                if (nomeLower.includes('casal') || nomeLower.includes('monograma')) {
                    return null;
                }

                // Como os nomes são hashes, definimos a sessão como 'ensaio' por defeito
                // para aparecerem logo no álbum principal
                let sessao = 'ensaio';
                if (nomeLower.includes('noivado')) sessao = 'noivado';
                if (nomeLower.includes('viagem')) sessao = 'viagens';

                return {
                    src: `/img/${file}`,
                    sessao: sessao,
                    legenda: 'Andreza & Raul'
                };
            })
            .filter(Boolean);
    } catch (error) {
        console.error('Erro ao ler a pasta de imagens:', error);
    }

    res.render('index', {
        ...dadosCasamento,
        fotos: fotosAlbum
    });
});

router.post('/presentear/:id', (req, res) => {
    const idPresente = parseInt(req.params.id);
    const presente = dadosCasamento.presentes.find(p => p.id === idPresente);
    
    if (presente) {
        presente.comprado = true;
    }
    
    res.redirect('/#presentes');
});

module.exports = router;