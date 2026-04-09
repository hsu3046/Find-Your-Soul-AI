# AI Love Pick — 프로젝트 메모리

> **Version:** 1.2.0 | **Updated:** 2026-04-09

---

## 🔴 중요 결정 (Important Decisions)

### 프레임워크 미사용
- Vanilla TypeScript + Vite 조합
- DOM 직접 조작 (`innerHTML` + `requestAnimationFrame` 패턴)
- 상태 관리는 클로저(closure)와 `Map` 객체로 처리

### 스코어링 체계
- **4축 좌표계** (speed_depth, real_creative, logic_visual, plan_flow)
- **범위:** -1 ~ +1 (clamp 적용)
- **유형 매칭:** 유클리드 거리 최소화 (8개 유형의 이상 좌표와 비교)

---

## 🟡 반복 패턴 (Recurring Patterns)

### `toPascalCase` + `injectIcon` 공통 모듈
- ~~`quiz.ts`와 `result.ts`에서 동일한 함수가 각각 정의됨~~ → ✅ `src/utils/icons.ts`로 추출 완료
- 양쪽 화면에서 `import { injectIcon } from '../utils/icons'`로 사용

### DOM 렌더링 패턴
```
1. createElement('div') → className 설정
2. innerHTML로 HTML 문자열 삽입
3. requestAnimationFrame에서:
   - injectIcon으로 SVG 아이콘 삽입
   - 이벤트 리스너 바인딩
4. return HTMLElement
```

### 화면 전환 패턴
```
1. 현재 화면 .exiting (300ms 페이드 아웃)
2. setTimeout → DOM 교체
3. 새 화면 .active (400ms 페이드 인)
```

---

## ✅ 해결된 이슈 (Resolved Issues)

### 6. [2026-03-15] [High] q7_answer Supabase NULL 버그 → 해결 (이후 Supabase 전체 제거로 N/A)
- **당시 문제:** 7번 질문(multi-select)의 답변이 Supabase에 항상 NULL로 저장됨
- **당시 원인:** 7번은 `type: 'multi'`라 `answers` Map이 아닌 `multiAnswers` Map에 저장됨
- ⚠️ 2026-04-09: Supabase 전체 제거 → 이 이슈는 더 이상 해당 없음

### 5. ~~`intro.ts` 질문 수 하드코딩~~ → 해결
- "8개 질문 · 약 2분 소요" → "12개 질문 · 약 3분 소요"로 수정

### 4. ~~`_needKey` 미사용 매개변수~~ → 해결
### 3. ~~`_llmTier` 미사용 매개변수~~ → 해결
### 2. ~~`freeLLM` 변수 하드코딩~~ → 해결
### 1. ~~`QuestionOption` 인터페이스 중복 정의~~ → 해결

## 🟠 남은 이슈 (Remaining Issues)

### Vite dev 서버 모바일 접속 불가
- **현상:** `--host`로 실행해도 같은 Wi-Fi의 iPhone에서 배경만 표시, JS 콘텐츠 로딩 안 됨
- **시도:** `vite.config.ts` 생성 + `server.host: true`, 프로덕션 빌드 `serve` — 모두 실패
- **추정 원인:** Mac 방화벽 또는 공유기 AP 격리 설정
- **현재 대안:** 모바일 테스트는 Vercel 배포 후 확인

### `icons` 전체 import로 번들 사이즈 증가
- **위치:** 모든 screen 파일 + `utils/icons.ts`에서 `import { createElement, icons } from 'lucide'`
- **영향:** 사용하지 않는 아이콘도 모두 번들에 포함
- **해결:** 필요한 아이콘만 개별 import하거나 Vite tree-shaking 최적화

---

## 🟢 향후 개선 가능 (Future Improvements)

- [ ] `toPascalCase`, `injectIcon` 유틸 함수 공통화 (`src/utils/` 추출)
- [ ] `QuestionOption` 타입 통합 (`quiz.ts`에서 `questions.ts` import)
- [ ] 일러스트 이미지 추가 (현재 placeholder 표시 중)
- [ ] 결과 공유 시 OG 이미지 생성 (SNS 미리보기용)
- [ ] 국제화(i18n) 지원 (현재 한국어 하드코딩)
- [ ] Lucide 아이콘 개별 import로 번들 사이즈 최적화
- [ ] 접근성(a11y) 개선 (ARIA labels, keyboard navigation)
- [ ] 오프라인 지원 (Service Worker + 폰트 로컬 번들링)

---

## 🔵 변경 이력 (Recent Changes)

### [2026-04-09] Supabase 완전 제거
- **배경:** 로그/기록용 Supabase 로직 전체 삭제 요청
- **삭제 파일:** `src/lib/supabase.ts`, `src/lib/analytics.ts`
- **수정 파일:** `main.ts`(3곳 호출 제거), `result.ts`(2곳 호출 제거), `vite-env.d.ts`(타입 제거)
- **패키지 제거:** `@supabase/supabase-js` (12개 관련 패키지 포함)
- **결과:** 완전 클라이언트 전용 앱 — 외부 연결 0건

### [2026-03-15] Supabase 테이블 이름 변경 (역사 기록 — 현재 N/A)
- `soulai_quiz_submissions` → `ailovepick_quiz_submissions`
- `soulai_events` → `ailovepick_events`

### [2026-03-15] 공유 텍스트 수정
- 제목: `나에게 딱 맞는 AI는? <AI종류>`
- 본문: `나의 AI 취향은 "<유형명>"` + URL (`https://pick.knowai.app`)

### [2026-03-15] vite.config.ts 추가
- `server.host: true` 설정 (모바일 접속용, 실제로는 네트워크 문제로 미작동)

---

## 📊 프로젝트 통계

| 항목 | 값 |
|------|-----|
| **소스 파일 수** | 10개 (.ts + .css) |
| **외부 연결** | 없음 (완전 클라이언트 전용) |
| **질문 수** | 12개 (Phase 1: 6, Phase 2: 6) |
| **AI 서비스 수** | 20개 |
| **유형 수** | 8개 |
| **사이트 URL** | `pick.knowai.app` |
| **런타임 의존성** | lucide, html2canvas |
| **빌드 의존성** | typescript, vite |
