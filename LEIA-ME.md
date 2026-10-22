# EmbeeWebi — versão inicial 0.4

Navegador desktop com temas de seis animes e 22 personagens, cores próprias, abas reais, pesquisa, favoritos, histórico local (até 500 entradas), downloads, captura de página, notas e atalhos. A interface também pode ser aberta em `index.html` como demonstração; a navegação real exige o aplicativo Electron.

## Executar

Instale Node.js e, nesta pasta, execute:

```
npm install
npm start
```

`npm run check` verifica sintaxe. `npm run dist` gera o pacote do sistema atual: instalador NSIS no Windows, AppImage no Linux ou DMG no macOS. Compile e teste cada plataforma no respectivo sistema. Os pacotes não têm assinatura digital configurada.

## Personalização

Abra ✦ Personalizar, escolha um universo e um personagem. As paletas alteram a página inicial e os destaques da interface. Configurações permitem trocar a cor, reduzir movimento e usar página inicial clara. O catálogo fica em `renderer.js`; adicione universos e personagens ao array `universes`.

Não há arte, voz, músicas ou logotipos oficiais de anime neste pacote. O cenário é original em CSS. Obtenha as autorizações necessárias antes de distribuir materiais de terceiros.

## Estado do projeto

Esta é uma base funcional inicial, não uma versão pronta para substituir um navegador principal. Não inclui extensões Chrome, sincronização, bloqueador de anúncios, navegação privada, gerenciador de senhas, atualização automática ou catálogo remoto. Reprodução com DRM e compatibilidade de serviços precisam de testes próprios. Não promete anonimato nem proteção completa contra rastreamento ou phishing.

Conteúdo remoto usa WebContentsView com sandbox, contextIsolation e Node.js desativado. Somente HTTP/HTTPS pode ser navegado; novas janelas viram abas. A ponte privilegiada fica apenas na interface local e valida o remetente. Permissões de câmera, localização, notificações e microfone são negadas. Certificados inválidos não recebem exceções. Downloads usam o mecanismo nativo do Electron. Cookies e cache podem ser apagados nas configurações. Histórico, favoritos, temas e notas ficam no armazenamento local do perfil; não são criptografados pelo aplicativo.

Antes de distribuição pública: auditoria de segurança, política de atualizações, assinatura de instaladores, testes em três sistemas, acessibilidade, tratamento de permissões por site e licenças de dependências. Mantenha Electron atualizado. A instalação gera um arquivo de lock para fixar versões resolvidas.

## Verificação realizada no Windows

Passaram: sintaxe JavaScript; abertura da interface; catálogo; aplicação de personagem; criação e fechamento de abas; persistência de notas; navegação HTTP em página local; título da página; sandbox; isolamento de contexto; ausência de Node.js na página remota. O pacote Windows foi gerado. Não foram testados sites externos, DRM, downloads reais nem execução em Linux/macOS.

A instalação informou oito alertas moderados na árvore de dependências de desenvolvimento. A distribuição pública depende de revisar e resolver esses alertas; a auditoria completa não foi concluída nesta sessão.

## Página inicial configurável

Em Configurações → Página inicial, escolha Google, Yahoo, DuckDuckGo, Página Nova aba ou endereço HTTP/HTTPS personalizado e clique em Salvar página inicial. O botão da casa abre o destino na guia atual. A preferência permanece salva ao reabrir o navegador. O botão + continua criando uma nova aba independente. Esta configuração é separada dos temas e não altera o mecanismo de pesquisa da barra de endereço (Google nesta versão).

Verificado: cinco opções, persistência local, rejeição de protocolos inseguros e retorno à nova aba ou endereço personalizado mantendo a mesma guia. As demais configurações do Chrome ainda não foram reproduzidas integralmente.

## Janela própria — 0.2

A barra de título nativa foi removida. A barra de abas agora contém controles próprios para minimizar, maximizar/restaurar e fechar. Arraste pela área livre superior para mover a janela. O pacote Windows atualizado fica em dist-0.2.0/win-unpacked/EmbeeWebi.exe; mantenha os arquivos dessa pasta juntos. Feche a versão anterior e abra esse novo executável para usar as alterações. Os controles foram testados no Windows.

## Marca e interações — 0.3

A abelha fornecida pelo usuário está na barra lateral, na nova aba, no ícone da janela e no executável Windows. O ICO inclui 16, 24, 32, 48, 64, 128 e 256 pixels. A arte original foi preservada. O nome redundante ao lado das abas foi removido.

Abas arredondadas têm animações de abertura e fechamento, realce da aba ativa, indicador de carregamento e favicon do site. Ícones remotos são limitados em tamanho e convertidos para PNG antes de chegar à interface. Há ícone genérico quando o site não informa um favicon utilizável. Os elementos das abas permanecem estáveis durante carregamentos para evitar reiniciar animações a cada atualização.

Barra de rolagem personalizada na interface e estilo discreto nas páginas carregadas (páginas com estilos próprios podem prevalecer). Botões, atalhos, busca, personagens e painéis têm efeitos suaves. A preferência Reduzir movimento e a configuração de movimento reduzido do sistema são respeitadas. Uma animação nunca bloqueia o fechamento de uma guia.

