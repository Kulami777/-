// === 遊戲角色精靈設定 ===
let sprites = {
  idle: {
    img: null,
    width: 385 / 6,    // 待機動畫寬度（總寬度/幀數）
    height: 84,        // 待機動畫高度
    frames: 6          // 待機動畫幀數
  },
  walk: {
    img: null,
    width: 527 / 7,    // 走路動畫寬度
    height: 89,
    frames: 7
  },
  jump: {
    img: null,
    width: 679 / 9,
    height: 87,
    frames: 9
  },
  idle2: {
    img: null,
    width: 491 / 8,
    height: 70,
    frames: 8
  },
  walk2: {
    img: null,
    width: 481 / 8,
    height: 70,
    frames: 8
  },
  jump2: {
    img: null,
    width: 491 / 8,
    height: 70,
    frames: 8
  },
  attack: {
    img: null,
    width: 512 / 6, // 假设攻击动画有6帧
    height: 84,
    frames: 6
  }
};

// === 角色基本屬性設定 ===
let character = {
  x: 200,              // 初始X座標
  y: 200,              // 初始Y座標
  speedX: 15,          // 水平移動速度
  speedY: 5,           // 垂直移動速度
  gravity: 0.8,        // 重力效果
  jumpForce: -10,      // 跳躍力度
  isJumping: false,    // 跳躍狀態
  groundY: 300,        // 地面高度
  currentFrame: 0,     // 當前動畫幀
  currentAction: 'idle', // 當前動作狀態
  direction: 1,        // 朝向（1右/-1左）
  health: 100,         // 生命值
  isAttacking: false,  // 攻擊狀態
  bullets: [],         // 子彈陣列
  lastShootTime: 0,    // 上次射擊時間
  shootCooldown: 500   // 射擊冷卻時間
};

let character2 = {
  x: 400,
  y: 200,
  speedX: 15,
  speedY: 5,
  gravity: 0.8,
  jumpForce: -10,
  isJumping: false,
  groundY: 300,
  currentFrame: 0,
  currentAction: 'idle',
  direction: 1,
  health: 100,
  isAttacking: false,
  bullets: [],
  lastShootTime: 0,
  shootCooldown: 500
};

// === 全局遊戲變量 ===
let bgImage;           // 背景圖片
let attackSprite;      // 攻擊特效圖片
let explosions = [];   // 爆炸效果陣列
let bgX = 0;          // 背景X座標
const bgScrollSpeed = 0.5;  // 背景滾動速度

// === 對話系統變量 ===
let dialogues = [];    // 對話陣列
let showDialogue = false;  // 顯示對話狀態
let dialogueTimer = 0;     // 對話計時器
const dialogueDuration = 3000; // 對話持續時間

// === 音樂系統變量 ===
let bgMusic;           // 背景音樂
let isMusicPlaying = false; // 音樂播放狀態

// === 對話框類定義 ===
class Dialogue {
  constructor(speaker, text, x, y) {
    this.speaker = speaker;  // 說話者
    this.text = text;       // 對話內容
    this.x = x;             // 對話框X座標
    this.y = y;             // 對話框Y座標
  }

  // 繪製對話框
  draw() {
    push();
    // 對話框背景
    fill(255, 255, 255, 200);
    stroke(0);
    strokeWeight(2);
    rect(this.x, this.y - 30, 200, 50, 10);
    
    // 對話文字
    fill(0);
    noStroke();
    textSize(16);
    textAlign(LEFT, CENTER);
    text(this.text, this.x + 10, this.y - 10);
    pop();
  }
}

// === 遊戲重置函數 ===
function resetGame() {
  // 重置玩家1（保持位置）
  character = {
    x: character.x,     // 保持現有位置
    y: character.y,
    // ... 重置其他屬性 ...
  };

  // 重置遊戲元素
  explosions = [];
  dialogues = [];
  showDialogue = false;
}

function preload() {
  bgImage = loadImage('43889983.jpg');
  sprites.idle.img = loadImage('idle.png');
  sprites.walk.img = loadImage('walk.png');
  sprites.jump.img = loadImage('jump.png');
  sprites.idle2.img = loadImage('idle2.png');
  sprites.walk2.img = loadImage('walk2.png');
  sprites.jump2.img = loadImage('jump2.png');
  sprites.attack.img = loadImage('attack.png');  // 添加攻击动画图片
  attackSprite = loadImage('attack.png');
  bgMusic = loadSound('yume.mp3');  // 確保音樂文件放在正確目錄
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(12);
  
  // 設置背景音樂
  bgMusic.setVolume(0.5);  // 設置音量（0.0 到 1.0）
  bgMusic.loop();  // 設置循環播放
}

function draw() {
  // 清空畫布
  background(220);
  
  // 更新遊戲狀態
  updatePhysics();
  checkCollisions();
  updateAnimations();
  
  // 繪製遊戲元素
  drawBackground();
  drawCharacters();
  drawEffects();
  drawUI();
}

