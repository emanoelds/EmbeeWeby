# Correções da barra de endereço e painel de conexão — 0.6.7

O painel de conexão fecha pelo × através de um canal restrito ao próprio painel, por Escape, ao clicar fora, navegar, trocar de aba, minimizar ou ocultar a janela. O ciclo abrir/fechar evita reabrir imediatamente quando o botão recebe o clique que tirou o foco do painel. Carregamentos tardios não tentam mostrar uma janela já fechada.

A barra de endereço mantém a URL real atualizada mesmo durante a edição de um rascunho. Escape restaura a página ativa. Ao focar a URL, o texto e o cursor ficam visíveis; o destaque por partes é retomado após a edição. A exibição compacta e a cópia do endereço completo são preservadas.

Validado em perfil isolado: URL e rascunho, Escape, ×, Escape do painel, nova aba e perda de foco.
