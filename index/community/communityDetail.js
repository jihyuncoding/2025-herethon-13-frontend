// ====== communityDetail.js ======
console.log("communityDetail.js loaded!");

// SPA 환경에서 커뮤니티 상세 페이지 렌더링
window.renderCommunityDetail = function(postId) {
  // 1) 로컬스토리지에서 포스트 불러오기
  const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
  const post = posts.find(p => String(p.id) === String(postId));
  if (!post) return;

  // 2) 상세 컨테이너 찾기 또는 생성
  let container = document.querySelector('.community-detail-content-layout');
  if (!container) {
    const main = document.getElementById('mainArea') || document.querySelector('.main-content');
    if (!main) return;
    main.innerHTML = '';
    container = document.createElement('div');
    container.className = 'community-detail-content-layout';
    main.appendChild(container);
  }

  // 3) 초기 좋아요/상태 값 세팅
  post.like  = typeof post.like  === 'number'  ? post.like  : 0;
  post.liked = typeof post.liked === 'boolean' ? post.liked : false;

  // 4) 세부 목표 우선 표시
  const goalText = post.detailGoal || '';

  // 5) 마크업 설정
  container.innerHTML = `
    <div class="detail-main">
      <div class="detail-thumbnail" style="${
        post.imgDataUrl ? `background:url('${post.imgDataUrl}') center/cover no-repeat; background-size:cover;` : ''
      }"></div>
      <div class="detail-info-block">
        <div class="detail-like-fixed">
          <div class="like like-button${post.liked ? ' liked' : ''}">
            <img class="like-icon" src="${post.liked ? '/assets/heartfull.svg' : '/assets/heart.svg'}" alt="좋아요" />
            <span class="like-count">${post.like}</span>
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
          ${goalText ? `<span class="badge">${goalText}</span>` : ''}
        </div>
        <div class="detail-title">${post.title || ''}</div>
        <div class="detail-content">${post.content || ''}</div>
      </div>
    </div>
    <aside class="detail-comments">
      <button class="detail-close-btn" aria-label="닫기">×</button>
      <div class="comment-list">
        ${(post.comments || []).map(c => `
          <div class="comment-item">
            <div class="comment-profile"></div>
            <div class="comment-right">
              <div class="comment-header">
                <span class="comment-writer">${c.writer}</span>
                <span class="comment-date">${c.date}</span>
              </div>
              <div class="comment-content">${c.text}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="comment-input-row">
        <input class="comment-input" type="text" placeholder="댓글을 입력하세요" />
        <button class="comment-send-btn" aria-label="댓글 전송">⤴</button>
      </div>
    </aside>
  `;

  // 6) 닫기 이벤트
  container.querySelector('.detail-close-btn').onclick = () => window.loadPage('community');

  // 7) 좋아요 이벤트
  const likeBtn = container.querySelector('.like-button');
  const icon    = likeBtn.querySelector('.like-icon');
  const countEl = container.querySelector('.like-count');
  likeBtn.onclick = () => {
    // 7.1) 상태 토글
    const isNowLiked = !post.liked;
    post.liked = isNowLiked;
    // 7.2) 좋아요 수 증감
    post.like = isNowLiked ? post.like + 1 : post.like - 1;
    // 7.3) UI 업데이트
    likeBtn.classList.toggle('liked', isNowLiked);
    icon.src = isNowLiked ? '/assets/heartfull.svg' : '/assets/heart.svg';
    countEl.textContent = post.like;
    // 7.4) 로컬스토리지 동기화
    localStorage.setItem('communityPosts', JSON.stringify(posts));
  };

  // 8) 댓글 등록 이벤트
  const sendBtn = container.querySelector('.comment-send-btn');
  const inputEl = container.querySelector('.comment-input');
  sendBtn.onclick = () => {
    const text = inputEl.value.trim();
    if (!text) return;
    const now = new Date();
    const comment = {
      writer: '익명',
      date: now.toLocaleString('ko-KR', { hour12: false, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' }).replace(/\s|,/g, '.'),
      text
    };
    post.comments = post.comments || [];
    post.comments.push(comment);
    localStorage.setItem('communityPosts', JSON.stringify(posts));
    container.querySelector('.comment-list').insertAdjacentHTML('beforeend', `
      <div class="comment-item">
        <div class="comment-profile"></div>
        <div class="comment-right">
          <div class="comment-header">
            <span class="comment-writer">${comment.writer}</span>
            <span class="comment-date">${comment.date}</span>
          </div>
          <div class="comment-content">${comment.text}</div>
        </div>
      </div>
    `);
    inputEl.value = '';
  };
};
