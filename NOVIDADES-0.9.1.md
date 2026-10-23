# EmbeeWeby 0.9.1 — favoritos e personalização

- Importação e exportação HTML Netscape preservam nomes, URLs, pastas, subpastas e pastas vazias. Caracteres Unicode e entidades HTML são tratados. Reimportar o mesmo favorito na mesma pasta não duplica o item; o mesmo site pode existir em pastas diferentes. Links não HTTP/HTTPS são ignorados com contagem. Importações que excedem 500 favoritos ou 200 pastas são recusadas sem alterar os dados.
- Temas organizados em Temas Embee, Universos de anime e Meu tema. A seleção segue universo, personagem e wallpaper; o tema ativo é indicado e escolher uma imagem ativa o anime correspondente.
- Caixas de seleção, rádios e seletores acompanham as cores do tema, com foco por teclado, estado desativado e suporte de alto contraste.
- Personalização adicional: tamanho dos ícones, espaçamento dos controles, intensidade e velocidade dos efeitos, brilho dos fundos Embee e visibilidade de portais/universos.
- Menu com duplicar aba, silenciar/ativar som, transmitir tela e gerenciar extensões. A impressão no menu de contexto usa a prévia do navegador.
- Transmitir abre o painel do Windows para telas sem fio compatíveis; no macOS, abre os ajustes de telas para uso com AirPlay. Linux mostra orientação. Não há transmissão Chromecast nativa nem transmissão exclusiva de uma aba. Nenhum receptor físico foi testado.
- Extensões: carregar pasta descompactada contendo manifest.json, revisar permissões, ativar, desativar ou remover. Registro e sessão são separados por perfil; as extensões ativadas são carregadas novamente no início. Mudanças no manifesto requerem revisão. Não há instalação CRX/Web Store nem compatibilidade total com APIs do Chrome; botões de extensão e popups de toolbar não estão implementados. Mantenha a pasta escolhida no computador e recarregue páginas após alterar uma extensão.

Verificações: testes Electron do ciclo HTML importar/exportar/importar, pastas vazias, subpastas, UTF-8, repetição da importação e filtro de URLs; temas/universos/personagens/wallpapers; extensão Manifest V3 real com script de conteúdo e armazenamento local, ativar/desativar/remover; duplicar/silenciar; comando do painel de transmissão validado sem iniciar transmissão; controles visuais e sincronização das novas preferências. Categorias de configurações e sintaxe verificadas.

Referências: https://www.electronjs.org/docs/latest/api/extensions e https://www.electronjs.org/docs/latest/api/extensions-api
