const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Deteção inteligente de SSL (desativado localmente, ativado no Render/Produção)
const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL?.includes('render');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

// Função para garantir que a tabela de presentes existe e está populada no Render
async function garantirTabelas() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS presentes (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                link TEXT,
                comprado BOOLEAN DEFAULT FALSE
            );
        `);

        // Verifica se já existem presentes; se não, insere os itens automaticamente
        const resCount = await pool.query('SELECT COUNT(*) FROM presentes');
        if (parseInt(resCount.rows[0].count) === 0) {
            const presentesIniciais = [
                [1, 'Jogo de panelas de cerâmica', 'https://www.mercadolivre.com.br/jogo-de-panelas-ceramica-tramontina-10-pecas-antiaderente/up/MLBU4850446659'],
                [2, 'Frigideira grande de cerâmica', 'https://www.mercadolivre.com.br/frigideira-ceramica-antiaderente-grande-fogao-inducao-30cm-bege/p/MLB77365700'],
                [3, 'Panela de pressão', 'https://www.mercadolivre.com.br/panela-de-pressao-brinox-pressure-421-20-x-145-cm-vanilla-baunilha/p/MLB22663071'],
                [4, 'Jogo de taças', 'https://www.mercadolivre.com.br/p/MLB66426957'],
                [5, 'Conjunto Garrafa + Copos de vidro', 'https://www.mercadolivre.com.br/conjunto-garrafa-de-vidro-aqua-suco-c-6-copos-tampa-madeira-transparente/p/MLB73061454'],
                [6, 'Jogo de facas', 'https://www.mercadolivre.com.br/tramontina-jogo-de-facas-plenus-com-6-pecas-em-aco-inox-e-suporte-de-madeira/p/MLB27490685'],
                [7, 'Jogo de marinex', 'https://www.mercadolivre.com.br/p/MLB28025230'],
                [8, 'Toalhas de banho', 'https://produto.mercadolivre.com.br/MLB-6210960302-kit-3-pecas-toalhas-teka-comfort-2-banho-mais-1-rosto-_JM'],
                [9, 'Lixeira de inox Tramontina (banheiro)', 'https://www.mercadolivre.com.br/lixeira-tramontina-loop-de-12-litros-em-aco-inoxidavel-com-acabamento-polido-e-balde-interno/p/MLB53799872'],
                [10, 'Talheres Tramontina', 'https://www.mercadolivre.com.br/tramontina-faqueiro-laguna-aco-inox-brilhoso-36-pecas/p/MLB32486245'],
                [11, 'Liquidificador', 'https://www.mercadolivre.com.br/liquidificador-philco-1200w-31-12-velocidades-preto-ph900/p/MLB15578941'],
                [12, 'Sanduicheira/grill', 'https://www.mercadolivre.com.br/grill-arno-dual-inox-180-abertura-placas-antiaderentes-cor-preto-110v/p/MLB70611281'],
                [13, 'Cafeteira elétrica', 'https://www.mercadolivre.com.br/cafeteira-eletrica-electrolux-digital-38-xicaras-experience-programavel-com-timer-cor-inox-ecm30/p/MLB18723192'],
                [14, 'Aparelho de jantar 20 peças', 'https://www.mercadolivre.com.br/aparelho-de-jantar-e-cha-donna-lirios-20-pecas-biona/p/MLB32633848'],
                [15, 'Jogo de Canecas', 'https://www.mercadolivre.com.br/conjunto-de-6-uni-260ml-ryo-maresia/p/MLB25576807'],
                [16, 'Boleira', 'https://www.mercadolivre.com.br/boleira-26-cm-oxford-flat-duna-off-white/p/MLB65413878'],
                [17, 'Air fryer', 'https://www.mercadolivre.com.br/fritadeira-airfryer-serie-1000-xl-na13000-preto/p/MLB52188249'],
                [18, 'Cooktop', 'https://www.mercadolivre.com.br/cooktop-itamaxi-itatiaia-5-bocas-preto/p/MLB43514330'],
                [19, 'Jogo de lençol king size', 'https://www.mercadolivre.com.br/jogo-de-lencol-king-size-algodao-200-fios-4-pecas-branco-stinely-casa/p/MLB52704527'],
                [20, 'Edredom/colcha king size', 'https://www.mercadolivre.com.br/edredom-ecopluma-king-size-280-x-260-cinza-camesa/p/MLB35682592'],
                [21, 'Conjunto travessas para servir', 'https://www.mercadolivre.com.br/marinex-conjunto-de-assadeiras-opaline-6-pecas-branco/p/MLB75501920'],
                [22, 'Jogo de sobremesa', 'https://www.mercadolivre.com.br/conjunto-6-tacas-de-sobremesa-250ml-e-bowl-vidro-sun-wolff/p/MLB38003482'],
                [23, 'Ferro de passar ou vaporizador', 'https://www.mercadolivre.com.br/ferro-passar-a-vapor-electrolux-easyline-sie70-1200w/p/MLB23034870'],
                [24, 'Jogo de potes para mantimentos', 'https://www.mercadolivre.com.br/kit-10-potes-hermeticos-vidro-tampa-bambu-seiri-para-mantimentos-cozinha/p/MLB57492845'],
                [25, 'Escorredor de louças premium', 'https://www.mercadolivre.com.br/escorredor-de-louca-2-andares-e-porta-talheres-future-inox-cor-prateado/p/MLB24723202'],
                [26, 'Utensílios de cozinha', 'https://www.mercadolivre.com.br/kit-utensilios-jogo-19-pecas-conjunto-em-silicone-de-cozinha/up/MLBU3929476762'],
                [27, 'Kit escorredor', 'https://www.mercadolivre.com.br/kit-3-pecas-escorredor-de-arroz-em-inox-escorredor-de-macarrao-inox-grande-escorredor-de-alimentos-mariazinha/p/MLB67424667'],
                [28, 'Assadeira 34 cm', 'https://www.mercadolivre.com.br/molde-antiaderente-de-teflon-tramontina-assadeira-cinza-brasileiro-de-34-cm/p/MLB27649798'],
                [29, 'Kit Vinho', 'https://www.mercadolivre.com.br/kit-abridor-de-vinho-eletrico-inox-recarregavel-usb/up/MLBU1979761425'],
                [30, 'Jogo Americano de bambu', 'https://www.mercadolivre.com.br/jogo-lugar-americano-bambu-cru-8-unidades-mimo-style-promo/up/MLBU601767760'],
                [31, 'Jogo de potes Tramontina', 'https://www.mercadolivre.com.br/jogo-de-potes-para-alimentos-tramontina-341-7-pecas/up/MLBU3957282958'],
                [32, 'Conjunto 3 Travessas Porcelana Retangular Para Servir Buffet', 'https://www.mercadolivre.com.br/conjunto-3-travessas-porcelana-retangular-para-servir-buffet/up/MLBU5358583752?pdp_filters=item_id%3AMLB772989494'],
                [33, 'Kit 6 Jogos Americano Bambu Elegante Mesa Posta Premium', 'https://www.mercadolivre.com.br/kit-6-jogos-americano-bambu-elegante-mesa-posta-premium-casa/up/MLBU3985933742?pdp_filters=item_id%3AMLB6801469452'],
                [34, 'Jogo De Panelas 7 Ceramic Life Smart Plus Areia Brinox', 'https://www.mercadolivre.com.br/jogo-de-panelas-7-ceramic-life-smart-plus-areia-brinox/up/MLBU3491177949?pdp_filters=item_id%3AMLB5810626260']
            ];

            for (const p of presentesIniciais) {
                await pool.query(
                    'INSERT INTO presentes (id, nome, link, comprado) VALUES ($1, $2, $3, FALSE) ON CONFLICT (id) DO NOTHING',
                    [p[0], p[1], p[2]]
                );
            }
            console.log('🎁 Tabela de presentes criada e populada automaticamente com sucesso!');
        }
    } catch (err) {
        console.error('Erro ao inicializar tabelas no banco:', err);
    }
}

garantirTabelas();

const dadosEstaticos = {
    noivos: "Andreza e Raul",
    data: "28 de Novembro de 2026",
    dataObj: "2026-11-28T16:00:00",
    verso: "“O coração do homem planeja o seu caminho, mas o Senhor lhe dirige os passos.” — Provérbios 16:9",
    historiaTexto: "Somos de lugares totalmente diferentes e o destino nos juntou. Nos conhecemos na faculdade em 2018 e desde o primeiro contato nossa aproximação e união é plano de Deus. É indescritível, é único e verdadeiro. São quase 8 anos de grande momentos, grandes conquistas, amizade e amor. E agora estamos dando o passo mais importante do nosso relacionamento, o casamento…",
    cerimonia: {
        local: "Capela de Nossa Senhora da Boa Viagem",
        endereco: "Av. Jurandy Oliveira Porto - Saco do Rio Real, Estância - SE",
        horario: "16h",
        mapaEmbed: "https://maps.google.com/maps?q=Capela+de+Nossa+Senhora+da+Boa+Viagem+Estancia+SE&t=&z=15&ie=UTF8&iwloc=&output=embed",
        linkMaps: "https://www.google.com/maps/search/?api=1&query=Capela+de+Nossa+Senhora+da+Boa+Viagem+Estancia+SE"
    },
    recepcao: {
        local: "Casa Gahulu",
        endereco: "Zeca de Loia, Estância - SE",
        mapaEmbed: "https://maps.google.com/maps?q=Casa+Gahulu+Estancia+SE&t=&z=15&ie=UTF8&iwloc=&output=embed",
        linkMaps: "https://www.google.com/maps/search/?api=1&query=Casa+Gahulu+Zeca+de+Loia+Estancia+SE"
    }
};

router.get('/', async (req, res) => {
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

    try {
        const resultadoPresentes = await pool.query('SELECT * FROM presentes ORDER BY id ASC');
        
        res.render('index', {
            ...dadosEstaticos,
            presentes: resultadoPresentes.rows,
            fotos: fotosAlbum
        });
    } catch (error) {
        console.error('Erro ao buscar presentes do banco:', error);
        res.status(500).send('Erro ao carregar a página.');
    }
});

router.post('/api/convidados', async (req, res) => {
    const { nome, mensagem } = req.body;

    if (!nome) {
        return res.status(400).json({ sucesso: false, erro: 'O nome é obrigatório.' });
    }

    try {
        await pool.query(
            'INSERT INTO convidados (nome, email, confirmacao, criado_em) VALUES ($1, $2, TRUE, NOW())',
            [nome, mensagem || '']
        );
        console.log(`🎉 Presença confirmada no banco para: ${nome}`);
        return res.status(200).json({ sucesso: true, mensagem: 'Presença confirmada com sucesso!' });
    } catch (error) {
        console.error('Erro ao gravar convidado no banco:', error);
        return res.status(500).json({ sucesso: false, erro: 'Erro ao gravar no banco de dados.' });
    }
});

router.post('/presentear/:id', async (req, res) => {
    const idPresente = parseInt(req.params.id);

    try {
        await pool.query('UPDATE presentes SET comprado = TRUE WHERE id = $1', [idPresente]);
    } catch (error) {
        console.error('Erro ao atualizar presente no banco:', error);
    }
    
    res.redirect('/#presentes');
});

module.exports = router;