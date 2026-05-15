let rabbit;
let tasks = [];
let taskInput;
let pg;
let showCard = false;
let quote = "";
let cardFade = 0;
const quotes = [
  "천 리 길도 한 걸음부터 시작이라.",
  "산 위에서 보면 세상은 한 폭의 그림이어라.",
  "부지런한 토끼가 깊은 산을 넘는 법.",
  "오늘의 수고가 모여 태산을 이루리니.",
  "구름을 벗어난 달처럼 묵묵히 가라.",
  "바다를 건넌 토끼가 산을 못 넘으랴."
];
function setup() {
  createCanvas(800, 600);
  // 산수화가 그려지는 공간
  pg = createGraphics(800, 300);
  pg.background(245, 240, 225);
  
  rabbit = new Rabbit();
  // UI: 입력창 및 버튼
  taskInput = createInput('');
  taskInput.size(200);
  taskInput.position(30, height - 50);
  
  let btn = createButton('할 일 추가');
  btn.position(taskInput.x + taskInput.width + 10, height - 50);
  btn.mousePressed(addTask);
  quote = random(quotes);
}function draw() {
  background(245, 240, 225);
  // 1. 산수화 캔버스 출력
  image(pg, 0, 50);
  // 2. 토끼 점프 애니메이션
  rabbit.update();
  rabbit.show();
  // 3. 할 일 목록 UI
  drawTaskList();
  // 4. 포토카드 연출
  if (showCard) {
    displayPhotoCard();
  }
}function addTask() {
  let val = taskInput.value();
  if (val !== "" && tasks.length < 8) {
    tasks.push({ text: val, done: false });
    taskInput.value('');
  }
}function drawTaskList() {
  fill(50);
  textAlign(LEFT);
  textSize(16);
  text("📜 오늘의 수궁가 할 일 (체크 시 산이 생깁니다)", 30, 380);
  
  for (let i = 0; i < tasks.length; i++) {
    let y = 415 + i * 28;
    let t = tasks[i];
    
    // 체크박스 영역
    stroke(100);
    fill(t.done ? 50 : 255);
    rect(30, y - 15, 18, 18, 3);
    
    // 할 일 텍스트
    noStroke();
    fill(t.done ? 150 : 0);
    textSize(15);
    text(t.text, 60, y);
    
    if (t.done) {
      stroke(150);
      line(60, y - 5, 60 + textWidth(t.text), y - 5);
    }
  }
}function mousePressed() {
  if (showCard) return;
  // 리스트 체크 감지
  for (let i = 0; i < tasks.length; i++) {
    let y = 415 + i * 28;
    if (mouseX > 30 && mouseX < 300 && mouseY > y - 20 && mouseY < y) {
      if (!tasks[i].done) {
        tasks[i].done = true;
        rabbit.jump(); // 체크하는 순간 토끼가 산을 그리며 점프
        checkProgress();
      }
    }
  }
}function checkProgress() {
  let allDone = tasks.length > 0 && tasks.every(t => t.done);
  if (allDone) {
    setTimeout(() => { showCard = true; }, 1200);
  }
}class Rabbit {
  constructor() {
    this.startX = 50;
    this.x = this.startX;
    this.y = 350;
    this.vy = 0;
    this.gravity = 1.2;
    this.isJumping = false;
    this.trail = [];
  }
  jump() {
    this.vy = -random(15, 28); // 높이 랜덤
    this.sideSpeed = random(3, 6); // 너비 랜덤
    this.isJumping = true;
    this.trail = [];
  }
  update() {
    if (this.isJumping) {
      this.vy += this.gravity;
      this.y += this.vy;
      this.x += this.sideSpeed;
      this.trail.push({x: this.x, y: this.y});
      if (this.y >= 350) {
        this.y = 350;
        this.isJumping = false;
        this.drawMountain();
        // 화면 밖으로 너무 나가면 위치 리셋 (순환)
        if (this.x > width - 100) this.x = this.startX;
      }
    }
  }
  drawMountain() {
    pg.push();
    // 랜덤 농담
    let inkAlpha = random(40, 110);
    pg.fill(0, inkAlpha);
    pg.noStroke();
    pg.beginShape();
    pg.vertex(this.trail[0].x, 300);
    for (let p of this.trail) {
      pg.curveVertex(p.x, p.y - 50);
    }
    pg.vertex(this.trail[this.trail.length - 1].x, 300);
    pg.endShape(CLOSE);
    
    // 능선 진한 선
    pg.noFill();
    pg.stroke(20, 180);
    pg.strokeWeight(2);
    pg.beginShape();
    for (let p of this.trail) {
      pg.curveVertex(p.x, p.y - 50);
    }
    pg.endShape();
    pg.pop();
  }
  show() {
    noStroke();
    fill(50);
    rect(this.x, this.y, 30, 30, 5);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(10);
    text("토끼", this.x + 15, this.y + 15);
  }
}function displayPhotoCard() {
  cardFade = min(cardFade + 10, 200);
  fill(0, cardFade);
  rect(0, 0, width, height);
  
  push();
  translate(width / 2 - 175, height / 2 - 250);
  
  // 카드 본체
  fill(245, 240, 225);
  stroke(180, 40, 40);
  strokeWeight(6);
  rect(0, 0, 350, 500, 20);
  
  // 산수화 복사본 (상단)
  image(pg, 25, 60, 300, 180, 0, 0, pg.width, pg.height);
  
  // 텍스트 꾸미기
  noStroke();
  fill(0);
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(24);
  text("오늘의 서찰", 175, 300);
  
  stroke(0, 50);
  line(100, 315, 250, 315);
  
  noStroke();
  textStyle(NORMAL);
  textSize(18);
  // 시조 표시 (줄바꿈 고려)
  textWrap(WORD);
  text(quote, 50, 340, 250);
  
  // 하단 낙관
  stroke(180, 40, 40);
  strokeWeight(2);
  noFill();
  rect(270, 420, 45, 45);
  fill(180, 40, 40);
  noStroke();
  textSize(12);
  text("수궁\n토끼", 292.5, 442.5);
  
  pop();
}

 