(function() {
  // ------ 이미지 스타일 함수 ------
  function makeIconStyle(imgDataUrl) {
    return imgDataUrl
      ? `background:url('${imgDataUrl}') center/cover no-repeat;border-radius:8px;width:40px;height:40px;`
      : 'width:40px;height:40px;background:#e9e9e9;border-radius:8px;';
  }
  function makeCertImgStyle(imgDataUrl) {
    return imgDataUrl
      ? `background:url('${imgDataUrl}') center/cover no-repeat;border-radius:12px;`
      : 'background:#d9d9d9;border-radius:12px;';
  }

  // ------ 카테고리 필터 ------
  const tabs = document.querySelectorAll('.challenge-tabs .tab');
  let selectedCategory = "전체";

  tabs.forEach(tab => {
    tab.onclick = function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      selectedCategory = this.textContent.trim();
      renderLists();
    }
  });

  // ------ 데이터 불러오기 ------
  const data = JSON.parse(localStorage.getItem('challenges') || '[]');

  // ------ 리스트/카드 렌더 함수 ------
  function renderLists() {
    // --- 왼쪽 리스트 ---
    const list = document.querySelector('.challenge-list');
    list.innerHTML = '';
    const filtered = selectedCategory === "전체"
      ? data
      : data.filter(ch => ch.category === selectedCategory);

    if (filtered.length === 0) {
      list.innerHTML = "<div style='padding:32px;color:#666;font-family:\"Segoe UI\";font-size:12px;font-weight:600;line-height:15px;'>해당 카테고리의 도전이 없습니다. 새로운 도전을 추가해보세요!</div>";
    }

    filtered.slice().reverse().forEach(ch => {
      let dDayText = '';
      if (ch.startDate) {
        const start = new Date(ch.startDate);
        const now = new Date();
        const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
        dDayText = `D+${diff >= 0 ? diff : 0} ${ch.category}`;
      } else {
        dDayText = ch.category || '';
      }
      const percent = ch.progress || 0;
      const firstGoal = (ch.goals && ch.goals.length > 0) ? ch.goals[0] : '';
      const iconStyle = makeIconStyle(ch.imgDataUrl);

      const row = document.createElement('div');
      row.className = 'challenge-row';
      row.innerHTML = `
        <div class="challenge-info">
          <div class="challenge-icon" style="${iconStyle}"></div>
          <div class="challenge-info-texts">
            <div class="challenge-date">${dDayText}</div>
            <div class="challenge-title">${ch.title}</div>
          </div>
        </div>
        <div class="challenge-progress">
          <span class="progress-percent">${percent}%</span>
          <div class="progress-bar-bg">
            <div class="progress-bar" style="width:${percent}%"></div>
          </div>
        </div>
        <div class="challenge-goal">${firstGoal}</div>
      `;
      list.appendChild(row);
    });

    // --- 오른쪽 인증카드 리스트 ---
    const sideCards = document.querySelector('.challenge-side-cards');
    sideCards.innerHTML = '';
    const today = new Date();
    today.setHours(0,0,0,0);

    const cards = filtered.filter(ch => {
      if (!ch.startDate || !ch.endDate || !ch.certCycle) return false;
      const start = new Date(ch.startDate);
      const end = new Date(ch.endDate);
      start.setHours(0,0,0,0);
      end.setHours(0,0,0,0);
      if (today < start || today > end) return false;
      const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
      if (ch.certCycle === "매일") return true;
      if (ch.certCycle === "주 3회") {
        const dow = today.getDay();
        return (dow === 1 || dow === 3 || dow === 5);
      }
      if (ch.certCycle === "주 1회") return diff % 7 === 0;
      return false;
    });

    if (cards.length === 0) {
      sideCards.innerHTML = `<div style="padding:20px;color:#aaa;">오늘 인증할 도전이 없습니다.</div>`;
      return;
    }
    cards.forEach(ch => {
      const certImgStyle = makeCertImgStyle(ch.imgDataUrl);
      const div = document.createElement('div');
      div.className = 'cert-card';
      div.innerHTML = `
        <div class="cert-img" style="${certImgStyle}"></div>
        <div class="cert-category">${ch.category}</div>
        <div class="cert-title">${ch.title}</div>
        <a href="#" class="cert-link">인증하러 가기 →</a>
      `;
      sideCards.appendChild(div);
    });
  }

  // ------ 최초 렌더 ------
  renderLists();

  // ------ 도전 추가하기 버튼 ------
  document.getElementById('addChallengeBtn').onclick = function() {
    // SPA 전용: 페이지 이동은 무조건 loadPage로!
    if (typeof loadPage === "function") {
      loadPage('challengeAdd');
    } else if (window.loadPage) {
      window.loadPage('challengeAdd');
    } else {
      alert('SPA 함수(loadPage)가 없습니다!');
    }
  };
})();
