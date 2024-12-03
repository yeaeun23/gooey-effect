const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio; // 2

let canvasWidth, canvasHeight, particles;

function init() {
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;

  // 브라우저에서의 디스플레이 크기
  // 화면에 보이는 캔버스의 크기를 변경
  canvas.style.width = canvasWidth + "px";
  canvas.style.height = canvasHeight + "px";

  // 캔버스의 내부 해상도
  // 드로잉 영역의 크기와 해상도를 변경
  canvas.width = canvasWidth * dpr; // 600
  canvas.height = canvasHeight * dpr;

  ctx.scale(dpr, dpr);

  // 원 생성하기
  particles = []; // 원 담을 배열

  const TOTAL = canvasWidth / 10; // 화면 크기에 따른 원 개수

  for (let i = 0; i < TOTAL; i++) {
    const x = randomNumBetween(0, canvasWidth); // 원 중심 x좌표
    const y = randomNumBetween(0, canvasHeight); // 원 중심 y좌표
    const radius = randomNumBetween(50, 100); // 원 반지름
    const vy = randomNumBetween(1, 5); // 원 떨어지는 속도

    const particle = new Particle(x, y, radius, vy);
    particles.push(particle);
  }
}

// 특정값 테스트하기
const gui = new dat.GUI();

const f1 = gui.addFolder("Gooey Effect"); // 값 구분할 폴더 생성
const f2 = gui.addFolder("Particle Property");
f1.open(); // 폴더 열어두기
f2.open();

const controls = new (function () {
  this.blurValue = 40; // 기본값 세팅
  this.alphaChannel = 100;
  this.alphaOffset = -23;
  this.acc = 1.03;
})();

const feGaussianBlur = document.querySelector("feGaussianBlur");
const feColorMatrix = document.querySelector("feColorMatrix");

f1.add(controls, "blurValue", 0, 100).onChange((value) => {
  feGaussianBlur.setAttribute("stdDeviation", value);
});
f1.add(controls, "alphaChannel", 1, 200).onChange((value) => {
  feColorMatrix.setAttribute("values", `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${value} ${controls.alphaOffset}`);
});
f1.add(controls, "alphaOffset", -40, 40).onChange((value) => {
  feColorMatrix.setAttribute("values", `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${controls.alphaChannel} ${value}`);
});
f2.add(controls, "acc", 1, 1.5, 0.01).onChange((value) => {
  particles.forEach((particle) => (particle.acc = value));
});

// 사각형 그리기
//ctx.fillRect(0, 0, 100, 100); // x,y,가로,세로

// 원 그리기
class Particle {
  constructor(x, y, radius, vy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vy = vy;
    this.acc = 1.03;
  }
  update() {
    this.vy *= this.acc;
    this.y += this.vy;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, (Math.PI / 180) * 360); // x,y,r,0˚~360˚(rad)
    ctx.fillStyle = "orange";
    ctx.fill(); // 색 채우기
    ctx.closePath();
  }
}

// [min, max+1) 랜덤값 반환
const randomNumBetween = (min, max) => {
  return Math.random() * (max + 1 - min) + min;
};

const fps = 60;
let interval = 1000 / fps; // 16ms
let now, delta;
let then = Date.now(); // 현재 시간

function animate() {
  window.requestAnimationFrame(animate); // 1초에 60번 실행

  now = Date.now();
  delta = now - then;

  if (delta < interval) {
    return;
  }

  // 기존 원 지우기
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // 새로 원 그리기
  particles.forEach((particle) => {
    particle.update();
    particle.draw();

    // 땅에 완전히 떨어졌을 때
    if (particle.y - particle.radius > canvasHeight) {
      // 맨위로 이동
      particle.y = -particle.radius;

      // 나머지 랜덤값으로 다시
      particle.x = randomNumBetween(0, canvasWidth);
      particle.radius = randomNumBetween(50, 10);
      particle.vy = randomNumBetween(1, 5);
    }
  });

  then = now - (delta % interval);
}

window.addEventListener("load", () => {
  init();
  animate();
});

window.addEventListener("resize", () => {
  init();
});
