const checkedUrl = "../../assets/Checked Checkbox1.svg";
const uncheckedUrl = "../../assets/Checked Checkbox.svg";

// 상세페이지 렌더 함수 (SPA: loadPage('challengeDetail', challengeId))
window.renderChallengeDetail = function(challengeKey) {
  // ===== (1) 도전 데이터 로딩 및 찾기 =====
  const data = JSON.parse(localStorage.getItem('challenges') || '[]');
  let challenge = data.find(ch =>
    String(ch.id) === String(challengeKey) || ch.title === challengeKey
  );
  if (!challenge) {
    alert("해당 도전 정보를 찾을 수 없습니다.");
    return;
  }

  // ===== (2) 썸네일/기본정보 출력 =====
  const thumb = document.querySelector('.challenge-detail-thumb');
  if (thumb) {
    if (challenge.imgDataUrl) {
      thumb.style.background = `url('${challenge.imgDataUrl}') center/cover no-repeat`;
      thumb.style.borderRadius = "12px";
      thumb.style.width = "260px";
      thumb.style.height = "260px";
    } else {
      thumb.style.background = "#e9e9e9";
      thumb.style.borderRadius = "12px";
      thumb.style.width = "260px";
      thumb.style.height = "260px";
    }
  }
  // 카테고리, 타이틀, 기간, 공개여부
  document.querySelector('.challenge-detail-category').textContent = challenge.category || "";
  document.querySelector('.challenge-detail-title').textContent = challenge.title || "";
  document.querySelector('.challenge-detail-date').textContent =
    challenge.startDate && challenge.endDate ? `${challenge.startDate} - ${challenge.endDate}` : "";

  // ===== (3) D+N, D-M(디데이) 계산 =====
  if (challenge.startDate && challenge.endDate) {
    const start = new Date(challenge.startDate);
    const end = new Date(challenge.endDate);
    const now = new Date();
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    const dPlus = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
    const dMinus = Math.floor((end - now) / (1000 * 60 * 60 * 24));
    const ddayEls = document.querySelectorAll('.challenge-detail-dday');
    if (ddayEls.length >= 2) {
      ddayEls[0].textContent = `이 도전을 시작한 지 D+${dPlus}`;
      ddayEls[1].textContent = dMinus >= 0 ? `종료까지 D-${dMinus}` : `종료된 도전입니다`;
    }
  }
  document.querySelector('.challenge-detail-public').textContent = challenge.isPublic ? "공개" : "비공개";

  // ===== (4) 진행률 바 & 텍스트 렌더 =====
  function updateProgressUI() {
    const total = (challenge.goals || []).length;
    const done = (challenge.completedGoals || []).length || 0;
    const percent = total ? Math.round((done / total) * 100) : 0;
    document.querySelector('.challenge-detail-progress-label').textContent = `진행률 ${percent}% (${done}/${total})`;
    document.getElementById('progressBar').style.width = percent + "%";
  }

  // ===== (5) 세부 목표(완료/진행중) 렌더링 및 체크/체크해제 동작 =====
  function renderGoals() {
    let completedGoals = challenge.completedGoals || [];
    const completedList = document.getElementById('completedGoalList');
    const inprogressList = document.getElementById('inprogressGoalList');
    completedList.innerHTML = "";
    inprogressList.innerHTML = "";

    // --- 완료한 세부 목표 리스트 ---
    completedGoals.forEach(goal => {
      const li = document.createElement('li');
      li.innerHTML = `
        <button class="goal-checkbox-btn" aria-label="체크 해제">
          <img src="${checkedUrl}" alt="체크 아이콘" width="24" height="24" />
        </button>
        <span class="goal-text-box">${goal}</span>
      `;
      completedList.appendChild(li);
    });

    // --- 진행중(미완료) 세부 목표 리스트 ---
    (challenge.goals || []).forEach(goal => {
      if (!completedGoals.includes(goal)) {
        const li = document.createElement('li');
        li.innerHTML = `
          <button class="goal-checkbox-btn" aria-label="목표 체크">
            <img src="${uncheckedUrl}" alt="체크박스 해제" width="24" height="24" />
          </button>
          <span class="goal-text-box inprogress">${goal}</span>
        `;
        inprogressList.appendChild(li);
      }
    });

    // --- 체크해서 완료 처리 ---
    inprogressList.querySelectorAll('.goal-checkbox-btn').forEach(btn => {
      btn.onclick = function () {
        const li = this.closest('li');
        const goalText = li.querySelector('.goal-text-box').textContent.trim();
        if (!completedGoals.includes(goalText)) {
          completedGoals.push(goalText);
        }
        challenge.completedGoals = completedGoals;
        const idx = data.findIndex(ch => ch.id === challenge.id);
        if (idx !== -1) {
          data[idx] = challenge;
          localStorage.setItem('challenges', JSON.stringify(data));
        }
        renderGoals();
        updateProgressUI();
      };
    });

    // --- 체크 해제해서 미완료로 복귀 ---
    completedList.querySelectorAll('.goal-checkbox-btn').forEach(btn => {
      btn.onclick = function () {
        const li = this.closest('li');
        const goalText = li.querySelector('.goal-text-box').textContent.trim();
        completedGoals = completedGoals.filter(g => g !== goalText);
        challenge.completedGoals = completedGoals;
        const idx = data.findIndex(ch => ch.id === challenge.id);
        if (idx !== -1) {
          data[idx] = challenge;
          localStorage.setItem('challenges', JSON.stringify(data));
        }
        renderGoals();
        updateProgressUI();
      };
    });

    // --- 목표 없을 때 안내문 ---
    if ((challenge.goals || []).length === 0) {
      inprogressList.innerHTML = '<li><span style="color:#aaa;">세부 목표가 없습니다.</span></li>';
    }
  }

  // ===== (6) 인증기록 카드 렌더 및 카드 클릭 이동 =====
  function renderCertRecords(filterDate) {
    const certRecords = JSON.parse(localStorage.getItem('certRecords') || '[]');
    const myCerts = certRecords
      .filter(r => String(r.challengeId) === String(challenge.id))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    const recordList = document.getElementById('recordList');
    recordList.innerHTML = '';
    const certsToShow = filterDate
      ? myCerts.filter(cert => cert.date === filterDate)
      : myCerts;
    if (certsToShow.length === 0) {
      recordList.innerHTML = '<div style="color:#aaa; padding:24px 0;">아직 인증 기록이 없습니다.</div>';
      return;
    }
    certsToShow.forEach(cert => {
      let thumbHtml = cert.imgDataUrl
        ? `<div class="record-thumb" style="background:url('${cert.imgDataUrl}') center/cover no-repeat;border-radius:10px;width:44px;height:44px;"></div>`
        : `<div class="record-thumb" style="background:#e9e9e9;border-radius:10px;width:44px;height:44px;"></div>`;
      // data-cert-id 속성 부여로 인증글 상세로 이동
      recordList.innerHTML += `
        <div class="challenge-record-card" data-cert-id="${cert.id}">
          ${thumbHtml}
          <div class="record-detail">
            <div class="record-date">${cert.date.replaceAll('-', '.')}.</div>
            <div class="record-title">${cert.goal}</div>
            <div class="record-content">
              <span class="record-content-title">${cert.title}</span><br>
              <span class="record-content-body">${cert.content}</span>
            </div>
          </div>
        </div>
      `;
    });
    // --- 인증글 카드 클릭 → 인증 상세 페이지(SPA) 이동 ---
    recordList.querySelectorAll('.challenge-record-card').forEach(card => {
      card.onclick = function() {
        const certId = this.getAttribute('data-cert-id');
        if (window.loadPage) window.loadPage('certDetail', certId);
      };
    });
  }

  // ===== (7) 달력 렌더링 및 일자 클릭시 필터 =====
  function renderCalendar(year, month, selectedDateStr) {
    const calendarContainer = document.querySelector('.calendar-grid');
    const calendarHeader = document.querySelector('.calendar-header span');
    if (!calendarContainer || !calendarHeader) return;
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    let html = dayNames.map(d => `<div class="calendar-day-header">${d}</div>`).join('');
    const certRecords = JSON.parse(localStorage.getItem('certRecords') || '[]');
    const myCerts = certRecords.filter(r => String(r.challengeId) === String(challenge.id));
    const certDates = myCerts.map(cert => cert.date);
    calendarHeader.textContent = `${year} ${month.toString().padStart(2, '0')}`;
    const firstDay = new Date(year, month - 1, 1).getDay();
    const lastDate = new Date(year, month, 0).getDate();
    const prevLastDate = new Date(year, month - 1, 0).getDate();
    const todayStr = new Date().toISOString().slice(0, 10);
    const activeDateStr = selectedDateStr || todayStr;
    // --- 지난달 빈칸 ---
    for (let i = 0; i < firstDay; i++) {
      html += `<div class="calendar-day other-month"><span class="calendar-day-inner">${prevLastDate - firstDay + i + 1}</span></div>`;
    }
    // --- 이번달 일수 ---
    for (let d = 1; d <= lastDate; d++) {
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      let classes = "calendar-day";
      if (dateStr === activeDateStr) classes += " active";
      if (certDates.includes(dateStr)) classes += " completed";
      let dot = "";
      if (certDates.includes(dateStr)) dot = `<div class="calendar-dot"></div>`;
      html += `
        <div class="${classes}" data-date="${dateStr}">
          <span class="calendar-day-inner">
            ${dot}
            ${d}
          </span>
        </div>
      `;
    }
    // --- 다음달 빈칸 ---
    const afterDays = (firstDay + lastDate) % 7 === 0 ? 0 : 7 - ((firstDay + lastDate) % 7);
    for (let i = 1; i <= afterDays; i++) {
      html += `<div class="calendar-day other-month"><span class="calendar-day-inner">${i}</span></div>`;
    }
    calendarContainer.innerHTML = html;
    // --- 일자 클릭시 인증기록 필터 ---
    calendarContainer.querySelectorAll('.calendar-day').forEach(day => {
      if (!day.classList.contains('other-month')) {
        day.onclick = function () {
          const dateStr = this.getAttribute('data-date');
          renderCalendar(year, month, dateStr);
          renderCertRecords(dateStr);
        }
      }
    });
  }

  // ===== (8) 최초 렌더링 =====
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const todayStr = now.toISOString().slice(0, 10);
  renderGoals();
  updateProgressUI();
  renderCertRecords(todayStr);
  renderCalendar(year, month, todayStr);

  // ===== (9) 상단/하단 버튼 및 모달 동작 =====
  // 수정하기
  document.getElementById('editBtn').onclick = function() {
    if (window.loadPage) window.loadPage('challengeAdd', challenge.id);
  };
  // 인증하기
  document.getElementById('certBtn').onclick = function () {
    if (window.loadPage) window.loadPage('certAdd', challenge.id);
  };
  // 삭제 모달 열기
  document.getElementById('deleteBtn').onclick = function () {
    document.getElementById('modalCategory').textContent = challenge.category || "";
    document.getElementById('modalTitle').textContent = challenge.title || "";
    document.getElementById('deleteModal').style.display = 'flex';
  };
  // 삭제 모달 닫기(아니요)
  document.getElementById('modalDeleteNo').onclick = function () {
    document.getElementById('deleteModal').style.display = 'none';
  };
  // 도전 삭제(예)
  document.getElementById('modalDeleteYes').onclick = function () {
    let data = JSON.parse(localStorage.getItem('challenges') || '[]');
    data = data.filter(ch => String(ch.id) !== String(challenge.id));
    localStorage.setItem('challenges', JSON.stringify(data));
    // 인증기록도 같이 삭제
    let certRecords = JSON.parse(localStorage.getItem('certRecords') || '[]');
    certRecords = certRecords.filter(r => String(r.challengeId) !== String(challenge.id));
    localStorage.setItem('certRecords', JSON.stringify(certRecords));
    document.getElementById('deleteModal').style.display = 'none';
    alert('도전이 삭제되었습니다.');
    if (window.loadPage) window.loadPage('myChallenge');
  };

  // 상단 X(닫기)
  const closeBtn = document.getElementById('globalCloseBtn');
  if (closeBtn) {
    closeBtn.onclick = function() {
      if (window.loadPage) window.loadPage('myChallenge');
    }
  }
};
