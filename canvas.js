const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const mensagem = document.getElementById("mensagem");
const startButton = document.getElementById("startButton");
const musica = document.getElementById("musica");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let musicaTocando = false;
let timeoutAtual = null;
let timeoutFoto = null;

const frases = [
  "O teu sorriso é onde<br>meu mundo começa🥰💗",
  "Se for pra viver<br>que seja contigo até o<br>fim e depois💖",
  "Te encontrar foi como<br>achar poesia onde só havia silêncio💘",
  "Se eu pudesse escolher de novo<br>escolheria você mil vezes<br>sem pausa💞",
  "No jogo da vida<br>só quero passar de<br>fase contigo💑",
  "Feliz Dia dos Namorados 💖",
  "Você me olhou<br>Gaga cantou o mundo sumiu<br>Eu fiquei em você❤️",
  "Meu prato preferido<br>fica completo<br> só com você<br>do meu lado💕"
];

const fotos = [
  "img01.jpg", "img02.jpg", "img03.jpg",
  "img04.jpg", "img05.jpg", "img06.jpg", "img07.jpg"
];

const fotoElement = document.createElement('div');
fotoElement.style.position = 'absolute';
fotoElement.style.width = '100px';
fotoElement.style.height = '90px';
fotoElement.style.display = 'none';
fotoElement.style.zIndex = '1';
fotoElement.style.pointerEvents = 'none';
fotoElement.style.transformOrigin = 'center';

const style = document.createElement('style');
style.textContent = `
  .heart-photo {
    position: relative;
    width: 100px;
    height: 90px;
    transform: rotate(-45deg);
    background-size: cover !important;
    background-position: center !important;
    filter: drop-shadow(0 0 10px #ff4081);
  }
  .heart-photo:before,
  .heart-photo:after {
    content: '';
    width: 52px;
    height: 80px;
    position: absolute;
    left: 50px;
    top: 0;
    background: inherit;
    background-size: inherit !important;
    background-position: inherit !important;
    border-radius: 50px 50px 0 0;
    transform: rotate(-45deg);
    transform-origin: 0 100%;
  }
  .heart-photo:after {
    left: 0;
    transform: rotate(45deg);
    transform-origin: 100% 100%;
  }
`;
document.head.appendChild(style);
document.body.appendChild(fotoElement);

startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  canvas.style.display = "block";
  ativarToque();
});

// Atualizar canvas quando a tela mudar de tamanho (responsivo)
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function ativarToque() {
  document.body.addEventListener("click", (event) => {
    if (!musicaTocando) {
      musica.volume = 0.6;
      musica.play().catch(e => console.warn("Erro ao tocar música:", e));
      musicaTocando = true;
    }

    if (timeoutAtual) clearTimeout(timeoutAtual);
    if (timeoutFoto) clearTimeout(timeoutFoto);

    const x = event.clientX;
    const y = event.clientY;

    const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
    mensagem.innerHTML = fraseAleatoria;
    mensagem.style.left = `${x}px`;
    mensagem.style.top = `${y}px`;
    mensagem.style.transform = "translate(-50%, -50%)";
    mensagem.style.display = "block";

    const fotoAleatoria = fotos[Math.floor(Math.random() * fotos.length)];
    fotoElement.style.backgroundImage = `url(${fotoAleatoria})`;
    fotoElement.className = 'heart-photo';
    const offsetX = (Math.random() - 0.5) * 200;
    const offsetY = (Math.random() - 0.5) * 200;
    fotoElement.style.left = `${x + offsetX}px`;
    fotoElement.style.top = `${y + offsetY}px`;
    fotoElement.style.transform = "translate(-50%, -50%) rotate(-45deg)";
    fotoElement.style.display = "block";

    timeoutAtual = setTimeout(() => {
      mensagem.style.display = "none";
      timeoutAtual = null;
    }, 4000);

    timeoutFoto = setTimeout(() => {
      fotoElement.style.display = "none";
      timeoutFoto = null;
    }, 4000);

    // 💥 Boom de corações no clique
    for (let i = 0; i < 20; i++) {
      particles.push(new HeartParticle(false, x, y));
    }
  });
}

function HeartParticle(isSmall = false, originX = null, originY = null) {
  this.x = originX ?? Math.random() * canvas.width;
  this.y = originY ?? Math.random() * canvas.height;
  this.size = isSmall ? Math.random() * 4 + 3 : Math.random() * 6 + 6;
  this.speedX = (Math.random() - 0.5) * 4;
  this.speedY = (Math.random() - 0.5) * 4;
  this.alpha = 1;

  this.update = function () {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= 0.008;
  };

  this.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.PI);
    ctx.scale(this.size / 20, this.size / 20);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(0, -3, -5, -15, -15, -15);
    ctx.bezierCurveTo(-35, -15, -35, 10, -35, 10);
    ctx.bezierCurveTo(-35, 30, -15, 45, 0, 60);
    ctx.bezierCurveTo(15, 45, 35, 30, 35, 10);
    ctx.bezierCurveTo(35, 10, 35, -15, 15, -15);
    ctx.bezierCurveTo(5, -15, 0, -3, 0, 0);
    ctx.fillStyle = getRandomRed();
    ctx.shadowColor = "#ff69b4";
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.restore();
  };
}

function getRandomRed() {
  const reds = ["#ff4d6d", "#ff1a4b", "#ff0033", "#ff3366", "#ff6666"];
  return reds[Math.floor(Math.random() * reds.length)];
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  });
  requestAnimationFrame(animate);
}

// Corações de fundo contínuos
setInterval(() => {
  for (let i = 0; i < 5; i++) {
    particles.push(new HeartParticle(true));
  }
}, 200);

animate();
