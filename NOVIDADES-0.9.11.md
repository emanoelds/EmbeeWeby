# EmbeeWeby 0.9.11

- Tradução diretamente nos textos da página atual, sem abrir outra aba e sem alterar o endereço.
- Opção Mostrar texto original nos menus do navegador e do clique direito.
- Tradução de palavra ou trecho selecionado pelo clique direito, em janela pequena junto ao ponto clicado. Fecha com Esc, X, clique fora ou navegação.
- Nove idiomas disponíveis, com detecção automática do idioma de origem.
- O envio ao Google é informado antes da tradução; campos de formulário, senhas, conteúdo editável, código e trechos marcados como não traduzíveis são ignorados na tradução da página.
- Trocar de página ou restaurar o original cancela a aplicação de resultados pendentes. Links, eventos, elementos e a aba original são preservados.
- Instalador normaliza caminhos duplicados EmbeeWeby/EmbeeWebi, colocando os arquivos diretamente em uma única pasta EmbeeWeby. Diretórios personalizados são respeitados sem acrescentar outra pasta automaticamente.

A tradução requer internet e depende da disponibilidade do serviço Google. Traduz textos do documento principal até 2.000 trechos/160.000 caracteres por operação; imagens, documentos PDF e conteúdo dentro de frames não são traduzidos. Conteúdo carregado posteriormente pode exigir repetir a ação.

Validação: sintaxe; testes no Electron de tradução na mesma aba, restauração, exclusão de campos privados, preservação de links/cliques, janela de seleção e fechamento ao clicar fora; cancelamento por navegação; tradução real de textos de teste; cálculo de caminhos pelo NSIS e compilação do instalador Windows.
