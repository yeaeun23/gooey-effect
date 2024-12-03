const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio; // 2

const canvasWidth = 300;
const canvasHeight = 300;

// 브라우저에서의 디스플레이 크기
// 화면에 보이는 캔버스의 크기를 변경
canvas.style.width = canvasWidth + "px";
canvas.style.height = canvasHeight + "px";

// 캔버스의 내부 해상도
// 드로잉 영역의 크기와 해상도를 변경
canvas.width = canvasWidth * dpr; // 600
canvas.height = canvasHeight * dpr;

ctx.scale(dpr, dpr);

// 사각형 그리기
ctx.fillRect(0, 0, 100, 100); // x,y,가로,세로
