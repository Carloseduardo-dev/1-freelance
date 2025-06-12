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
let heartPhotos = []; // Array para controlar as fotos em coração

const frases = [
  "O teu sorriso é onde<br>meu mundo começa🥰💗",
  "Se for pra viver<br>que seja contigo até o<br>fim e depois💖",
  "Te encontrar foi como<br>achar poesia onde só havia silêncio💘",
  "Se eu pudesse escolher de novo<br>escolheria você mil vezes<br>sem pausa💞",
  "No jogo da vida<br>só quero passar de<br>fase contigo💑",
  "Feliz Dia dos Namorados 💖",
  "Você me olhou<br>Gaga cantou o mundo sumiu<br>Eu fiquei em você❤️",
  "Meu prato preferido<br>fica completo<br> só com você<br>do meu lado💕"
];

const fotos = [
  "img01.jpg", "img02.jpg", "img03.jpg",
  "img04.jpg", "img05.jpg", "img06.jpg", "img07.jpg"
];

startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  canvas.style.display = "block";
  ativarToque();
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Função para desenhar coração com imagem no canvas
function drawHeartWithImage(x, y, size, image, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.scale(size / 100, size / 100);
  
  // Criar máscara do coração
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(0, -30, -50, -30, -50, 0);
  ctx.bezierCurveTo(-50, 0, -50, 20, -25, 45);
  ctx.lineTo(0, 70);
  ctx.lineTo(25, 45);
  ctx.bezierCurveTo(50, 20, 50, 0, 50, 0);
  ctx.bezierCurveTo(50, -30, 0, -30, 0, 0);
  ctx.closePath();
  
  // Aplicar máscara
  ctx.clip();
  
  // Desenhar imagem dentro da máscara do coração
  if (image && image.complete) {
    ctx.drawImage(image, -60, -40, 120, 120);
  }
  
  // Adicionar borda brilhante
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = '#ff4081';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#ff4081';
  ctx.shadowBlur = 10;
  ctx.stroke();
  
  ctx.restore();
}

// Classe para foto em coração
function HeartPhoto(x, y, imageSrc) {
  this.x = x;
  this.y = y;
  this.size = 80;
  this.alpha = 0;
  this.targetAlpha = 1;
  this.scale = 0.5;
  this.targetScale = 1;
  this.life = 0;
  this.maxLife = 240; // 4 segundos a 60fps
  
  this.image = new Image();
  this.image.src = imageSrc;
  
  this.update = function() {
    this.life++;
    
    // Animação de entrada
    if (this.life < 18) { // 0.3 segundos
      this.alpha += (this.targetAlpha - this.alpha) * 0.15;
      this.scale += (this.targetScale - this.scale) * 0.15;
    }
    
    // Animação de saída
    if (this.life > this.maxLife - 18) {
      this.targetAlpha = 0;
      this.targetScale = 0.8;
      this.alpha += (this.targetAlpha - this.alpha) * 0.15;
      this.scale += (this.targetScale - this.scale) * 0.15;
    }
    
    // Pulsação suave
    const pulse = Math.sin(this.life * 0.1) * 0.05 + 1;
    this.currentSize = this.size * this.scale * pulse;
  };
  
  this.draw = function() {
    drawHeartWithImage(this.x, this.y, this.currentSize, this.image, this.alpha);
  };
  
  this.isDead = function() {
    return this.life > this.maxLife;
  };
}

function ativarToque() {
  document.body.addEventListener("click", (event) => {
    if (!musicaTocando) {
      musica.volume = 0.6;
      musica.play().catch(e => console.warn("Erro ao tocar música:", e));
      musicaTocando = true;
    }

    if (timeoutAtual) clearTimeout(timeoutAtual);

    const x = event.clientX;
    const y = event.clientY;

    const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
    mensagem.innerHTML = fraseAleatoria;
    mensagem.style.left = `${x}px`;
    mensagem.style.top = `${y}px`;
    mensagem.style.transform = "translate(-50%, -50%)";
    mensagem.style.display = "block";

    // Criar foto em coração no canvas
    const fotoAleatoria = fotos[Math.floor(Math.random() * fotos.length)];
    const offsetX = (Math.random() - 0.5) * 200;
    const offsetY = (Math.random() - 0.5) * 200;
    heartPhotos.push(new HeartPhoto(x + offsetX, y + offsetY, fotoAleatoria));

    timeoutAtual = setTimeout(() => {
      mensagem.style.display = "none";
      timeoutAtual = null;
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
  
  // Atualizar e desenhar corações animados
  particles.forEach((p, i) => {
    p.update();
    p.draw();
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  });
  
  // Atualizar e desenhar fotos em coração
  heartPhotos.forEach((hp, i) => {
    hp.update();
    hp.draw();
    if (hp.isDead()) {
      heartPhotos.splice(i, 1);
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
