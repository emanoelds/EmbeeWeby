# EmbeeWeby 0.9.8

- Botão de downloads na navegação, com progresso e contador de arquivos em andamento.
- Painel compacto ao iniciar e concluir downloads, com acesso a todos os downloads e botão para fechar.
- Abrir arquivo, mostrar na pasta, pausar, retomar, cancelar e remover registros individualmente.
- Gerenciador com busca, filtros e botão Limpar lista. Arquivos finalizados, cancelados e interrompidos podem ser removidos da lista; downloads ativos são preservados até serem cancelados.
- Lista persistida e separada por perfil. Ao reiniciar, downloads que não terminaram aparecem como interrompidos.
- Abertura de arquivos usa exclusivamente o caminho salvo pelo processo de download e depende de uma ação do usuário.
- Painel acompanha os modos claro/escuro e a preferência de reduzir movimento. Avisos compactos não interrompem outros aplicativos ou o modo de tela cheia.

Validação: download HTTP local real com progresso, conclusão, pausa, retomada e cancelamento; abrir/mostrar pasta verificados com caminhos reais e chamadas nativas substituídas no teste; remover e limpar registros preservando os arquivos; testes de isolamento de perfis, reinício, erro de arquivo ausente, foco do teclado, modos claro/escuro e empacotamento Windows.
