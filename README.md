# 복지물품 대여 서비스 - 빌릴게

## 📚 프로젝트 소개
###  프로젝트 내용

국민대학교 소프트웨어 융합대학 학생회에서 진행하는 사업인 복지물품 대여 사업 시스템화 프로젝트

### 프로젝트 개발 배경

학생회에서 근무하던 당시, 복지물품 대여 업무를 진행하던 경험이 있다.
당시의 경험을 바탕으로 생각되었던 여러가지 개선하면 좋을 점들을 기존 시스템에 적용하여 만들어보고자 하는 마음에 프로젝트를 시작하게 되었다.

### 프로젝트 목적

 기존 시스템에서 부족하다고 생각되는 점들을 개선하여 미반납, 분실 등의 사고를 방지하고, 나아가 위의 사고들로 인한 불필요한 운영비 지출을 줄이고자 한다.

⏯ 실행
-------------------------------

1. 첨부된 코드 파일을 다운로드 받거나, 본 프로젝트를 clone
2. 첨부된 .env 파일을 프로젝트의 루트 경로에 추가
3. 터미널) yarn install 명령어를 입력하여여 프로젝트 종속성 및 라이브러리 설치
4. 터미널) npm run start 명령어를 입력하여 프로젝트 실행 

⚙️ 개발 환경
-------------------------------
+ Framework : React.js, Express.js
+ Database : MongoDB
+ Hosting : Vercel, MongoDB Atlas

📌 구현 내용
---------------------------------


### TopBar

+ 로그인 및 회원가입 페이지 이동
+ 로그아웃 기능
+ 관리자 페이지 이동

### 메인페이지 - 일반 사용자

+ 물품 대여 신청
+ 대여 신청 취소
+ 대여 내역 확인(본인)
  + 대여 일시
  + 승인 일시
  + 대여 품목
  + 승인 관리자

### 메인페이지 - 관리자
+ 물품 대여 신청 처리
+ 물품 반납 신청 처리
+ 복지 물품 추가
+ 복지 물품 수정
+ 대여 내역 확인(전체)
  + 대여 일시
  + 승인 일시
  + 대여 품목
  + 대여 신청자
  + 승인 관리자

### 로그인 및 회원가입
+ 이메일 중복검사, 유효성 검사 - kookmin.ac.kr
+ 이메일 인증 번호 발송 및 확인
+ 비밀번호 2차 확인
+ 유저 확인

🎨 디자인 고려 사항
---------------------------------

### SPA 방식을 활용한 사용자 경험 향상
### 학생회 메인 색상을 활용하여 통일성 증가
