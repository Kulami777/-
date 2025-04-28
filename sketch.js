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
  capture.style('transform', 'scaleX(-1)'); // 翻轉攝影機畫面
  capture.hide(); // 隱藏原始的 HTML 視訊元素

  // 建立與攝影機畫面相同大小的圖形緩衝區
  overlayGraphics = createGraphics(capture.width, capture.height);
}

function draw() {
  background('#fdf0d5');
  
  // 計算影像顯示位置，使其居中
  let x = (windowWidth - capture.width) / 2;
  let y = (windowHeight - capture.height) / 2;
  
  // 繪製攝影機影像（正常方向）
  image(capture, x, y, capture.width, capture.height);

  // 更新 overlayGraphics 的內容
  overlayGraphics.clear(); // 清除之前的內容
  overlayGraphics.background(0); // 設定背景為黑色

  // 繪製方框與圓形網格
  for (let i = 0; i < overlayGraphics.width; i += 20) {
    for (let j = 0; j < overlayGraphics.height; j += 20) {
      // 從 capture 中取得對應位置的顏色
      let col = capture.get(i, j);
      let g = green(col); // 保留 G 值
      overlayGraphics.fill(0, g, 0); // 方框顏色：R 和 B 為 0，G 為原始值
      overlayGraphics.noStroke();
      overlayGraphics.rect(i + 1, j + 1, 18, 18); // 繪製方框，寬高為 18

      // 繪製中間的黑色圓
      overlayGraphics.fill(0); // 圓的顏色為黑色
      overlayGraphics.ellipse(i + 10, j + 10, 5, 5); // 圓的直徑為 5
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
