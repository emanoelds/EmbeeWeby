# EmbeeWeby 0.9.3

- Removidos os botões flutuantes que surgiam automaticamente ao selecionar texto nos sites e na interface do navegador.
- Copiar fica no menu de clique direito sobre texto selecionado; Colar fica no menu de campos editáveis. Ctrl/Cmd+C e Ctrl/Cmd+V continuam disponíveis.
- Retiradas as bordas da barra de favoritos e dos seus itens; o destaque de hover e o foco por teclado permanecem.
- Removidos o preload, o script e o canal IPC exclusivos dos botões automáticos.

Validação: teste Electron com cliques direitos reais via Chromium confirmou Copiar nas seleções internas e em site local, Colar no campo editável, ausência de popup ao selecionar e bordas calculadas com largura zero. Verificação de sintaxe dos módulos aprovada.
