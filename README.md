# Implan Sorria Mais

Landing page estática em português, com paleta de marfim, areia, cobre rosado e café. Atualizada em 17/10/2026 a partir da referência de cores enviada pela cliente. Direção editorial, imagens do perfil e caminho guiado até o WhatsApp. HTML, CSS e JavaScript sem framework, rastreadores ou dependências de execução.

**Site:** https://pedrooeditor.github.io/inplantsorria/

O GitHub Pages publica a branch `main`, pasta raiz. Cada atualização em `main` inicia uma nova publicação. `.nojekyll` mantém os arquivos estáticos sem processamento do Jekyll.

## Abrir e editar

Abra `index.html` no navegador, mantendo os outros arquivos e a pasta `assets` juntos. Para hospedagem estática, publique a raiz do projeto. Nenhuma instalação é necessária.

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Estrutura, textos, seções e perguntas frequentes |
| `styles.css` | Cores, tipografia, composição e regras responsivas |
| `app.js` | Explorador de tratamentos, menu e agendamento guiado |
| `site.config.js` | Dados e canais da clínica |
| `assets/hero.webp` | Imagem editorial ilustrativa, otimizada |
| `assets/instagram-reference.png` | Captura fornecida pelo cliente, enquadrada por CSS na seção Instagram |
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
- Arco de luz em SVG, resposta sutil ao ponteiro, leitura progressiva do manifesto, entrada das seções e ilustrações por tratamento.
- Controle “Pausar efeitos” e respeito automático a `prefers-reduced-motion`. Nenhum efeito impede a leitura ou o agendamento.
- Eventos locais `implansorria:conversion` com ações `treatment_select`, `contact_open` e `whatsapp_click`. Estes eventos não são transmitidos ou armazenados e não representam, por si só, métricas de conversão.

## Completar antes do lançamento

A cliente informou em 17/10/2026: **Implan Sorria Mais — Odontologia Especializada**, **Dra. Ana Paula Ferreira de Faria**, **CRO-SP 146379** e **(11) 95451-0922**. Esses dados estão na configuração, na apresentação da profissional, no contato e no rodapé. O perfil permanece **@implansorriamais**.

Preencha `site.config.js` com os horários quando forem informados. O endereço e a busca no mapa usam a captura fornecida anteriormente: Av. Marginal Direita, 420, Jardim Paulista, Barueri, SP. Campos vazios são omitidos. Revise tratamentos, textos e endereço. Não foram inventados números de pacientes, avaliações, preços ou resultados clínicos.

A foto principal é uma imagem gerada por IA para a proposta visual, identificada na página como ilustrativa. Ela não retrata uma paciente, profissional ou resultado da clínica. Consulte `ASSETS.md`.

O protótipo usa `noindex, nofollow` e uma nota discreta no rodapé. Quando a clínica aprovar a versão final e houver um domínio definido, ajuste esses itens, configure URL canônica e revise os metadados de compartilhamento.

## Privacidade

Não há formulário de dados pessoais, cookies, analytics, armazenamento local ou banco de dados. As escolhas do visitante são usadas apenas para preparar uma URL do WhatsApp, aberta por ação explícita. A mensagem permanece sujeita à revisão e envio pelo visitante.
