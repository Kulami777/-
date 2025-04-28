let capture;
let overlayGraphics;
let textY = 0; // 文字的垂直位置
let textSpeed = 2; // 文字移動的速度

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#fdf0d5');
  
  // 初始化攝影機
  capture = createCapture(VIDEO);
  capture.size(windowWidth * 0.8, windowHeight * 0.8);
  capture.hide(); // 隱藏原始的 HTML 視訊元素

  // 建立與攝影機畫面相同大小的圖形緩衝區
  overlayGraphics = createGraphics(capture.width, capture.height);
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
  image(capture, -x - capture.width, y, capture.width, capture.height);
  pop();

  // 更新 overlayGraphics 的內容
  overlayGraphics.clear(); // 清除之前的內容
  overlayGraphics.background(0); // 設定背景為黑色

  // 繪製圓形網格
  for (let i = 0; i < overlayGraphics.width; i += 20) {
    for (let j = 0; j < overlayGraphics.height; j += 20) {
      // 從 capture 中取得對應位置的顏色
      let col = capture.get(i, j);
      overlayGraphics.fill(col);
      overlayGraphics.noStroke();
      overlayGraphics.ellipse(i + 10, j + 10, 15, 15); // 圓的寬與高為 15
    }
  }

  // 在 overlayGraphics 上繪製文字
  overlayGraphics.fill(255);
  overlayGraphics.textSize(32);
  overlayGraphics.textAlign(CENTER, CENTER);
  overlayGraphics.text('休寧凱老婆', overlayGraphics.width / 2, textY);

  // 更新文字垂直位置
  textY += textSpeed;
  if (textY > overlayGraphics.height || textY < 0) {
    textSpeed *= -1; // 反轉方向
  }

  // 繪製 overlayGraphics 在攝影機畫面上方
  image(overlayGraphics, x, y, capture.width, capture.height);
}

function windowResized() {
  // 當視窗大小改變時，調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
}
