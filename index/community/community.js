// community/community.js

window.renderLists = function() {
  // 1. 데이터 불러오기 (최신순)
  let posts = JSON.parse(localStorage.getItem('communityPosts') || '[]').sort((a, b) => b.id - a.id);

  // 2. 리스트 출력 영역 찾기 (고정 html에서만 존재)
  const postListWrap = document.querySelector('.post-list-wrap');
  if (!postListWrap) return;

  // 3. 리스트 비우고 새로 그림
  postListWrap.innerHTML = '';

  // 4. 글 없으면 안내
  if (posts.length === 0) {
    postListWrap.innerHTML = `
      <div style="color:#aaa;padding:70px 0 0 0;text-align:center;font-size:18px;">
        아직 게시글이 없습니다.<br>첫 인증글을 공유해보세요!
      </div>
    `;
    return;
  }

  // 5. 글 카드 반복 렌더링
  posts.forEach(post => {
    postListWrap.innerHTML += `
      <div class="post-card" data-post-id="${post.id}" style="cursor:pointer;">
        <div class="post-thumb-area">
          <div class="post-thumb" style="${post.imgDataUrl ? `background:url('${post.imgDataUrl}') center/cover no-repeat;` : ``}"></div>
          <div class="post-like-badge">
            ${post.writer || '익명'} | <span class="like-heart">♡</span> ${post.like ?? 0}
          </div>
        </div>
        <div class="post-content-area">
          <div class="challenge-name">${post.challengeTitle || "도전"}</div>
          <div class="post-title">${post.title || ""}</div>
        </div>
      </div>
    `;
  });

  // 6. 카드 클릭 이벤트: SPA 상세 페이지로 이동 (선택사항)
  postListWrap.querySelectorAll('.post-card').forEach(card => {
    card.onclick = function() {
      const postId = this.getAttribute('data-post-id');
      window.loadPage('communityDetail', postId);
    };
  });

  // 7. 게시글 올리기 버튼 이벤트 연결 (SPA 방식)
  const postAddBtn = document.querySelector('.post-add-btn');
  if (postAddBtn) {
    postAddBtn.onclick = function() {
      window.loadPage('postAdd');
    };
  }
};
