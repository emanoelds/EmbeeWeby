# EmbeeWeby 0.7.1 — navegação e URL

Cada aba agora tem um histórico que inclui Nova guia, Histórico, Configurações e sites. Voltar e Avançar, inclusive Alt+Seta, usam esse histórico unificado. O documento do site é preservado quando se retorna temporariamente a uma página interna, e o histórico nativo é reutilizado quando disponível.

Clique direito nas setas mostra até 50 destinos anteriores ou seguintes, com nome da página. Selecionar um destino navega diretamente para ele. As setas indicam quando existe um destino disponível.

A barra de endereço passa a renderizar o endereço confirmado pelo processo principal mesmo quando uma atualização repete a URL anterior. Isso evita que o texto pesquisado ou um rascunho antigo permaneça visível após confirmar uma navegação. Edição, redirecionamentos, colagem e Escape mantêm seus comportamentos.

Falhas de carregamento também entram no histórico e permitem voltar à Nova guia. Eventos de iframe não são tratados como nova navegação principal. Favoritos e títulos do site não substituem a identidade de uma página interna oculta.

Testes: Voltar/Avançar entre Nova guia, Configurações e sites; preservação de documento; seleção no menu das setas; SPA; redirecionamento; URL digitada e rascunho antigo; falha de carregamento; HTTPS inválido bloqueado e HTTPS válido; reutilização de Histórico/Configurações.
