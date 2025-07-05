const mailInput = document.querySelector("#mail");
const nameInput = document.querySelector("#name");
const pwInput = document.querySelector("#pw");
const conPwInput = document.querySelector("#conPw");
const message = document.querySelector("#confirm");
const joinBtn = document.querySelector("#joinBtn");

function checkInputs() {
    const pw = pwInput.value.trim();
    const conPw = conPwInput.value.trim();

    message.classList.remove("success", "error");

    if (conPw === pw && pw !== "") {
        message.textContent = "비밀번호가 일치합니다.";
        message.classList.add("success");
    } else {
        message.textContent = "비밀번호가 일치하지 않습니다.";
        message.classList.add("error");
    }
    btnCheck();

}

function btnCheck() {
    const name = nameInput.value.trim();
    const mail = mailInput.value.trim();
    const pw = pwInput.value.trim();
    const conPw = conPwInput.value.trim();

    joinBtn.classList.remove("active", "false");

    if (mail !== "" && name !== "" && pw !== "" && message.classList.contains("success")) {
        joinBtn.classList.add("active");
    } else {
        joinBtn.classList.add("false");
    }
}
// 입력할 때마다 검사되게 = input에 글자 입력하면 checkInput 함수 실행
mailInput.addEventListener("input", btnCheck);
nameInput.addEventListener("input", btnCheck);
pwInput.addEventListener("input", () => {
    btnCheck();
    checkInputs();
});
conPwInput.addEventListener("input", checkInputs);
