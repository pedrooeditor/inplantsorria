# Implansorria Mais

Landing page estática em português, com direção editorial e caminho curto até o contato pelo WhatsApp. HTML, CSS e JavaScript sem framework, bibliotecas de interface, rastreadores ou dependências de execução.

## Abrir e editar

Abra `index.html` no navegador, mantendo os outros arquivos e a pasta `assets` juntos. Para hospedagem estática, publique a raiz do projeto. Nenhuma instalação é necessária.

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Estrutura, textos, seções e perguntas frequentes |
| `styles.css` | Cores, tipografia, composição e regras responsivas |
| `app.js` | Explorador de tratamentos, menu e agendamento guiado |
| `site.config.js` | Dados e canais da clínica |
| `assets/hero.webp` | Imagem editorial ilustrativa, otimizada |
| `scripts/package.mjs` | Exportação de um HTML independente |

## Exportar um único HTML

Com Node.js 18 ou superior:

```sh
node scripts/package.mjs
```

O arquivo será criado em `dist/implansorria-mais.html`, com imagem, estilos e scripts incorporados. Ele abre sem internet; WhatsApp e Instagram precisam de conexão. Para escolher outro destino, passe o caminho como primeiro argumento.

## Conversão e comportamento

- Chamadas para avaliação no cabeçalho, hero, tratamentos, jornada e fechamento.
- Botão fixo no celular e atalho flutuante no desktop.
- Escolha de objetivo com descrições e assunto contextual no contato.
- Fluxo em duas etapas: interesse e intenção (agendar ou esclarecer dúvidas).
- Mensagem editável pelo visitante no WhatsApp; o site não envia mensagens nem confirma horários.
- Navegação por teclado, foco visível, diálogo nativo, link para pular conteúdo e respeito a movimento reduzido.
- Eventos locais `implansorria:conversion` com ações `treatment_select`, `contact_open` e `whatsapp_click`. Estes eventos não são transmitidos ou armazenados e não representam, por si só, métricas de conversão.

## Completar antes do lançamento

A identidade, a profissional, a cidade e os canais vieram da captura de Instagram fornecida no briefing. Precisam de revisão pela clínica. O número configurado é **55 11 95451-0922** e o perfil é **@implansorriamais**.

Preencha `site.config.js` com CRO/UF, endereço, horários e link de mapa aprovados. Campos vazios são omitidos da página. Revise tratamentos, textos e canais; insira fotos reais autorizadas e, se houver, depoimentos reais aprovados. Não foram inventados números de pacientes, avaliações, credenciais, preços ou resultados clínicos.

A foto principal é uma imagem gerada por IA para a proposta visual, identificada na página como ilustrativa. Ela não retrata uma paciente, profissional ou resultado da clínica. Consulte `ASSETS.md`.

O protótipo usa `noindex, nofollow` e uma nota discreta no rodapé. Quando a clínica aprovar a versão final e houver um domínio definido, ajuste esses itens, configure URL canônica e metadados de compartilhamento. A publicação do código no GitHub não ativa automaticamente o GitHub Pages.

## Privacidade

Não há formulário de dados pessoais, cookies, analytics, armazenamento local ou banco de dados. As escolhas do visitante são usadas apenas para preparar uma URL do WhatsApp, aberta por ação explícita. A mensagem permanece sujeita à revisão e envio pelo visitante.
