(function () {
    // --- 카테고리 필터 + active 효과 통합 ---
    const tabs = document.querySelectorAll('.badge-btnBox .badge-btn');
    let selectedCategory = "전체";

    tabs.forEach(tab => {
        tab.onclick = function () {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            selectedCategory = this.textContent.trim();
            //renderLists(); ->일단 얘를 뱃지 리스트로 해야됨
        };
    });
})();
