// Gera as versões WebP recortadas e redimensionadas a partir de src/img-originais/
// Uso: npm run imagens
//
// razao:    proporção (largura, altura) com que a imagem aparece no site
// posicaoX: onde fazer o recorte na horizontal (0 = esquerda, 0.5 = centro, 1 = direita)
const sharp = require("sharp");
const path = require("path");

const ORIGEM = path.join(__dirname, "..", "src", "img-originais");
const DESTINO = path.join(__dirname, "..", "img");

const imagens = [
  { arquivo: "hero-original.jpg", nome: "hero", larguras: [480, 800, 1200], razao: [8, 7], posicaoX: 0.6, qualidade: 68 },
  { arquivo: "sobre-original.jpg", nome: "sobre", larguras: [400, 700, 1000], razao: [35, 26], posicaoX: 0, qualidade: 60 }
];

(async () => {
  for (const img of imagens) {
    const caminho = path.join(ORIGEM, img.arquivo);
    const meta = await sharp(caminho).metadata();

    // recorte na proporção do site
    const [rw, rh] = img.razao;
    const larguraRecorte = Math.min(meta.width, Math.round((meta.height * rw) / rh));
    const alturaRecorte = Math.round((larguraRecorte * rh) / rw);
    const esquerda = Math.round((meta.width - larguraRecorte) * img.posicaoX);
    const recorte = { left: esquerda, top: 0, width: larguraRecorte, height: alturaRecorte };

    for (const largura of img.larguras) {
      const altura = Math.round((largura * rh) / rw);
      const saida = path.join(DESTINO, `${img.nome}-${largura}.webp`);
      const info = await sharp(caminho)
        .extract(recorte)
        .resize({ width: largura, height: altura })
        .webp({ quality: img.qualidade, effort: 6 })
        .toFile(saida);
      console.log(`${img.nome}-${largura}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
    }
  }
})();
