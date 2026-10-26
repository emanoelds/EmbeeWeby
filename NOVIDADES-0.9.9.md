# EmbeeWeby 0.9.9

## Fechamento e inicialização

- Fechamento normal segue a preferência em Configurações > Página inicial e janela: abrir Nova guia (padrão), continuar de onde parou ou abrir páginas escolhidas.
- Páginas de inicialização podem ser adicionadas, editadas, removidas ou preenchidas com os sites abertos. A página do botão da casa continua independente.
- Após um encerramento inesperado, o navegador oferece Restaurar páginas, preservando o backup até a decisão do usuário. As páginas da sessão interrompida não são carregadas automaticamente.
- Corrigido um problema que podia sobrescrever a sessão com uma Nova aba durante a destruição da janela. A saída só é marcada como normal quando a janela realmente fecha; cancelamentos preservam a navegação.
- Sair com downloads em andamento oferece continuar baixando ou sair e cancelar.

## Downloads

Inclui o gerenciador preparado na 0.9.8, cuja publicação foi interrompida para incorporar estes ajustes:
- Indicador na navegação com progresso e aviso de conclusão.
- Painel compacto, acesso à lista completa, busca e filtros.
- Abrir arquivo, mostrar na pasta, pausar, retomar e cancelar.
- Remover registros individualmente ou limpar os finalizados, mantendo os arquivos na pasta escolhida.
- Histórico separado por perfil e recuperado ao reiniciar.

Validação: sintaxe completa e compilação Windows; reinícios reais com as três políticas; saídas normais e abruptas; restauração e descarte após falha; backup preservado sem resposta; cancelamento do fechamento; isolamento entre perfis; downloads reais com progresso e ações; teste de autenticação entre abas.

Referências analisadas: [Ajuda do Chrome](https://support.google.com/chrome/answer/95314?hl=pt-BR), [recuperação de sessão no Chromium](https://raw.githubusercontent.com/chromium/chromium/main/chrome/browser/ui/views/session_crashed_bubble_view.cc), [gerenciamento de fechamento no Chromium](https://raw.githubusercontent.com/chromium/chromium/main/chrome/browser/lifetime/browser_close_manager.cc).
