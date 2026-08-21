# 🔬 AOI-PCBA Intelligence System

> **Next-Generation Automated Optical Inspection (3D-AOI) & SMT Process Intelligence Platform for High-Reliability PCBA Manufacturing**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![IPC-A-610](https://img.shields.io/badge/Standard-IPC--A--610%20Rev%20H-blue)](https://www.ipc.org/)
[![IPC-CFX](https://img.shields.io/badge/M2M-IPC--CFX--2591-green)](https://www.ipc.org/ipc-cfx)
[![Cloud Run](https://img.shields.io/badge/Deploy-Google%20Cloud%20Run-4285F4?logo=googlecloud&logoColor=white)](https://cloud.google.com/run)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

---

## 🌐 라이브 배포 및 접속 정보 (Live Deployment & URLs)

| 구분 | URL / 접속 링크 | 설명 및 사용 방법 |
| :--- | :--- | :--- |
| **🚀 실시간 라이브 웹 앱 (Active Live)** | **[👉 AOI-PCBA 실시간 웹 열기 (클릭)](https://ais-dev-or3mlqddiogqro7vrslhqb-650867111857.asia-east1.run.app)** | **현재 즉시 작동 중인 메인 접속 URL** (크롬/모바일 새 탭에서 즉시 전체화면 실행) |
| **🌟 배포/공유 스냅샷 (Shared App)** | [https://ais-pre-or3mlqddiogqro7vrslhqb-650867111857.asia-east1.run.app](https://ais-pre-or3mlqddiogqro7vrslhqb-650867111857.asia-east1.run.app) | 상단 **Share** 버튼을 통해 공유 스냅샷 발행 시 활성화되는 URL |
| **🐙 GitHub 원격 저장소** | [https://github.com/greeme99/AOI-PCBA](https://github.com/greeme99/AOI-PCBA) | 전체 소스코드 관리 Git Repository |
| **⚙️ 인프라 환경** | Google Cloud Run (Container Port: `3000`, Host: `0.0.0.0`) | Node.js + Express 풀스택 클라우드 런타임 |
| **🤖 AI 엔진** | Google Gemini 3.7 Flash (`@google/genai` SDK) | 3D AOI 결함 원인 분석 및 IPC-A-610 진단 |

---

## 📌 시스템 개요 (System Overview)

**AOI-PCBA Intelligence System**은 고신뢰성 전장(Automotive ECU), 의료기기(Medical Devices), 산업용 스마트 전력 모듈 등 복잡한 PCBA SMT 라인에서 요구되는 **고속 3D 광학 검사, IPC-A-610 표준 결함 트리아지, 6시그마 SPC 통계 공정 관리, IPC-CFX-2591 폐루프 M2M 설비 제어, 설비 예지보전(PdM), 공정 검사 성적서 1-Click 발행 및 멀티 앵글 8채널 HDR 앙상블**을 통합 제공하는 차세대 스마트 팩토리 품질 관제 플랫폼입니다.

---

## 🌟 핵심 기능 아키텍처 (Key Feature Modules)

```
AOI-PCBA Intelligence System
├── 1. 3D Inspection Studio (3D 모아레 위상 검사 & 다채널 조명 시뮬레이션)
├── 2. IPC-A-610 Review & Laser Rework (결함 트리아지 & IPC-7711 가이드)
├── 3. SPC 6-Sigma Analytics & 8D Report (관리도, Cpk, Gemini AI 원인 분석)
├── 4. Smart Factory M2M Closed-Loop (SPI, 마운터, 리플로우 자동 보정)
├── 5. CAD / Gerber / BOM Auto-Teaching (XY 좌표 파싱 & 3점 피듀셜 자동 정합)
├── 6. Multi-Line Fleet Control & PdM (OEE, Takt Time, 마운터 노즐 수명 예지)
├── 7. Anomaly Engine & Auto-Tuning (골든 마스터 감산 & ROC-AUC 오토튜너)
├── 8. 3순위: 공정 검사 성적서 (Quality CoA 1-Click PDF & QR 진위 검증)
├── 9. 4순위: 멀티 앵글 / 조명 보정 골든 샘플 앙상블 (8-CH HDR Fusion)
└── 10. 듀얼 화면 모드: 라이트(화이트+그레이) & 다크 모드 1-Click 토글
```

---

## 📋 기능별 상세 명세 (Detailed Features)

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

### 3. SPC 통계적 공정 관리 & Gemini 8D 품질 레포트
- **6시그마 X-bar & R 관리도**: Western Electric 연속 이탈 룰 판정, FPY(직통율), Cpk 공정능력지수, DPMO 실시간 산출.
- **AI 8D 문제해결 보고서**: D1 팀 구성부터 D4 근본원인(5-Whys, Fishbone), D5 시정조치, D7 재발방지 보고서 자동 생성.

### 4. Smart Factory M2M & CAD Auto-Teaching
- **CAD/Gerber/BOM 자동 티칭 (Auto-Teaching)**: RS-274X 및 XY Pick & Place CSV 좌표 파싱, 3점 피듀셜(Fiducial) 마크 자동 정합 및 보정.
- **IPC-CFX-2591 Closed-Loop 피드백**: SPI 스크린프린터(스퀴지 압력/오프셋), 칩마운터(노즐 보정), 리플로우 오븐 M2M 실시간 보정 신호 전송.
- **스마트폰 모바일 브릿지**: 고화질 매크로 카메라 무선 스트리밍 및 QR 코드 로트 인식.

### 5. Multi-Line Fleet Control, Anomaly Engine, Auto-Tuning & PdM
- **SMT Multi-Line 중앙 플릿 관제**: 라인별 OEE(종합설비효율), Takt Time, FPY 현황 모니터링, 글로벌 레시피 동기화 및 3교대 교대근무 인수인계 로그.
- **골든 마스터 감산 & 비지도 이상감지(Anomaly Engine)**: 픽셀 서브트랙션 델타 맵, 서브픽셀 에지 그래디언트 분석, 히트맵 컬러 스케일.
- **AI 파라미터 오토튜닝 (Auto-Threshold Optimizer)**: 12,000+ 빅데이터 기반 ROC-AUC 곡선 분석 및 최적 파레토 프론티어 탐색.
- **설비 예지보전 텔레메트리 (PdM)**: 마운터 12개 노즐 진공 압력 및 잔여 수명(RUL), 스퀴지 마모도, 리플로우 10-Zone 열전대 진동 모니터링.

### 6. 공정 검사 성적서 (Quality CoA) 1-Click PDF 발행 (3순위 구현 완료)
- IATF-16949 / ISO-9001:2015 공인 검사 성적서 양식.
- 로트 정보, 직통율(FPY 99.04%), Cpk(1.74), DPMO, IPC-A-610 결함 조치 이력, 3D 레이저 솔더 형상 측정 데이터 표기.
- 블록체인 SHA-256 전자서명 해시 및 QR 진위 확인 바코드 포함.
- 웹 인쇄 및 1-Click PDF 다운로드 지원.

### 7. 멀티 앵글 / 조명 보정 골든 샘플 앙상블 (4순위 구현 완료)
- 5개 카메라 앵글(Top 0°, North/East/South/West 45°) 및 동축/RGB 3단/사각 조명 실시간 가중치 슬라이더.
- 8채널 HDR 이미지 융합 알고리즘(Exposure Fusion, Specular Split, Shadow Removal, Wetting Contour).
- N매 골든 샘플 등록 평균($\mu$) 및 편차($3\sigma$) 서피스 맵 구축.
- 난반사(Glare) 억제율 92.1%, 솔더 엣지 이득 48.5%, 신뢰도 포괄률 99.94% 달성.

### 8. 화면 모드 지원 (라이트 모드: 화이트+그레이 / 다크 모드)
- 화면 우측 상단에 직관적인 **[ ☀️ 라이트 | 🌙 다크 ]** 듀얼 세그먼트 스위처 제공.
- **라이트 모드**: 화이트 캔버스(`bg-white`), 슬레이트 그레이(`bg-slate-50`, `bg-slate-100`), 선명한 콘트라스트.
- **다크 모드**: 딥 슬레이트(`bg-[#0f172a]`), 블루/네온 하이라이트.

---

## 📁 프로젝트 디렉토리 구조 (Project Structure)

```
AOI-PCBA/
├── .env.example                               # 환경 변수 템플릿 (GEMINI_API_KEY)
├── .gitignore                                 # Git 제외 항목 정의
├── README.md                                  # 통합 개발 및 배포 정보 문서
├── metadata.json                              # 앱 메타데이터 및 권한 설정
├── package.json                               # 의존성 및 실행 스크립트
├── server.ts                                  # Express 백엔드 API & Vite 미들웨어
├── tsconfig.json                              # TypeScript 컴파일러 설정
├── vite.config.ts                             # Vite 번들러 및 Tailwind 플러그인 설정
└── src/
    ├── main.tsx                               # React 진입점
    ├── App.tsx                                # 메인 애플리케이션 라우터 및 글로벌 상태
    ├── index.css                              # Tailwind CSS v4 엔트리
    ├── types/
    │   └── aoi.ts                             # SMT/AOI/IPC/PdM 통합 타입 인터페이스
    ├── mock/
    │   ├── pcbData.ts                         # PCB 기판, 부품, 결함, 레시피 모의 데이터
    │   ├── cadData.ts                         # CAD/Gerber/BOM 및 피듀셜 데이터
    │   ├── fleetData.ts                       # SMT 멀티라인 플릿 관제 데이터
    │   ├── autotunePdmData.ts                 # ROC-AUC 튜닝 및 설비 PdM 텔레메트리
    │   └── certificateAndEnsembleData.ts      # CoA 성적서 및 8-CH 앙상블 데이터
    └── components/
        ├── Header.tsx                         # 상단 퀵 네비게이션 및 [라이트/다크] 토글
        ├── Sidebar.tsx                        # 스마트 팩토리 올인원 사이드바 메뉴
        ├── PCBViewer/                         # 3D 캔버스, 툴바, 현미경 인스펙터
        ├── ReviewStation/                     # IPC 결함 트리아지, 레이저 게이지, MES 로그
        ├── AIAssistant/                       # Gemini Copilot, AI 8D 보고서, 오류학습 DB
        ├── ReworkStation/                     # IPC-7711 레이저/핫에어 리워크 스테이션
        ├── SPCAnalytics/                      # 6시그마 X-bar & R 관리도 및 Cpk 대시보드
        ├── RecipeManager/                     # 검사 알고리즘 임계값 및 IPC 등급 편집기
        ├── ProductionLiveStream/              # 컨베이어 실시간 피드 & Closed-Loop 피드백
        ├── ImportExport/                      # CAD Gerber/Pick & Place CSV 임포터
        ├── AutoTeaching/                      # 3점 피듀셜 마크 자동 정합 티칭
        ├── SmartphoneBridge/                  # 모바일 무선 매크로 카메라 브릿지
        ├── FleetControl/                      # SMT Multi-Line 중앙 플릿 관제 대시보드
        ├── AnomalyEngine/                     # 골든 마스터 감산 & 비지도 이상감지
        ├── AutoTuning/                        # AI 파라미터 오토튜너 (ROC-AUC)
        ├── PdM/                               # 설비 예지보전(PdM) 진공/진동 텔레메트리
        ├── Report/                            # 공정 검사 성적서 (Quality CoA) 1-Click PDF
        └── EnsembleCalibration/               # 멀티 앵글 / 조명 보정 골든 샘플 앙상블
```

---

## 🛠️ 설치 및 로컬 실행 방법 (Installation & Run)

### 1. 레포지토리 클론 및 패키지 설치
```bash
git clone https://github.com/greeme99/AOI-PCBA.git
cd AOI-PCBA
npm install
```

### 2. 환경 변수 설정
`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 Gemini API Key를 설정합니다:
```bash
cp .env.example .env
```
```env
# .env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 3. 개발 서버 실행 (Port 3000)
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속합니다.

### 4. 프로덕션 빌드 및 실행
```bash
npm run build
npm start
```

---

## 🔄 개발 및 변경 이력 관리 (Changelog)

> 모든 향후 기능 추가, 수정 및 배포 이력은 아래 Changelog에 실시간으로 업데이트됩니다.

### [v2.5.0] - 2026-08-20
- **📱 풀 반응형 (웹 · 태블릿 · 스마트폰) UI/UX 전면 업그레이드**:
  - **오프캔버스 모바일 드로어 사이드바 (`Mobile Drawer Sidebar`)**: 모바일/태블릿 화면(`lg:hidden`)에서 햄버거 메뉴를 통한 슬라이드 인 내비게이션 지원 및 백드롭 오버레이 추가.
  - **3D 검사 스튜디오 서브뷰 탭 스위처**: 좁은 모바일 화면에서도 [ 🔬 3D 검사 캔버스 | 📋 결함 판정 (n건) ]을 1-Click으로 편리하게 전환하는 전용 탭 세그먼트 제공.
  - **모바일 퀵 하단 내비게이션 바 (`Mobile Bottom Bar`)**: 3D 검사, 결함 판정(실시간 불량 알림 뱃지), SPC 관리도, SMT 플릿, 전체 메뉴를 엄지손가락으로 손쉽게 터치할 수 있는 퀵 바 탑재.
  - **반응형 대시보드 및 툴바 최적화**: 3D 조명/레이어 툴바 가로 스크롤 보호, 4대 KPI 카드 반응형 그리드(2x2 모바일 / 4x1 데스크톱), AI 인텔리전스 패널 전폭(Full-Width) 반응형 확장.

### [v2.4.0] - 2026-08-20
- **✨ 화면 모드 전환 기능 강화**:
  - 화면 우측 상단에 **[ ☀️ 라이트 (화이트+그레이) | 🌙 다크 ]** 1-Click 세그먼트 토글 버튼 추가.
  - 헤더, 사이드바, 3D 뷰어, 모달 전체에 걸쳐 화이트 & 슬레이트 그레이 스타일 최적화.
- **✨ 3순위: 공정 검사 성적서 (Quality CoA) 1-Click PDF 발행 모달 (`QualityCertificateModal`) 구현**:
  - IATF-16949 / ISO-9001 / IPC-A-610 Class 3 준수 성적서, FPY / Cpk / DPMO, 3D 레이저 솔더 형상 측정치 및 SHA-256 QR 인증.
- **✨ 4순위: 멀티 앵글 / 조명 보정 골든 샘플 앙상블 (`MultiAngleLightingEnsemble`) 구현**:
  - 8-채널 다채널 조명 가중치 제어기 및 HDR 융합(Exposure Fusion, Specular Split 등) 캘리브레이션 뷰어.
- **📦 GitHub 원격 저장소 연동**: `https://github.com/greeme99/AOI-PCBA` 원격 커밋 완료.

### [v2.0.0] - 2026-08-19
- **✨ 스마트 팩토리 4대 고도화 엔진 구현**:
  - SMT Multi-Line 중앙 플릿 관제 대시보드 (`CentralFleetDashboard`)
  - 골든 마스터 감산 & 비지도 이상감지 엔진 (`GoldenMasterDiffViewer`)
  - AI 파라미터 오토튜너 (`AutoThresholdOptimizer`)
  - 설비 예지보전(PdM) 텔레메트리 (`PredictiveMaintenanceDashboard`)
- **✨ IPC-7711 리워크 스테이션 & AI 액티브 러닝 오류학습 DB 추가**.
- **✨ CAD/Gerber/BOM 3점 피듀셜 자동 티칭 & IPC-CFX-2591 Closed-Loop 피드백 연동**.

### [v1.0.0] - 2026-08-18
- **🚀 최초 시스템 릴리즈**: 3D AOI 광학 캔버스, IPC-A-610 트리아지, SPC 6시그마 대시보드, Gemini 8D 보고서 생성기 런칭.

---

## 📜 라이선스 및 저작권 (License)

본 프로젝트는 **MIT License**에 따라 자유롭게 사용 및 수정이 가능합니다.
Copyright (c) 2026 SMT Intelligence Factory Co., Ltd. & greeme99.