function updatePhysics() {
  applyGravity(character);
  character.x = constrain(character.x, 0, width - sprites[character.currentAction].width);

  applyGravity(character2);
  character2.x = constrain(character2.x, 0, width - sprites[character2.currentAction].width);
}

function applyGravity(char) {
  if (char.y < char.groundY) {
    char.speedY += char.gravity;
    char.isJumping = true;
  } else {
    char.speedY = 0;
    char.isJumping = false;
  }

  char.y += char.speedY;

  if (char.y > char.groundY) {
    char.y = char.groundY;
    char.isJumping = false;
  }
}

function drawCharacter(char, spriteSet, isSecond = false) {
  let spriteKey = char.currentAction;
  if (isSecond) spriteKey += '2';

  let sprite = spriteSet[spriteKey];
  if (!sprite || !sprite.img) return;

  char.currentFrame = (char.currentFrame + 1) % sprite.frames;
  let sx = char.currentFrame * sprite.width;

  push();
  translate(char.x + (char.direction === -1 ? sprite.width : 0), char.y);
  scale(char.direction, 1);
  image(
    sprite.img,
    0,
    0,
    sprite.width,
    sprite.height,
    sx,
    0,
    sprite.width,
    sprite.height
  );
  pop();
}

function drawHealthBar(char, x, y) {
  fill(255, 0, 0);
  rect(x, y, 100, 20); // 绘制血条背景
  fill(0, 255, 0);
  rect(x, y, (char.health / 100) * 100, 20); // 绘制当前血量
}

function checkKeys() {
  // 第一角色的控制
  if (keyIsDown(RIGHT_ARROW)) {
    character.x += character.speedX;
    character.currentAction = 'walk';
    character.direction = 1;
  } else if (keyIsDown(LEFT_ARROW)) {
    character.x -= character.speedX;
    character.currentAction = 'walk';
    character.direction = -1;
  } else if (!character.isJumping && !character.isAttacking) {
    character.currentAction = 'idle';
  }

  if (keyIsDown(UP_ARROW) && !character.isJumping) {
    character.speedY = character.jumpForce;
    character.currentAction = 'jump';
  }

  if (keyIsDown(32) && !character.isAttacking) {  // 空格键攻击
    character.currentAction = 'attack';
    character.isAttacking = true;
  }

  // 第二角色的控制
  if (keyIsDown(68)) {
    character2.x += character2.speedX;
    character2.currentAction = 'walk';
    character2.direction = 1;
  } else if (keyIsDown(65)) {
    character2.x -= character2.speedX;
    character2.currentAction = 'walk';
    character2.direction = -1;
  } else if (!character2.isJumping && !character2.isAttacking) {
    character2.currentAction = 'idle';
  }

  if (keyIsDown(87) && !character2.isJumping) {
    character2.speedY = character2.jumpForce;
    character2.currentAction = 'jump';
  }

  if (keyIsDown(90) && !character2.isAttacking) {  // Z 键攻击
    character2.currentAction = 'attack';
    character2.isAttacking = true;
  }
}

function checkAttack() {
  if (character.isAttacking && character.x + 50 > character2.x && character.x - 50 < character2.x + 50 && character.y < character2.y + 50) {
    character2.health -= 10; // 当攻击到第二角色时扣血
    character.isAttacking = false;
  }

  if (character2.isAttacking && character2.x + 50 > character.x && character2.x - 50 < character.x + 50 && character2.y < character.y + 50) {
    character.health -= 10; // 当攻击到第一角色时扣血
    character2.isAttacking = false;
  }
}

function keyPressed() {
  // 玩家1控制
  if (key === 'a') {          // 向左移動
    character.direction = -1;
    character.currentAction = 'walk';
  }
  if (key === 'd') {          // 向右移動
    character.direction = 1;
    character.currentAction = 'walk';
  }
  if (key === 'w') {          // 跳躍
    character.velocityY = -15;
    character.isJumping = true;
  }
  if (key === 'f') {          // 射擊
    if (millis() - character.lastShootTime > character.shootCooldown) {
      character.bullets.push({
        x: character.x + (character.direction === 1 ? sprites[character.currentAction].width : 0),
        y: character.y + sprites[character.currentAction].height/2,
        speed: character.direction * 10
      });
      character.lastShootTime = millis();
    }
  }
  
  // 系統控制
  if (key === 't') {          // 觸發對話
    startDialogue();
  }
  if (key === 'm') {          // 音樂控制
    toggleMusic();
  }
  if (key === 'p') {          // 重置遊戲
    resetGame();
  }
}

