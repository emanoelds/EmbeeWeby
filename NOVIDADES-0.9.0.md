# EmbeeWeby 0.9.0

- F11 mostra o site em toda a janela, sem barras ou menu lateral. Uma dica temporária informa como sair; F11 restaura a interface e sua largura lateral.
- Portais podem ser arrastados para reorganizar a lista, abrir em uma aba existente ou criar uma aba ao soltar no botão +.
- Temas Embee recebem efeitos de luz e partículas, com respeito à preferência de reduzir movimento.
- Configurações → Atualizações apresenta versão, status e verificação antes do acesso ao canal privado. A ordem do menu de categorias foi preservada.

Validação: testes Electron com site HTTP local conferiram dimensões da página nativa, ocultação e restauração da interface, desaparecimento da dica, saída por F11, reordenação e abertura de portais e ordem dos controles de atualização. Verificação de sintaxe de todos os módulos aprovada.

As primeiras imagens propostas foram rejeitadas e retiradas do aplicativo antes da publicação.
## Complementos

- Recuperação automática das abas, sites, ordem e aba ativa da última sessão, com dados separados por perfil local. As abas são salvas a cada alteração relevante e recuperadas também após encerramentos inesperados. Formulários não enviados e o estado interno de cada página não são restaurados.
- Wallpapers minimalistas próprios para EmbeeWeby e EmbeeSign, usando a abelha original como referência. As imagens iniciais foram substituídas conforme a escolha do usuário.
- Os efeitos animados ficam sobre o wallpaper: brilho ambiente, luz em movimento e partículas discretas. A preferência de reduzir movimento os desativa.

Validação adicional: duas execuções isoladas confirmaram recuperação após saída sem fechamento normal, incluindo dois sites, configurações, ordem, aba ativa, isolamento por perfil e validação das URLs.
