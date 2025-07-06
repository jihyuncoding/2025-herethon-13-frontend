// SPA: 페이지 이름-경로 매핑
const PAGE_CONFIG = {
    home: { html: "home.html", js: "" },
    myChallenge: { html: "my-challenge/myChallenge.html", js: "my-challenge/myChallenge.js" },
    challengeAdd: { html: "my-challenge/challengeAdd.html", js: "my-challenge/challengeAdd.js" },
    community: { html: "community.html", js: "" },
    badge: { html: "badge.html", js: "" }
};

// SPA 메인 로더
async function loadPage(pageName) {
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

    // 기존 스크립트 제거
    const prev = document.getElementById("dynamic-page-script");
    if (prev) prev.remove();

    // JS 동적 로드
    if (jsPath) {
        const script = document.createElement("script");
        script.src = jsPath;
        script.id = "dynamic-page-script";
        document.body.appendChild(script);
    }

    // 기록 추가 버튼 이벤트 예시
    const addBtn = document.getElementById("addChallengeBtn");
    if (addBtn) {
        addBtn.addEventListener("click", function () {
            loadPage("challengeAdd");
        });
    }
}

// 사이드바 버튼 이벤트
document.querySelectorAll(".sideBar_Box").forEach((btn) => {
    btn.addEventListener("click", function () {
        document.querySelectorAll(".sideBar_Box").forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        loadPage(this.dataset.page);
    });
});

// 초기 로딩
loadPage("home");