function keyReleased() {
  // 玩家1停止移動
  if (key === 'a' && character.direction === -1) {
    character.isMoving = false;
    character.currentAction = 'idle';
    // 功能：停止向左移動，切換回待機動畫
  }
  if (key === 'd' && character.direction === 1) {
    character.isMoving = false;
    character.currentAction = 'idle';
    // 功能：停止向右移動，切換回待機動畫
  }

  // 玩家2停止移動
  if (keyCode === LEFT_ARROW && character2.direction === -1) {
    character2.isMoving = false;
    character2.currentAction = 'idle';
    // 功能：停止向左移動，切換回待機動畫
  }
  if (keyCode === RIGHT_ARROW && character2.direction === 1) {
    character2.isMoving = false;
    character2.currentAction = 'idle';
    // 功能：停止向右移動，切換回待機動畫
  }
}

function updateBullets(bullets) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].x += bullets[i].speed;
    
    // 移除超出屏幕的子弹
    if (bullets[i].x < 0 || bullets[i].x > width) {
      bullets.splice(i, 1);
    }
  }
}

function drawBullets(bullets) {
  fill(255, 255, 0);
  for (let bullet of bullets) {
    ellipse(bullet.x, bullet.y, 10, 10);
  }
}

function checkBulletCollisions() {
  // 检查玩家1的子弹是否击中玩家2
  for (let i = character.bullets.length - 1; i >= 0; i--) {
    let bullet = character.bullets[i];
    if (bullet.x > character2.x && 
        bullet.x < character2.x + sprites[character2.currentAction].width &&
        bullet.y > character2.y && 
        bullet.y < character2.y + sprites[character2.currentAction].height) {
      character2.health -= 5;  // 子弹伤害
      character.bullets.splice(i, 1);
    }
  }
  
  // 检查玩家2的子弹是否击中玩家1
  for (let i = character2.bullets.length - 1; i >= 0; i--) {
    let bullet = character2.bullets[i];
    if (bullet.x > character.x && 
        bullet.x < character.x + sprites[character.currentAction].width &&
        bullet.y > character.y && 
        bullet.y < character.y + sprites[character.currentAction].height) {
      character.health -= 5;  // 子弹伤害
      character2.bullets.splice(i, 1);
    }
  }
}

// 添加爆炸效果类
class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 100;  // 爆炸效果的大小
    this.alpha = 255; // 透明度
    this.fadeSpeed = 10; // 淡出速度
  }

  update() {
    this.alpha -= this.fadeSpeed;
    return this.alpha > 0;
  }

  draw() {
    push();
    tint(255, this.alpha);
    imageMode(CENTER);
    image(attackSprite, this.x, this.y, this.size, this.size);
    pop();
  }
}

// 添加角色碰撞检测函数
function checkCharacterCollision() {
  let char1Width = sprites[character.currentAction].width;
  let char1Height = sprites[character.currentAction].height;
  let char2Width = sprites[character2.currentAction].width;
  let char2Height = sprites[character2.currentAction].height;
  
  if (character.x < character2.x + char2Width &&
      character.x + char1Width > character2.x &&
      character.y < character2.y + char2Height &&
      character.y + char1Height > character2.y) {
    
    // 计算碰撞中心点
    let centerX = (character.x + char1Width/2 + character2.x + char2Width/2) / 2;
    let centerY = (character.y + char1Height/2 + character2.y + char2Height/2) / 2;
    
    // 创建新的爆炸效果
    explosions.push(new Explosion(centerX, centerY));
    
    // 角色受伤
    character.health = Math.max(0, character.health - 1);
    character2.health = Math.max(0, character2.health - 1);
  }
}

// 添加背景繪製函數
function drawScrollingBackground() {
  // 計算背景位置
  if (character.isMoving) {
    if (character.direction === 1) {
      bgX -= bgScrollSpeed;  // 角色向右移動時，背景向左滾動
    } else if (character.direction === -1) {
      bgX += bgScrollSpeed;  // 角色向左移動時，背景向右滾動
    }
  }
  
  if (character2.isMoving) {
    if (character2.direction === 1) {
      bgX -= bgScrollSpeed;
    } else if (character2.direction === -1) {
      bgX += bgScrollSpeed;
    }
  }
  
  // 確保背景無縫循環
  let bgWidth = width;
  bgX = bgX % bgWidth;
  if (bgX > 0) {
    bgX -= bgWidth;
  }
  
  // 繪製兩張背景圖以實現無縫滾動
  image(bgImage, bgX, 0, width, height);
  image(bgImage, bgX + width, 0, width, height);
}

// 添加觸發對話的函數
function startDialogue() {
  dialogues = [];
  // 角色1的對話
  dialogues.push(new Dialogue(
    'character1',
    '你是什麼系？',
    character.x,
    character.y - 50
  ));
  
  // 角色2的對話（延遲1秒後顯示）
  setTimeout(() => {
    dialogues.push(new Dialogue(
      'character2',
      '我是教科系！',
      character2.x,
      character2.y - 50
    ));
  }, 1000);
  
  showDialogue = true;
  dialogueTimer = millis();
}

// 添加音樂控制功能
function toggleMusic() {
  if (isMusicPlaying) {
    bgMusic.pause();
    isMusicPlaying = false;
  } else {
    bgMusic.play();
    isMusicPlaying = true;
  }
}