Pacote atualizado: dist-0.3.0/win-unpacked/EmbeeWebi.exe. Feche a versão anterior e abra esse executável, mantendo os arquivos da pasta juntos. Testados no Windows: logo, favicon de página HTTP local, abas estáveis, abertura e fechamento animados, redução de movimento, restauração da nova aba e página inicial configurável. Linux e macOS continuam sem testes nesta sessão.

## Rolagem, modos e ícones — 0.4

A barra superior e a lateral ficam fixas. Somente o conteúdo abaixo da navegação rola, com barra fina personalizada. Os painéis têm rolagem própria e cabeçalho fixo. O modo claro agora abrange barra de abas, navegação, lateral, campos e painéis; o modo escuro usa a mesma estrutura de cores. A cor de destaque dos textos é ajustada para manter contraste, preservando a paleta original nos elementos decorativos. O botão Modo claro fica em Configurações → Personalização.

Favicons aceitam PNG, JPEG, SVG, ICO, GIF e WebP. São verificadas múltiplas opções declaradas pelo site, redirecionamentos HTTP/HTTPS e os caminhos favicon.ico/apple-touch-icon.png. Ícones dos atalhos também são carregados diretamente dos respectivos sites, sem serviço de ícones de terceiros. O ícone genérico permanece quando nenhuma opção válida estiver disponível. O tamanho dos arquivos é limitado e as páginas remotas continuam isoladas da interface.

A marca lateral usa até 70 pixels, os ícones das páginas 22 pixels e a abelha da nova aba 28 pixels. O ícone do aplicativo teve as margens vazias reduzidas em uma cópia para ocupar melhor o espaço disponível; a imagem original está preservada em assets/bee-mark.png. O tamanho final de atalhos na área de trabalho continua sendo controlado pelo sistema operacional.

Pacote atualizado: dist-0.4.0/win-unpacked/EmbeeWebi.exe. Verificado no Windows: sete cenários de favicon (PNG, SVG, ICO, redirecionamento, descoberta alternativa, múltiplas opções e SVG inline), rolagem independente, barras fixas, contraste de texto maior que 7:1 e destaque maior ou igual a 4,5:1 na paleta testada, painéis claros, ícones ampliados e comportamento da casa na mesma guia. Prévias foram conferidas visualmente nos dois modos.

## Ajustes de acabamento — 0.4.1

Ícones nas abas sem fundo ou preenchimento extra. Marca lateral reduzida para 48 pixels. Barra de endereço com formato arredondado, foco indicado pelo contorno do próprio campo e efeitos recortados pela borda. O ícone e o texto formam um grupo centralizado em cada aba; o botão de fechar ocupa posição fixa à direita, sem animação ou transição, inclusive no hover. Conferido visualmente no Windows, incluindo foco da URL e hover do favorito e do botão de fechar.

Pacote atualizado: dist-0.4.1/win-unpacked/EmbeeWebi.exe.

## Menu ajustável, conta online e atualização preparada — 0.5

Arraste a borda direita do menu lateral para escolher entre 60 e 240 pixels, use as setas após selecionar a borda ou ajuste em Configurações → Menu lateral. Dê dois cliques na borda para voltar ao padrão. Os rótulos aparecem a partir de 150 pixels e a largura é lembrada.

Clique no perfil na parte inferior do menu para criar uma conta ou entrar com e-mail e senha. O serviço de autenticação está conectado ao projeto EmbeeTech. Confirme o e-mail recebido antes de entrar. Favoritos, atalhos, notas, tema e preferências são sincronizados ao alterar e periodicamente; os dados locais e os cookies dos sites ficam separados por conta. Conflitos entre computadores exigem escolher quais dados manter. Histórico, cookies e senhas dos sites não são sincronizados.

A senha não é salva pelo aplicativo. A sessão fica no processo principal e usa o cofre criptografado do sistema quando disponível. A base online aplica RLS por usuário. Não há proteção criptográfica dos arquivos de histórico/notas locais contra outras pessoas com acesso à mesma conta do Windows.

O repositório privado emanoelds/EmbeeWebi foi criado. O código inclui verificação automática de versões e instalação ao fechar, mas o canal de distribuição e a assinatura dos instaladores ainda precisam ser configurados. Nenhum token privado do GitHub é incluído no aplicativo. A tela de atualizações informa que o canal está pendente.

Verificado: menu e página nativa mudam juntos; largura é salva; login e perfis isolados em simulação; sincronização e conflito em simulação; endpoint real de autenticação e provedor de e-mail habilitados; login inválido rejeitado; acesso anônimo à tabela negado; armazenamento de sessão criptografado; políticas RLS verificadas com usuários temporários em transação integralmente revertida. Nenhuma conta de teste permanente foi criada. Cadastro com envio real de e-mail e aplicação de uma atualização remota ainda não foram testados. Auditoria das dependências distribuídas: nenhum alerta informado pelo npm; ferramentas de desenvolvimento ainda têm oito alertas moderados.

Abra dist-0.5.0/win-unpacked/EmbeeWebi.exe ou execute o instalador EmbeeWebi Setup 0.5.0.exe após fechar a versão anterior.


## Alinhamento das abas — 0.5.1

Ícones e títulos alinhados à esquerda, centralizados na vertical, com espaçamento uniforme e área reservada para o botão de fechar à direita. O botão de fechar continua sem animação.
