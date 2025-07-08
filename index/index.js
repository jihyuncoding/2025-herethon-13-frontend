// ====== index.js (SPA 메인 엔트리, 전체) ======

// --- SPA: 페이지 이름-경로 매핑 ---
const PAGE_CONFIG = {
  home:            { html: "home.html", js: "" },
  mypage:          { html: "mypage/mypage.html", js: "mypage/mypage.js" },
  myChallenge:     { html: "my-challenge/myChallenge.html", js: "my-challenge/myChallenge.js" },
  challengeAdd:    { html: "my-challenge/challengeAdd.html", js: "my-challenge/challengeAdd.js" },
  challengeDetail: { html: "my-challenge/challengeDetail.html", js: "my-challenge/challengeDetail.js" },
  certAdd:         { html: "my-challenge/certAdd.html", js: "my-challenge/certAdd.js" },
  certDetail:      { html: "my-challenge/certDetail.html", js: "my-challenge/certDetail.js" },
  community:       { html: "community/community.html", js: "community/community.js" },
  communityDetail: { html: "community/communityDetail.html", js: "community/communityDetail.js" },
  badge:           { html: "badge.html", js: "" },
  postAdd:         { html: "community/postAdd.html", js: "community/postAdd.js" }
};

// --- 상세/수정/등록 전역 저장용 ---
let currentDetailTitle = null;
let currentCertId = null;
let currentChallengeAddId = null;
let currentCertAddId = null;

// --- SPA 메인 로더 함수 ---
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

  // --- detailKey 등 상태 저장 ---
  currentDetailTitle = pageName === "challengeDetail" && detailKey ? detailKey : null;
  currentCertId       = pageName === "certDetail"      && detailKey ? detailKey : null;
  currentChallengeAddId = pageName === "challengeAdd"  && detailKey ? detailKey : null;
  currentCertAddId    = pageName === "certAdd"        && detailKey ? detailKey : null;

  // --- 이전 동적 JS 제거 ---
  const prevScript = document.getElementById("dynamic-page-script");
  if (prevScript) prevScript.remove();

  // --- JS 파일 동적 로드 & 콜백 ---
  if (jsPath) {
    const script = document.createElement("script");
    script.src = jsPath;
    script.id = "dynamic-page-script";
    script.onload = () => {
      // 공통 리스트 렌더 (myChallenge, community 둘 다 renderLists로 구현하였다면)
      if (typeof window.renderLists === "function") {
        window.renderLists();
      }
      // community 상세 페이지
      if (pageName === "communityDetail" && typeof window.renderCommunityDetail === "function") {
        window.renderCommunityDetail(detailKey);
      }
      // 댓글 작성 페이지
      if (pageName === "postAdd" && typeof window.renderPostAdd === "function") {
        window.renderPostAdd();
      }
      // mypage
      if (pageName === "mypage" && typeof window.renderMyPage === "function") {
        window.renderMyPage();
      }
      // 도전 추가
      if (pageName === "challengeAdd" && typeof window.renderChallengeAdd === "function") {
        window.renderChallengeAdd(currentChallengeAddId);
      }
      // 도전 상세
      if (pageName === "challengeDetail" && typeof window.renderChallengeDetail === "function") {
        window.renderChallengeDetail(currentDetailTitle);
      }
      // 인증 추가
      if (pageName === "certAdd" && typeof window.renderCertAdd === "function") {
        window.renderCertAdd(currentCertAddId);
      }
      // 인증 상세
      if (pageName === "certDetail" && typeof window.renderCertDetail === "function") {
        window.renderCertDetail(currentCertId);
      }
    };
    document.body.appendChild(script);
  }
}

// --- 전역 getter 등록 ---
window.currentDetailTitle     = () => currentDetailTitle;
window.currentCertId          = () => currentCertId;
window.currentChallengeAddId = () => currentChallengeAddId;
window.currentCertAddId      = () => currentCertAddId;

// --- 사이드바 버튼 이벤트 등록 ---
document.querySelectorAll(".sideBar_Box").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".sideBar_Box").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    loadPage(btn.dataset.page);
  });
});

// --- SPA 페이지 이동 함수 글로벌 등록 ---
window.loadPage = loadPage;

// --- 최초 진입시 home 페이지 로드 ---
window.addEventListener("DOMContentLoaded", () => {
  loadPage("home");
});
