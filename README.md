# EmbeeWebi

Navegador desktop personalizável para Windows, Linux e macOS. Projeto privado de Emanoel Santos.

## Executar

Requer Node.js 24 ou mais recente.

```sh
npm ci
npm start
```

`npm run check` verifica a sintaxe. `npm run dist` compila o pacote para o sistema atual. O fluxo **Build EmbeeWebi**, em Actions, prepara artefatos para os três sistemas. Tags `v*` também publicam instaladores e metadados em uma versão privada do próprio repositório.

## Recursos

- Abas arredondadas, ícones dos sites, favoritos, histórico, downloads e captura.
- Temas de anime com paletas por personagem e ilustrações próprias em CSS.
- Modos claro e escuro, redução de movimento e página inicial configurável na mesma aba.
- Menu lateral ajustável de 60 a 240 px por arraste, teclado ou controle nas configurações; rótulos aparecem quando há espaço.
- Conta online com e-mail/senha no Supabase, cadastro, confirmação por e-mail e recuperação.
- Sincronização de favoritos, atalhos, notas, tema e preferências. Histórico, cookies e senhas dos sites não são enviados à conta.
- Dados locais e sessões de sites separados por conta. Conflitos de sincronização precisam de escolha explícita.

## Conta e dados

`cloud-config.json` contém somente URL do projeto e chave **publishable**, própria para distribuição. Nunca coloque chaves `service_role`, secret keys ou credenciais de administrador no aplicativo.

O esquema implantado está documentado em `backend.sql`. A tabela `embee_browser_sync` usa RLS com acesso somente ao próprio `auth.uid()`. A senha é enviada por HTTPS ao Supabase Auth e não é salva pelo aplicativo. Tokens de sessão ficam no processo principal, persistidos por `safeStorage` quando existe um cofre seguro do sistema. Em sistemas Linux com `basic_text`, a sessão fica apenas em memória. Os dados locais de navegação não são um cofre criptografado contra outras pessoas com acesso à mesma conta do sistema operacional.

Ao criar a conta, confirme o e-mail recebido e volte ao EmbeeWebi para entrar. A recuperação aceita o código ou o link original do e-mail de recuperação; cole-o no formulário do aplicativo sem abri-lo antes. O remetente e o destino de confirmação seguem as configurações de e-mail do projeto conectado.

## Atualizações

O canal está configurado para as versões privadas de https://github.com/emanoelds/EmbeeWebi/releases. Cada pessoa precisa ter acesso a esse repositório.

Em Configurações → Atualizações, autorize o computador com um token fine-grained do GitHub, limitado ao repositório EmbeeWebi e à permissão Contents: Read-only. Nunca envie esse token pelo chat ou coloque-o no código. Ele é validado pela API do GitHub e persistido com safeStorage somente quando existe um cofre seguro no sistema. Sem cofre, a autorização vale apenas durante a sessão. Também é possível abrir o canal no navegador e baixar usando a sessão do GitHub.

O navegador verifica versões ao iniciar e a cada quatro horas. A consulta funciona independentemente da assinatura de código. **A instalação automática continua bloqueada enquanto a assinatura não estiver configurada.** No Windows, ela exige o publicador correspondente à configuração embutida pelo electron-builder. Não se desativa a verificação de assinatura para ativar atualizações.

Para publicar novas versões, atualize package.json/package-lock.json e envie uma tag v* correspondente. O workflow compila os três sistemas e envia arquivos e metadados à versão privada usando a autorização temporária do GitHub Actions. Uma execução manual sem tag só gera artefatos. Para publicação local, npm run publish:windows exige GH_TOKEN no ambiente; ele não é embutido no instalador.

Para liberar instalação automática, configure a assinatura Windows no electron-builder, habilite a assinatura (o build de desenvolvimento usa signExecutable: false), configure publisherName em release-config.json e mantenha certificados e senhas nos segredos do CI. macOS exige assinatura e notarização próprias.

## Estado e validação

Versão inicial de desenvolvimento. Não inclui extensões, bloqueador de anúncios, gerenciador de senhas ou navegação privada. Reprodução DRM e compatibilidade com sites precisam de testes próprios. Existem alertas moderados nas dependências de ferramentas de desenvolvimento que ainda precisam de revisão antes de distribuição pública.

Veja [LEIA-ME.md](LEIA-ME.md) para o histórico de mudanças e limites de cada versão.
