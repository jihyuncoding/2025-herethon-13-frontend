//홈화면으로 이동
function goHome() {
    location.href = "../home/home.html";
}

//나의 도전으로 이동
function goChallenge() {
    location.href = "../my-challenge/myChallenge.html";
}

//커뮤니티로 이동
function goCommunity() {
    location.href = "../community/community.html";
}

//뱃지로 이동
function goBadge() {
    location.href = "../badge/badge.html";
}

//로그인으로 이동(로그아웃 예 버튼 누를 시)
function goLogin() {
    location.href = "../auth/login.html";
}

const modal = document.getElementById("modal")
const logOutBtn = document.getElementById("logout");
const noBtn = document.getElementById("no");

//모달 열기(로그아웃확인창)
logOutBtn.addEventListener("click", () => {
    modal.style.display = "block";
});

//모달 닫기
noBtn.addEventListener("click", () => {
    modal.style.display = "none"
});