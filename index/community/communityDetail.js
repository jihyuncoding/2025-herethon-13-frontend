window.renderCommunityDetail = function(postId) {
  const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
  const post = posts.find(p => String(p.id) === String(postId));

  let container = document.querySelector('.community-detail-layout');
  if (!post || !container) {
    // 없으면 새로 만들어서 main-content에 붙이기
    container = document.createElement('div');
    container.className = 'community-detail-layout';
    const main = document.querySelector('.main-content');
    if (!main) return;
    main.innerHTML = '';
    main.appendChild(container);
  }

  container.innerHTML = `
  <div class="detail-main">
    <div class="detail-thumbnail" style="${post.imgDataUrl ? `background:url('${post.imgDataUrl}') center/cover no-repeat;background-size:cover;` : `background:#ddd;`}"></div>
    <div class="detail-info-block">
      <div class="detail-like-fixed">
        <div class="like like-button">
          <img class="like-icon" src="/assets/heart.svg" alt="좋아요" style="width: 20px; height: 20px; margin-right: 6px;" />
          <span class="like-count">${post.like ?? 0}</span>
        </div>
        <div class="detail-meta-date">${post.date || ''}</div>
      </div>
      <div class="detail-row">
        <div class="profile-image"></div>
        <span class="writer">${post.writer || '익명'}</span>
        <div class="category-challenge-block">
          <span class="category">${post.category || ''}</span>
          <span class="challenge-title">${post.challengeTitle || ''}</span>
        </div>
        <span class="badge">${post.badge || ''}</span>
      </div>
      <div class="detail-title">${post.title || ''}</div>
      <div class="detail-content">${post.content || ''}</div>
    </div>
  </div>
  <aside class="detail-comments">
    <button class="detail-close-btn" title="닫기">×</button>
    <div class="comment-list"></div>
    <div class="comment-input-row">
      <input type="text" class="comment-input" placeholder="댓글을 입력하세요" />
      <button class="comment-send-btn">⤴</button>
    </div>
  </aside>
`;

  const closeBtn = container.querySelector('.detail-close-btn');
  if (closeBtn) {
    closeBtn.onclick = function () {
      window.loadPage('community');
    };
  }

  const likeEl = container.querySelector('.like-button');
if (likeEl) {
  likeEl.addEventListener('click', () => {
    const icon = likeEl.querySelector('.like-icon');
    const count = likeEl.querySelector('.like-count');
    const isLiked = likeEl.classList.toggle('liked');

    icon.src = isLiked
      ? '/assets/heartfull.svg'
      : '/assets/heart.svg';

    const current = parseInt(count.textContent, 10);
    count.textContent = isLiked ? current + 1 : current - 1;
  });
}

  

};
