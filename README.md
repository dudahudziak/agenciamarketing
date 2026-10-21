# Agência Criativa Web: otimização de performance

Site institucional fictício de uma agência de design digital, feito com HTML, SCSS e JavaScript puro (sem frameworks). Este repositório documenta o processo de **medir, diagnosticar e otimizar** a performance do site com o Lighthouse do Chrome DevTools.

- **Site publicado:** https://dudahudziak.github.io/agenciamarketing/
- **Versão original (antes da otimização):** tag `antes-otimizacao` (`git checkout antes-otimizacao`)

## Resultado em resumo

A nota de Performance no Lighthouse (mobile) subiu de **89 para 99**, e o **LCP caiu de 3,6 s para 1,9 s**.

## Como as medições foram feitas

- Lighthouse no Chrome DevTools, modo **Mobile**, categoria **Performance**
- Janela anônima, sem extensões, no site publicado no GitHub Pages
- 3 execuções por versão; o comparativo usa a **mediana**
- Relatórios salvos em `reports/antes/` e `reports/depois/`

## Gargalos identificados (relatório "antes")

A nota inicial foi **89** (mediana). Já era boa, mas o único ponto fraco era o LCP (3,6 s). O relatório apontou:

| Problema | Evidência no Lighthouse |
|---|---|
| LCP lento | O elemento do LCP era a imagem `img.hero__imagem`, carregada de um serviço externo (picsum.photos), em JPEG |
| Recursos que bloqueiam a renderização | *Render-blocking requests*, economia estimada de 510 ms. O CSS do Google Fonts levou 810 ms para chegar |
| Cadeia de dependências de rede | HTML, depois CSS do Google Fonts, depois arquivos de fonte |
| Entrega de imagens | *Improve image delivery*, economia estimada de 156 KiB |
| Dependência de terceiros | Google Fonts e picsum.photos |
| Cache | *Use efficient cache lifetimes*. O GitHub Pages define o cache e isso não pode ser alterado (limitação) |

## Melhorias aplicadas

| Técnica | O que foi feito | Problema atacado |
|---|---|---|
| Imagens locais em WebP | As 2 fotos saíram do picsum e agora ficam em `img/`, em WebP e em 3 larguras cada, usadas com `srcset` | LCP e entrega de imagens |
| Preload da imagem do LCP | `<link rel="preload" as="image">` com `imagesrcset` e `fetchpriority="high"` no `<head>` | LCP |
| Lazy loading | A imagem da seção "Sobre" (abaixo da dobra) mantém `loading="lazy"`. O hero **não** usa lazy, de propósito, porque é a imagem do LCP | Peso inicial |
| Fontes hospedadas no projeto | Google Fonts removido. Fontes `.woff2` (subconjunto latin, 6 pesos) em `fontes/`, com `font-display: swap` e `preload` das duas mais críticas | Render-blocking, cadeia de rede, terceiros |
| Minificação de CSS | SCSS compilado em modo `compressed` | Peso do CSS |
| Minificação de HTML e JS | HTML e JS minificados. O JS saiu de dentro do HTML para `src/js/script.js` e carrega com `defer` | Peso e organização do código |
| Remoção de código não utilizado | As 70 classes do CSS foram conferidas contra o HTML e o JS. **Nenhuma estava sem uso**, então não havia CSS morto para remover | n/a |
| Substituição de bibliotecas | O projeto não usa bibliotecas, então não havia o que substituir | n/a |

### Resultado em tamanho de arquivo

| Arquivo | Antes | Depois |
|---|---|---|
| Foto do hero (original, 2576 px) | 499 KB (JPEG) | 68 KB em WebP de 1200 px. O celular recebe a de 800 px: 38 KB |
| Foto "Sobre" (original, 2576 px) | 487 KB (JPEG) | 49 KB em WebP de 1000 px. O celular recebe a de 400 px: 15 KB |
| CSS | 12,0 KB | 10,6 KB (já inclui as regras das fontes locais) |
| HTML (com JS inline) | 13,8 KB | 9,9 KB de HTML + 1,1 KB de JS |
| Requisições a outros domínios | Google Fonts, gstatic e picsum | **0** |

## Comparativo antes/depois (Lighthouse, mobile)

Valores da **mediana** de 3 execuções em cada versão:

| Métrica | Antes | Depois | Variação |
|---|---|---|---|
| Performance | 89 | **99** | +10 pontos |
| First Contentful Paint (FCP) | 1,6 s | **1,3 s** | -0,3 s |
| Largest Contentful Paint (LCP) | 3,6 s | **1,9 s** | -1,7 s |
| Total Blocking Time (TBT) | 0 ms | **50 ms** | +50 ms |
| Cumulative Layout Shift (CLS) | 0 | **0** | sem mudança |
| Speed Index | 1,6 s | **1,3 s** | -0,3 s |

Todas as métricas ficaram na faixa verde (boa) nas medições finais.

### Execuções individuais

| Execução | Antes (Performance / FCP / LCP) | Depois (Performance / FCP / LCP / TBT) |
|---|---|---|
| 1 | 88 / 1,6 s / 3,8 s | 100 / 1,0 s / 1,7 s / 10 ms |
| 2 | 89 / 1,7 s / 3,6 s | 98 / 1,4 s / 2,0 s / 100 ms |
| 3 | 91 / 1,6 s / 3,5 s | 99 / 1,3 s / 1,9 s / 50 ms |

Prints e relatórios completos: `reports/antes/` e `reports/depois/`.

## O que mais impactou

A mudança de maior impacto foi no **LCP**, que caiu de 3,6 s para 1,9 s. O elemento do LCP era a imagem do hero, que vinha de um serviço externo, em JPEG. Passar a servir essa imagem do próprio site, em WebP, em tamanhos adequados à tela e com `preload`, reduziu o tempo de carregamento do elemento principal da página.

A hospedagem local das fontes eliminou a cadeia de requisições ao Google Fonts, que bloqueava a renderização (810 ms no relatório inicial), e contribuiu para a queda do **FCP** (de 1,6 s para 1,3 s) e do **Speed Index** (de 1,6 s para 1,3 s). O **CLS** permaneceu em 0, ou seja, a troca das fontes não causou deslocamento de layout.

O **TBT** subiu de 0 para 50 ms, mas variou entre 10 e 100 ms nas três execuções com o mesmo código, o que indica oscilação normal da medição, e permaneceu na faixa verde.

As melhorias não foram testadas isoladamente, então o ganho é atribuído ao conjunto das mudanças e não a uma delas em separado.

## Limitações

- O cache dos arquivos é controlado pelo GitHub Pages e não foi alterado.
- A nota do Lighthouse varia entre execuções, por isso foram usadas 3 medições e a mediana.
- As fontes locais são estáticas (um arquivo por peso). O Google Fonts entregava uma versão variável, então pode haver uma diferença mínima no desenho das letras.

## Estrutura do projeto

```
index.html            página publicada (minificada)
css/estilos.min.css   CSS compilado e minificado
js/script.min.js      JavaScript minificado
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
npm run imagens   # gera os arquivos WebP
npm run build     # compila o CSS e minifica JS e HTML
```

Edite sempre os arquivos em `src/` e `sass/` e rode o build. Os arquivos da raiz são gerados.
