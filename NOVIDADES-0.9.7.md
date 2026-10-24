# EmbeeWeby 0.9.7

- Configurações com ícones SVG, navegação por teclado e busca mais clara; ao abrir pelo menu, começa em **Você e sua conta**.
- Temas organizados por identidade, universo, personagem e imagem, com prévias maiores, descrições, busca de personagens e ajustes de enquadramento.
- Dois wallpapers novos para EmbeeWeby e EmbeeSign, mantendo os fundos anteriores.
- Gerenciador de senhas com busca, ordenação, ícones dos sites e revelação explícita. Senhas são ocultadas ao perder foco, e respostas atrasadas não voltam a revelá-las.
- Histórico agrupado por dia, com busca e filtros de período preservados. Favoritos ganham busca na pasta, caminhos de navegação e menos recriação da barra.
- Transições curtas e suaves nas categorias e painéis, respeitando a preferência de reduzir movimento.
- Pop-ups de autenticação preservam a ligação nativa com a aba de origem, mensagens de retorno, formulários POST e fechamento para voltar ao site. Validado com fluxo local controlado; não foi realizado login em uma conta Google pessoal. Restrições impostas pelos provedores continuam aplicáveis.
- Instalador usa **EmbeeWeby** como nome da pasta padrão e ajusta o destino legado, preservando pastas personalizadas e o perfil já existente.

Validação: sintaxe completa; testes Electron de autenticação entre abas, segurança dos pop-ups, configurações, senhas fictícias, histórico, temas, favoritos e carregamento de ícones; conferência visual clara/escura; compilação NSIS.

## Imagens

Geradas com imagegen integrado, usando a marca existente como referência, e salvas em:
- assets/brands/embeeweby-circuit-v3.png
- assets/brands/embeesign-trust-v3.png

Prompts completos e referência: [WALLPAPER-PROMPTS-0.9.7.json](WALLPAPER-PROMPTS-0.9.7.json).
