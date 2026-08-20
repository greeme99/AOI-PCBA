# AOI-PCBA Intelligence System

> **Next-Generation Automated Optical Inspection & SMT Process Intelligence Platform for PCBA Manufacturing**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![IPC-A-610](https://img.shields.io/badge/Standard-IPC--A--610%20Rev%20H-blue)](https://www.ipc.org/)
[![IPC-CFX](https://img.shields.io/badge/M2M-IPC--CFX--2591-green)](https://www.ipc.org/ipc-cfx)

---

## 📌 개요 (Overview)

**AOI-PCBA Intelligence System**은 현대 SMT(Surface Mount Technology) 전자 제조 라인에서 고속·고정밀 3D 광학 검사(3D-AOI), 결함 판정 및 트리아지, SPC 6시그마 통계 공정 관리, M2M 스마트 팩토리 폐루프(Closed-Loop) 제어, 설비 예지보전(PdM) 및 Gemini AI 기반 품질 원인 분석을 통합한 올인원 인텔리전스 플랫폼입니다.

---

## 🌟 핵심 기능 (Core Capabilities)

### 1. 3D Inspection Studio & Optical Profilometry
- **3D 솔더 필렛 고저차 맵(Height Map)**: 멀티 주파수 모아레(Moiré) 위상 측정 및 레이저 프로파일로 솔더 젖음각(Wetting Angle)과 볼륨(%) 정밀 측정.
- **다채널 조명 시뮬레이터**:
  - 동축 수직 백색광 (Top Coaxial White)
  - 3단 각도별 RGB 링 조명 (High Red, Mid Green, Low Blue)
  - 4방향 45° 사각 투광 (Oblique Quad Lighting)
- **부품 & 결함 듀얼 인터랙티브 캔버스**: 마이크로스코픽 줌인, 실크스크린/동박/패드/결함 오버레이 토글.

### 2. IPC-A-610 / IPC-7711 결함 트리아지 & 리워크 벤치
- **IPC-A-610 Class 1 / Class 2 / Class 3** 표준 실시간 준수 판정 (솔더 브릿지, 툼스톤/맨하탄, 극성 반대, 리드 들뜸, 보이드, 미세 솔더볼).
- **IPC-7711 / 7721 정밀 솔더링 리워크 스테이션**: 솔더 흡입 위크(Wick), 핫에어 리워크 프로파일, 플럭스 도포 가이드.
- **AI 오류학습 DB (Active Learning)**: 작업자 판정 데이터를 실시간 벡터화하여 가성 불량(False Alarm) 억제 가중치 자동 갱신.

### 3. SPC 통계적 공정 관리 & 8D 품질 레포트
- **6시그마 X-bar & R 관리도**: Western Electric 연속 이탈 룰 판정, FPY(직통율), Cpk 공정능력지수, DPMO 실시간 산출.
- **AI 8D 문제해결 보고서**: D1 팀 구성부터 D4 근본원인(5-Whys, Fishbone), D5 시정조치, D7 재발방지 보고서 자동 생성.

### 4. Smart Factory M2M & CAD Auto-Teaching
- **CAD/Gerber/BOM 자동 티칭 (Auto-Teaching)**: RS-274X 및 XY Pick & Place CSV 좌표 파싱, 3점 피듀셜(Fiducial) 마크 자동 정합 및 보정.
- **IPC-CFX-2591 Closed-Loop 피드백**: SPI 스크린프린터(스퀴지 압력/오프셋), 칩마운터(노즐 보정), 리플로우 오븐 M2M 실시간 보정 신호 전송.
- **스마트폰 모바일 브릿지**: 고화질 매크로 카메라 무선 스트리밍 및 QR 코드 로트 인식.

### 5. Multi-Line Fleet Control & Deep Anomaly Detection
- **SMT Multi-Line 중앙 플릿 관제**: 라인별 OEE(종합설비효율), Takt Time, FPY 현황 모니터링, 글로벌 레시피 동기화 및 3교대 교대근무 인수인계 로그.
- **골든 마스터 감산 & 비지도 이상감지(Anomaly Engine)**: 픽셀 서브트랙션 델타 맵, 서브픽셀 에지 그래디언트 분석, 히트맵 컬러 스케일.
- **AI 파라미터 오토튜닝 (Auto-Threshold Optimizer)**: 12,000+ 빅데이터 기반 ROC-AUC 곡선 분석 및 최적 파레토 프론티어 탐색.
- **설비 예지보전 텔레메트리 (PdM)**: 마운터 12개 노즐 진공 압력 및 잔여 수명(RUL), 스퀴지 마모도, 리플로우 10-Zone 열전대 진동 모니터링.
- **공정 검사 성적서 (Quality CoA) 1-Click PDF 발행**: IATF-16949 / ISO-9001 인증 전자서명 및 QR 검증 성적서 즉시 발행.
- **멀티 앵글 / 조명 앙상블 (Multi-Angle Ensemble)**: 8-채널 HDR 융합으로 난반사(Glare)와 사각지대 그림자 완전 제거.

---

## 🏗️ 기술 스택 (Tech Stack)

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Recharts, Motion
- **Backend / API**: Node.js, Express, Vite Middleware
- **AI / LLM**: Google Gemini 3.7 Flash (`@google/genai` SDK)

---

## 🚀 빠른 시작 (Getting Started)

### 1. 레포지토리 클론 및 의존성 설치
```bash
git clone https://github.com/greeme99/AOI-PCBA.git
cd AOI-PCBA
npm install
```

### 2. 환경 변수 설정
`.env.example` 파일을 복사하여 `.env`를 생성하고 Gemini API 키를 입력합니다:
```bash
cp .env.example .env
```
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속합니다.

### 4. 프로덕션 빌드
```bash
npm run build
npm start
```

---

## 📜 라이선스 (License)

This project is licensed under the MIT License.
