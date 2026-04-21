# mathpop — 산수 워크시트 프로젝트 플랜

## 개요

자녀(8-9세)를 위한 사칙연산 연습용 프린트 가능한 워크시트 웹앱.  
React + Vite로 개발 후 GitHub Pages에 배포.  
URL: `https://{username}.github.io/mathpop/`

---

## 기술 스택

- **React + Vite**
- **Tailwind CSS** (선택 — 스타일링 편의)
- 배포: **GitHub Pages**
- 빌드/배포 자동화: **GitHub Actions**

---

## 기능 요구사항

### 필수 기능
- [ ] 연산 종류 선택: 덧셈 / 뺄셈 / 곱셈 / 나눗셈 (복수 선택)
- [ ] 난이도 설정: 숫자 범위 조절 (예: 1~20, 1~100)
- [ ] 문제 수 설정 (예: 20문제 / 30문제)
- [ ] 문제 랜덤 생성
- [ ] 프린트 버튼 → `window.print()` 로 인쇄/PDF 저장

### 선택 기능 (나중에 추가 고려)
- [ ] 정답 포함/미포함 선택 (채점용 정답지 별도 인쇄)
- [ ] 이름/날짜 입력란
- [ ] 시간 제한 타이머 (온라인 풀기 모드)

---

## 화면 구성

```
[설정 패널]
- 연산 선택 (체크박스)
- 숫자 범위 (슬라이더 or 입력)
- 문제 수 선택

[미리보기 영역]
- A4 비율로 문제 렌더링
- 1번 ~ N번 문제 나열

[버튼]
- 새로 생성 / 인쇄
```

---

## 프린트 고려사항

- `@media print` CSS로 설정 패널 숨김
- A4 기준 레이아웃 (`width: 210mm`)
- 문제 폰트 크기 충분히 크게 (14~16pt 이상)
- 답 쓰는 빈칸 `______` 스타일 확보

---

## 디렉토리 구조 (React + Vite 기준)

```
mathpop/
├── public/
├── src/
│   ├── components/
│   │   ├── SettingsPanel.jsx
│   │   ├── Worksheet.jsx
│   │   └── Problem.jsx
│   ├── utils/
│   │   └── generateProblems.js
│   ├── App.jsx
│   └── main.jsx
├── .github/
│   └── workflows/
│       └── deploy.yml
├── index.html
├── vite.config.js
└── README.md
```

---

## 배포 계획

- 레포명: `mathpop` (public)
- 배포 URL: `https://{username}.github.io/mathpop/`
- 소스 브랜치: `main`
- 배포 브랜치: `gh-pages` (GitHub Actions가 자동 생성)

### GitHub Pages 설정

1. GitHub 퍼블릭 레포 `mathpop` 생성
2. Settings → Pages → Source: **GitHub Actions** 선택
3. 이후 `main` 푸시 시 자동 배포

### GitHub Actions 워크플로우 (`deploy.yml`)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - uses: actions/deploy-pages@v4
        id: deployment
```

### vite.config.js — base 경로 설정 필수

```js
export default {
  base: '/mathpop/',
}
```

---

## 개발 순서

1. `npm create vite@latest mathpop -- --template react` 로 프로젝트 생성
2. `vite.config.js` 에 `base: '/mathpop/'` 설정
3. 문제 생성 유틸 작성 (`generateProblems.js`)
4. 컴포넌트 개발 (`SettingsPanel`, `Worksheet`, `Problem`)
5. 프린트 스타일 (`@media print`)
6. `.github/workflows/deploy.yml` 작성
7. GitHub 레포 생성 후 푸시 → 자동 빌드/배포 확인
