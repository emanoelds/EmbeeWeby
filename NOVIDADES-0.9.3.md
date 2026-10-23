# EmbeeWeby 0.9.3

- Removidos os botões flutuantes que surgiam automaticamente ao selecionar texto nos sites e na interface do navegador.
- Copiar fica no menu de clique direito sobre texto selecionado; Colar fica no menu de campos editáveis. Ctrl/Cmd+C e Ctrl/Cmd+V continuam disponíveis.
- Retiradas as bordas da barra de favoritos e dos seus itens; o destaque de hover e o foco por teclado permanecem.
- Removidos o preload, o script e o canal IPC exclusivos dos botões automáticos.

Validação: teste Electron com cliques direitos reais via Chromium confirmou Copiar nas seleções internas e em site local, Colar no campo editável, ausência de popup ao selecionar e bordas calculadas com largura zero. Verificação de sintaxe dos módulos aprovada.

## Pastas da barra de favoritos

- Pastas arrastáveis na barra, com marca indicando a posição antes/depois e ordem salva nas preferências sincronizadas.
- A movimentação preserva subpastas e favoritos; Alt+Shift+setas também muda a ordem das pastas visíveis.
- Cada pasta abre um menu nativo com seus sites e subpastas, além da opção de gerenciamento.
- Seta » mostra as pastas e os favoritos que não couberem na barra. A lista se ajusta ao redimensionar a janela e a seta desaparece quando todos os itens cabem.
- Mantidas as correções de copiar/colar somente no clique direito e da barra sem bordas.

Validação adicional: arrastar pastas e indicador, preservação da hierarquia, ordem na sincronização, menus e abertura de sites, transbordamento em duas larguras de janela, reordenação por teclado e bordas zero.
