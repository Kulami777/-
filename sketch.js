let capture;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#fdf0d5');
  
  // 初始化攝影機
  capture = createCapture(VIDEO);
  capture.size(windowWidth * 0.8, windowHeight * 0.8);
  capture.hide(); // 隱藏原始的 HTML 視訊元素
}

function draw() {
  background('#fdf0d5');
  
  // 計算影像顯示位置，使其居中
  let x = (windowWidth - capture.width) / 2;
  let y = (windowHeight - capture.height) / 2;
  
  // 翻轉畫布並繪製攝影機影像
  push();
  translate(width, 0); // 將畫布原點移到右上角
  scale(-1, 1); // 水平翻轉畫布
  image(capture, x, y, capture.width, capture.height);
  pop();
}

function windowResized() {
  // 當視窗大小改變時，調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
}
