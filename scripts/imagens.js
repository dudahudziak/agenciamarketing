// Gera as versões WebP redimensionadas a partir de src/img-originais/
// Uso: npm run imagens
const sharp = require("sharp");
const path = require("path");

const ORIGEM = path.join(__dirname, "..", "src", "img-originais");
const DESTINO = path.join(__dirname, "..", "img");

const imagens = [
  { arquivo: "hero-1200.jpg", nome: "hero", larguras: [480, 800, 1200], qualidade: 68 },
  { arquivo: "sobre-1000.jpg", nome: "sobre", larguras: [400, 700, 1000], qualidade: 60 }
];

(async () => {
  for (const img of imagens) {
    for (const largura of img.larguras) {
      const saida = path.join(DESTINO, `${img.nome}-${largura}.webp`);
      const info = await sharp(path.join(ORIGEM, img.arquivo))
        .resize({ width: largura })
        .webp({ quality: img.qualidade, effort: 6 })
        .toFile(saida);
      console.log(`${img.nome}-${largura}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
    }
  }
})();
