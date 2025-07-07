// SPA: 페이지 이름-경로 매핑
const PAGE_CONFIG = {
  home:            { html: "home.html", js: "" },
  myChallenge:     { html: "my-challenge/myChallenge.html", js: "my-challenge/myChallenge.js" },
  challengeAdd:    { html: "my-challenge/challengeAdd.html", js: "my-challenge/challengeAdd.js" },
  challengeDetail: { html: "my-challenge/challengeDetail.html", js: "my-challenge/challengeDetail.js" },
  certAdd:         { html: "my-challenge/certAdd.html", js: "my-challenge/certAdd.js" },
  certDetail:      { html: "my-challenge/certDetail.html", js: "my-challenge/certDetail.js" },
  community:       { html: "community.html", js: "" },
  badge:           { html: "badge.html", js: "" }
};

// --- 상세, 인증상세, 도전수정, 인증수정 전역 저장용 ---
let currentDetailTitle = null;
let currentCertId = null;
let currentChallengeAddId = null;
let currentCertAddId = null;    // ★ 인증글 등록/수정용 id

// SPA 메인 로더 함수
async function loadPage(pageName, detailKey) {
  const { html: htmlPath, js: jsPath } = PAGE_CONFIG[pageName] || PAGE_CONFIG["home"];
  try {
    const res = await fetch(htmlPath);
    if (!res.ok) throw new Error();
    const html = await res.text();
    document.getElementById("mainArea").innerHTML = html;
  } catch (e) {
    document.getElementById("mainArea").innerHTML = "<div style='padding:32px;'>페이지가 없습니다.</div>";
    return;
  }

  // --- 각 페이지별 detailKey 전역 저장 ---
  if (pageName === "challengeDetail" && detailKey) {
    currentDetailTitle = detailKey;
    currentCertId = null;
    currentChallengeAddId = null;
    currentCertAddId = null;
  } else if (pageName === "certDetail" && detailKey) {
    currentCertId = detailKey;
    currentDetailTitle = null;
    currentChallengeAddId = null;
    currentCertAddId = null;
  } else if (pageName === "challengeAdd" && detailKey) {
    currentChallengeAddId = detailKey;
    currentDetailTitle = null;
    currentCertId = null;
    currentCertAddId = null;
  } else if (pageName === "certAdd" && detailKey) {
    currentCertAddId = detailKey;
    currentDetailTitle = null;
    currentCertId = null;
    currentChallengeAddId = null;
  } else {
    // 다른 페이지일 때 모두 초기화
    currentDetailTitle = null;
    currentCertId = null;
    currentChallengeAddId = null;
    currentCertAddId = null;
  }

  // --- 기존 동적 JS 스크립트 제거 ---
  const prev = document.getElementById("dynamic-page-script");
  if (prev) prev.remove();

  // --- JS 동적 로드 및 콜백 ---
  if (jsPath) {
    const script = document.createElement("script");
    script.src = jsPath;
    script.id = "dynamic-page-script";
    script.onload = () => {
      // === 각 페이지별 렌더 함수 실행 ===
      if (window.renderLists) window.renderLists();
      if (window.renderChallengeAdd && pageName === "challengeAdd") {
        window.renderChallengeAdd(currentChallengeAddId);
      }
      if (window.renderChallengeDetail && pageName === "challengeDetail") {
        window.renderChallengeDetail(currentDetailTitle);
      }
      if (window.renderCertAdd && pageName === "certAdd") {
        window.renderCertAdd(currentCertAddId);
      }
      if (window.renderCertDetail && pageName === "certDetail") {
        window.renderCertDetail(currentCertId);
      }
    };
    document.body.appendChild(script);
  }
}

// --- 전역 getter 등록 (다른 JS에서 쓸 수 있게) ---
window.currentDetailTitle = () => currentDetailTitle;
window.currentCertId = () => currentCertId;
window.currentChallengeAddId = () => currentChallengeAddId;
window.currentCertAddId = () => currentCertAddId;

// --- 사이드바 버튼 이벤트 ---
document.querySelectorAll(".sideBar_Box").forEach((btn) => {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".sideBar_Box").forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    loadPage(this.dataset.page);
  });
});

// --- 전역 함수 등록 (SPA 페이지 이동에 사용) ---
window.loadPage = loadPage;

// --- 초기 진입시 home 로드 ---
loadPage("home");
