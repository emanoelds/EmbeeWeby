# EmbeeWeby 0.7.0

A janela salva sua posição, tamanho normal, estado maximizado e tela cheia ao fechar. Ao reabrir, esses valores são restaurados dentro da área útil de um monitor conectado. A janela não é reaberta minimizada. Monitores removidos e telas menores recebem ajuste para manter os controles acessíveis. O aplicativo não modifica preferências globais do Windows e não tenta reconstruir grupos de Snap do sistema.

O conteúdo das Configurações fica centralizado em uma coluna de até 900 px, preservando o alinhamento dos rótulos e controles. Modais de clima, edição, ferramentas e painéis são centralizados com margens externas de pelo menos 24 px na horizontal e 32 px na vertical. Cabeçalho e conteúdo têm espaçamento interno consistente e rolagem limitada à área disponível. O painel HTTPS continua ancorado ao botão da URL.

Validação: teste real de fechar e reabrir maximizado; simulação de monitores desconectados e telas pequenas; teste de alinhamento de Configurações, modal de clima e editor, com capturas visuais.
