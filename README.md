# Agência Criativa Web — otimização de performance

Site institucional fictício de uma agência de design digital (HTML, SCSS e JavaScript puro, sem frameworks). Este repositório documenta o processo de **medir, diagnosticar e otimizar** a performance do site com o Lighthouse do Chrome DevTools.

**Site publicado:** https://dudahudziak.github.io/agenciamarketing/
**Versão original (antes):** tag `antes-otimizacao` (`git checkout antes-otimizacao`)

## Como as medições foram feitas

- Lighthouse no Chrome DevTools, modo **Mobile**, categoria **Performance**
- Janela anônima, sem extensões, no site publicado no GitHub Pages
- 3 execuções por versão; o comparativo usa a **mediana**
- Relatórios em `reports/antes/` e `reports/depois/`

## Gargalos identificados (relatório "antes")

Nota inicial: **89** (mediana). Já era uma nota boa, mas o relatório apontou:

| Problema | Evidência no Lighthouse |
|---|---|
| LCP lento (3,6 s) | O elemento do LCP é a imagem `img.hero__imagem`, carregada de um serviço externo (picsum.photos), em JPEG |
| Recursos que bloqueiam a renderização | Render-blocking requests, economia estimada de 510 ms. O CSS do Google Fonts levou 810 ms |
| Cadeia de dependências de rede | HTML → CSS do Google Fonts → arquivos de fonte |
| Entrega de imagens | Improve image delivery, economia estimada de 156 KiB |
| Terceiros | Dependência de Google Fonts e picsum.photos |
| Cache | Use efficient cache lifetimes. O GitHub Pages define o cache e não dá para alterar (limitação) |

## Melhorias aplicadas

| Técnica | O que foi feito | Problema atacado |
|---|---|---|
| Imagens locais em WebP | As 2 fotos saíram do picsum e agora estão em `img/`, em WebP e em 3 larguras cada, usadas via `srcset` | LCP e entrega de imagens |
| Preload da imagem do LCP | `<link rel="preload" as="image">` com `imagesrcset` e `fetchpriority="high"` no `<head>` | LCP |
| Lazy loading | A imagem "Sobre" (abaixo da dobra) mantém `loading="lazy"`. O hero **não** usa lazy, de propósito | Peso inicial |
| Fontes hospedadas no projeto | Google Fonts removido. Fontes `.woff2` (subconjunto latin, 6 pesos) em `fontes/`, com `font-display: swap` e `preload` das duas mais críticas | Render-blocking, cadeia de rede, terceiros |
| Minificação de CSS | SCSS compilado em modo `compressed` | Peso do CSS |
| Minificação de HTML e JS | HTML e JS minificados. O JS saiu do HTML para `js/script.js` e carrega com `defer` | Peso e organização |
| Código não utilizado | Verificadas as 70 classes do CSS contra o HTML e o JS. **Nenhuma sem uso**, então não havia CSS morto para remover | — |
| Bibliotecas | O projeto não usa bibliotecas, então não havia o que substituir | — |

### Resultado em tamanho de arquivo (medido nos arquivos)

| Arquivo | Antes | Depois |
|---|---|---|
| Foto do hero (1200 px) | 206 KB (JPEG) | 128 KB (WebP). Celular recebe a de 800 px: 69 KB |
| Foto "Sobre" (1000 px) | 220 KB (JPEG) | 189 KB (WebP). Celular recebe a de 400 px: 31 KB |
| CSS | 12,0 KB | 10,6 KB (já inclui as regras das fontes locais) |
| HTML (com JS inline) | 13,8 KB | 9,9 KB de HTML + 1,1 KB de JS |
| Requisições a outros domínios | Google Fonts, gstatic e picsum | **0** |

## Comparativo antes/depois (Lighthouse, mobile, mediana de 3 execuções)

| Métrica | Antes | Depois |
|---|---|---|
| Performance | 89 | _preencher_ |
| First Contentful Paint | 1,6 s | _preencher_ |
| Largest Contentful Paint | 3,6 s | _preencher_ |
| Total Blocking Time | 0 ms | _preencher_ |
| Cumulative Layout Shift | 0 | _preencher_ |
| Speed Index | 1,6 s | _preencher_ |
| Requisições / tamanho transferido | _preencher_ | _preencher_ |

Prints: `reports/antes/` e `reports/depois/`

## O que mais impactou

_Preencher depois de medir, em 3 a 5 linhas: qual métrica mais melhorou e qual mudança provavelmente causou isso (conferir nos itens Insights e Diagnostics do novo relatório)._

## Limitações

- O cache dos arquivos é controlado pelo GitHub Pages e não foi alterado.
- A nota do Lighthouse varia entre execuções, por isso foram usadas 3 medições e a mediana.
- As fontes locais são estáticas (um arquivo por peso). O Google Fonts entregava uma versão variável, então pode haver diferença mínima de desenho nas letras.

## Estrutura do projeto

```
index.html            página publicada (minificada)
css/estilos.min.css   CSS compilado e minificado
js/script.min.js      JS minificado
img/                  imagens WebP em várias larguras
fontes/               fontes .woff2 locais
sass/                 código-fonte do CSS (SCSS)
src/                  código-fonte: index.html legível, js/script.js, img-originais/
scripts/imagens.js    gera os WebP a partir das imagens originais
reports/              relatórios do Lighthouse (antes e depois)
```

## Como reconstruir (opcional, precisa de Node.js)

```bash
npm install
npm run imagens   # gera os WebP
npm run build     # compila CSS, minifica JS e HTML
```

Edite sempre os arquivos em `src/` e `sass/` e rode o build; os arquivos da raiz são gerados.
