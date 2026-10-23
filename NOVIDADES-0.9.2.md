# EmbeeWeby 0.9.2

## Transmissão direta para Chromecast

- Descoberta local mDNS de serviços Google Cast e adição manual por IPv4 privado. Nenhum dispositivo recebe conteúdo durante a pesquisa; é necessário escolher aparelho e clicar Transmitir.
- Reprodução de links diretos de mídia pelo Default Media Receiver, com pausar, continuar e parar. A TV acessa o link diretamente; cookies do navegador não são transferidos. Páginas HTML, players blob e conteúdo com DRM não são links diretos reproduzíveis por esse modo.
- Espelhamento experimental da aba com vídeo VP8 e áudio Opus em WebM ao vivo. A captura usa exclusivamente os WebContents da aba escolhida; não usa microfone ou áudio de outras janelas. O áudio local é redirecionado durante a captura e a captura é encerrada ao parar, fechar a aba, trocar perfil ou fechar a janela.
- O fluxo é servido somente na interface de rede usada para a conexão com o aparelho, com endereço aleatório e acesso restrito ao IP do receptor. O servidor é encerrado ao parar. Requer que o firewall permita a comunicação local. Não há retransmissão pela nuvem.
- A captura de áudio deve ser disponibilizada pelo sistema; se não houver faixa de áudio, o modo informa erro em vez de transmitir silenciosamente. Pode haver atraso, e a compatibilidade do WebM ao vivo varia entre receptores. Este modo não implementa o protocolo de espelhamento RTP do Chrome.
- Bibliotecas Cast e mDNS são empacotadas; o protobuf usa versão corrigida 8.8.1 por override. A auditoria das dependências de produção retornou zero vulnerabilidades.

## Texto e nova guia

- Selecionar texto mostra Copiar nas páginas internas e nos sites. Campos editáveis também mostram Colar. Ações exigem eventos de clique confiáveis; o script do site não recebe acesso ao IPC ou ao conteúdo da área de transferência. Atalhos e menus nativos continuam disponíveis.
- Personalizar e Clima ficam na nova guia por padrão. Configurações → Barras e navegação permite ativá-los separadamente na barra.
- Portais podem ser soltos no intervalo entre duas abas para criar uma aba naquele ponto; o centro de uma aba existente abre o site nela. Abas arrastadas são inseridas no intervalo indicado por uma marca visual. O espaço vazio no final e a área vazia da nova guia também aceitam soltar.

## Validação e limites

Testes locais: conexão TLS/protobuf Cast, iniciar receptor e comandos LOAD/PAUSE/PLAY/STOP contra um receptor simulado; captura real de uma aba com animação e áudio gerado, verificando faixas VP8/Opus no WebM; controles do painel, eventos confiáveis de copiar/colar e rejeição de eventos sintéticos; atalhos da nova guia, opções da barra, inserção entre abas e soltar em áreas vazias.

A busca na rede desta sessão encontrou zero dispositivos. Reprodução em Chromecast/TV física ainda não foi validada. O espelhamento aparece como experimental por esse motivo e pela variação de suporte a fluxo WebM ao vivo.

Referências: https://developers.google.com/cast/docs/media ; https://www.electronjs.org/docs/latest/api/session ; https://github.com/thibauts/node-castv2-client
