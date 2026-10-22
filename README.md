# EmbeeWebi

Navegador desktop personalizável para Windows, Linux e macOS. Projeto privado de Emanoel Santos.

## Executar

Requer Node.js 24 ou mais recente.

```sh
npm ci
npm start
```

`npm run check` verifica a sintaxe. `npm run dist` compila o pacote para o sistema atual. O fluxo manual **Build EmbeeWebi**, em Actions, prepara artefatos para os três sistemas; ele não publica versões automaticamente.

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

O módulo `updates.cjs` usa `electron-updater`: verifica ao iniciar e a cada quatro horas, baixa versões disponíveis e agenda a instalação ao fechar, sem interromper uma sessão ativa.

**O canal de distribuição não está ativado.** Este repositório é privado e a distribuição será configurada separadamente. O aplicativo mostra esse estado nas configurações. Não incorpore tokens de acesso ao GitHub no cliente para contornar a privacidade do repositório.

Para ativar, configure um repositório de distribuição público em `release-config.json`, mantenha o código privado e publique os artefatos e metadados gerados pelo electron-builder. Configure `build.publish` para o mesmo destino. No Windows, configure o certificado de assinatura e o nome do publicador; no macOS, assinatura e notarização. O código bloqueia a atualização Windows enquanto não houver publicador configurado. Certificados e senhas devem ficar nos segredos do CI, nunca no Git.

## Estado e validação

Versão inicial de desenvolvimento. Não inclui extensões, bloqueador de anúncios, gerenciador de senhas ou navegação privada. Reprodução DRM e compatibilidade com sites precisam de testes próprios. Existem alertas moderados nas dependências de ferramentas de desenvolvimento que ainda precisam de revisão antes de distribuição pública.

Veja [LEIA-ME.md](LEIA-ME.md) para o histórico de mudanças e limites de cada versão.
