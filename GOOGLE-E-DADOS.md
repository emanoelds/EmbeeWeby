# Login Google e transferência de dados

O botão **Continuar com Google** autentica a conta EmbeeWebi usando o Supabase EmbeeTech. Ele não acessa o Chrome Sync nem importa dados da conta Google automaticamente.

## Configuração do administrador

1. No cliente OAuth Web do Google Cloud, autorize `https://grtuevzjxjcfimnuobht.supabase.co/auth/v1/callback`.
2. No Supabase EmbeeTech, em Authentication > Sign In / Providers > Google, ative o provedor e preencha Client ID e Client Secret. O segredo fica no Supabase; nunca no aplicativo, repositório ou chat.
3. Em Authentication > URL Configuration > Redirect URLs, adicione `http://127.0.0.1:54328/auth/callback/**`.
4. Se o app Google estiver em teste, autorize os usuários de teste na seção Audience do Google Cloud.

O login usa o navegador padrão, PKCE e um retorno temporário restrito a 127.0.0.1. A sessão é protegida pelo armazenamento do sistema quando disponível. A porta 54328 deve estar livre. A configuração externa e um login real com consentimento do usuário são necessários para validar a integração em produção.

Documentação: https://supabase.com/docs/guides/auth/social-sign-in/auth-google

## Favoritos e senhas

Em Configurações > Importar e exportar dados:

- Favoritos: HTML no formato Netscape, usado por Chrome, Edge e Firefox. A importação reúne as pastas em uma lista, ignora URLs não HTTP/HTTPS e evita duplicatas; limite de 500 favoritos.
- Senhas: CSV com colunas `name,url,username,password`. Colunas extras são ignoradas; vírgulas, aspas e quebras de linha entre aspas são preservadas. Limite de 5.000 entradas e arquivo até 10 MB. Duplicatas de URL e usuário preservam a senha já existente.
- O cofre local é separado por perfil e criptografado pelo sistema operacional. Em sistemas sem armazenamento seguro, a operação é recusada. O cofre desta versão é para transferência, sem captura ou preenchimento automático de formulários.
- A exportação CSV exige confirmação porque contém senhas legíveis. Proteja o arquivo e remova-o após a transferência.

## Sincronização do cofre

Entre na conta antes de importar as senhas destinadas a ela. Em Configurações, informe uma frase secreta com pelo menos 12 caracteres e use **Criptografar e sincronizar**. Aguarde o estado de sincronização da conta. Apenas o envelope criptografado entra no payload sincronizado, com a mesma proteção de acesso por usuário dos demais dados.

No outro computador, entre na mesma conta, receba os dados e use **Abrir cofre recebido da conta** com a mesma frase. As entradas são mescladas preservando as existentes. A frase não é armazenada nem enviada; não existe recuperação dela.

O envelope usa scrypt (N=32768,r=8,p=1), sal aleatório de 16 bytes, AES-256-GCM com IV aleatório de 12 bytes e autenticação do conteúdo. O limite do conteúdo antes da criptografia é 480 KB; o payload total continua sujeito ao limite da sincronização. Após alterar o cofre local, use novamente **Criptografar e sincronizar** para enviar a nova versão.
