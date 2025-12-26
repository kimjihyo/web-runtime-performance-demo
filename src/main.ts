import "./style.css";

const randomNicknames = [
  "CodingNinja",
  "PixelWizard",
  "ByteMaster",
  "DevGuru",
  "CodeWarrior",
  "TechSage",
  "DataDragon",
  "AlgoKnight",
  "BugSlayer",
  "SyntaxSensei",
  "CloudCaptain",
  "LoopLegend",
  "StackSorcerer",
  "GitGhost",
  "MergeMonk",
];

const getRandomNickname = (): string => {
  return randomNicknames[Math.floor(Math.random() * randomNicknames.length)];
};

interface Cursor {
  element: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const cursors: Cursor[] = [];
let speedMultiplier = 1;
let currentAnimationId: number | null = null;
let currentVersion = 3;

function createCursor(): Cursor {
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  cursor.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 3.5L19.5 12L12 14L9 21.5L5.5 3.5Z" fill="#FF6B6B" stroke="white" stroke-width="2" stroke-linejoin="round"/>
    </svg>
    <span class="cursor-nickname">${getRandomNickname()}</span>
  `;
  document.body.appendChild(cursor);

  const x = Math.random() * WINDOW_WIDTH;
  const y = Math.random() * WINDOW_HEIGHT;
  const vx = (Math.random() - 0.5) * 4 * speedMultiplier;
  const vy = (Math.random() - 0.5) * 4 * speedMultiplier;

  // 현재 버전에 맞는 스타일 적용
  if (currentVersion === 1 || currentVersion === 2) {
    cursor.style.left = x + "px";
    cursor.style.top = y + "px";
  } else {
    cursor.style.transform = `translate(${x}px, ${y}px)`;
  }

  return { element: cursor, x, y, vx, vy };
}

function removeCursor() {
  const cursor = cursors.pop();
  if (cursor) {
    cursor.element.remove();
  }
}

function setCursorCount(count: number) {
  while (cursors.length < count) {
    cursors.push(createCursor());
  }
  while (cursors.length > count) {
    removeCursor();
  }
  updateCountDisplay();
}

function updateCountDisplay() {
  const countDisplay = document.getElementById("cursor-count");
  if (countDisplay) {
    countDisplay.textContent = cursors.length.toString();
  }
}

function updateSpeedDisplay() {
  const speedDisplay = document.getElementById("speed-value");
  if (speedDisplay) {
    speedDisplay.textContent = speedMultiplier.toFixed(1);
  }
}

function updateCursorSpeeds() {
  cursors.forEach((cursor) => {
    const currentSpeed = Math.sqrt(cursor.vx ** 2 + cursor.vy ** 2);
    const direction = Math.atan2(cursor.vy, cursor.vx);
    const newSpeed = 4 * speedMultiplier;
    cursor.vx = Math.cos(direction) * newSpeed;
    cursor.vy = Math.sin(direction) * newSpeed;
  });
}

function resetCursorStyles(version: number) {
  cursors.forEach((cursor) => {
    // 모든 스타일 초기화
    cursor.element.style.left = "";
    cursor.element.style.top = "";
    cursor.element.style.transform = "";

    // 버전에 맞는 스타일 설정
    if (version === 1 || version === 2) {
      cursor.element.style.left = cursor.x + "px";
      cursor.element.style.top = cursor.y + "px";
    } else {
      cursor.element.style.transform = `translate(${cursor.x}px, ${cursor.y}px)`;
    }
  });
}

function switchVersion(version: number) {
  if (currentAnimationId !== null) {
    cancelAnimationFrame(currentAnimationId);
  }

  currentVersion = version;

  // 버전 전환 시 커서 스타일 초기화
  resetCursorStyles(version);

  if (version === 1) {
    animate1();
  } else if (version === 2) {
    animate2();
  } else {
    animate3();
  }
}

const CURSOR_WIDTH = 150; // 대략적인 커서 + 닉네임 너비
const CURSOR_HEIGHT = 30; // 대략적인 커서 높이
const WINDOW_WIDTH = window.innerWidth;
const WINDOW_HEIGHT = window.innerHeight;

// 버전 1: 성능이 안좋은 버전 - getBoundingClientRect() 사용
function animate1() {
  cursors.forEach((cursor) => {
    const rect = cursor.element.getBoundingClientRect();
    const currentX = rect.left;
    const currentY = rect.top;

    // 경계 체크 및 속도 반전
    if (
      currentX + cursor.vx <= 0 ||
      currentX + cursor.vx + CURSOR_WIDTH >= WINDOW_WIDTH
    ) {
      cursor.vx = -cursor.vx;
    }
    if (
      currentY + cursor.vy <= 0 ||
      currentY + cursor.vy + CURSOR_HEIGHT >= WINDOW_HEIGHT
    ) {
      cursor.vy = -cursor.vy;
    }

    let newX = currentX + cursor.vx;
    let newY = currentY + cursor.vy;

    // 범위 제한
    newX = Math.max(0, Math.min(WINDOW_WIDTH - CURSOR_WIDTH, newX));
    newY = Math.max(0, Math.min(WINDOW_HEIGHT - CURSOR_HEIGHT, newY));

    cursor.element.style.left = newX + "px";
    cursor.element.style.top = newY + "px";

    cursor.x = newX;
    cursor.y = newY;
  });

  currentAnimationId = requestAnimationFrame(animate1);
}

// 버전 2: 최적화된 버전 - 저장된 좌표 사용 (left/top)
function animate2() {
  cursors.forEach((cursor) => {
    // 경계 체크 및 속도 반전
    if (
      cursor.x + cursor.vx <= 0 ||
      cursor.x + cursor.vx + CURSOR_WIDTH >= WINDOW_WIDTH
    ) {
      cursor.vx = -cursor.vx;
    }
    if (
      cursor.y + cursor.vy <= 0 ||
      cursor.y + cursor.vy + CURSOR_HEIGHT >= WINDOW_HEIGHT
    ) {
      cursor.vy = -cursor.vy;
    }

    cursor.x += cursor.vx;
    cursor.y += cursor.vy;

    // 범위 제한
    cursor.x = Math.max(0, Math.min(WINDOW_WIDTH - CURSOR_WIDTH, cursor.x));
    cursor.y = Math.max(0, Math.min(WINDOW_HEIGHT - CURSOR_HEIGHT, cursor.y));

    cursor.element.style.left = cursor.x + "px";
    cursor.element.style.top = cursor.y + "px";
  });

  currentAnimationId = requestAnimationFrame(animate2);
}

// 버전 3: 최종 최적화 버전 - transform translate 사용
function animate3() {
  cursors.forEach((cursor) => {
    // 경계 체크 및 속도 반전
    if (
      cursor.x + cursor.vx <= 0 ||
      cursor.x + cursor.vx + CURSOR_WIDTH >= WINDOW_WIDTH
    ) {
      cursor.vx = -cursor.vx;
    }
    if (
      cursor.y + cursor.vy <= 0 ||
      cursor.y + cursor.vy + CURSOR_HEIGHT >= WINDOW_HEIGHT
    ) {
      cursor.vy = -cursor.vy;
    }

    cursor.x += cursor.vx;
    cursor.y += cursor.vy;

    // 범위 제한
    cursor.x = Math.max(0, Math.min(WINDOW_WIDTH - CURSOR_WIDTH, cursor.x));
    cursor.y = Math.max(0, Math.min(WINDOW_HEIGHT - CURSOR_HEIGHT, cursor.y));

    cursor.element.style.transform = `translate(${cursor.x}px, ${cursor.y}px)`;
  });

  currentAnimationId = requestAnimationFrame(animate3);
}

// UI 생성
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="controls">
    <div class="control-group">
      <label>버전 선택:</label>
      <div class="version-buttons">
        <button class="version-btn" data-version="1">버전 1</button>
        <button class="version-btn" data-version="2">버전 2</button>
        <button class="version-btn active" data-version="3">버전 3</button>
      </div>
    </div>

    <label for="cursor-slider">커서 개수: <span id="cursor-count">50</span></label>
    <input type="range" id="cursor-slider" min="0" max="500" value="50" step="1">

    <label for="speed-slider">속도: <span id="speed-value">1.0</span>x</label>
    <input type="range" id="speed-slider" min="0.1" max="5" value="1" step="0.1">
  </div>
`;

const slider = document.getElementById("cursor-slider") as HTMLInputElement;
slider.addEventListener("input", (e) => {
  const count = parseInt((e.target as HTMLInputElement).value);
  setCursorCount(count);
});

const speedSlider = document.getElementById("speed-slider") as HTMLInputElement;
speedSlider.addEventListener("input", (e) => {
  speedMultiplier = parseFloat((e.target as HTMLInputElement).value);
  updateSpeedDisplay();
  updateCursorSpeeds();
});

const versionButtons = document.querySelectorAll(".version-btn");
versionButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const version = parseInt((e.target as HTMLButtonElement).dataset.version!);

    versionButtons.forEach((b) => b.classList.remove("active"));
    (e.target as HTMLButtonElement).classList.add("active");

    switchVersion(version);
  });
});

// 초기 커서 생성
setCursorCount(100);
switchVersion(3); // 버전 3으로 시작
