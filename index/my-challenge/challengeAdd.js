(function () {
  // ------- 카테고리 선택 -------
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.onclick = function () {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
    }
  });

  // ------- 이미지 미리보기 -------
  const imgInput = document.getElementById('imgInput');
  const imgPreview = document.getElementById('imgPreview');
  let imgDataUrl = "";
  if (imgInput && imgPreview) {
    imgInput.onchange = function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (ev) {
          imgDataUrl = ev.target.result;
          imgPreview.style.display = 'none';
          const uploadBox = imgPreview.parentNode;
          uploadBox.style.backgroundImage = `url('${imgDataUrl}')`;
          uploadBox.style.backgroundSize = 'cover';
          uploadBox.style.backgroundPosition = 'center';
          uploadBox.style.backgroundRepeat = 'no-repeat';
          uploadBox.style.border = 'none';
        }
        reader.readAsDataURL(file);
      }
    };
  }

  // ------- 세부 목표 추가/삭제 -------
  const goalInput = document.querySelector('.goal-input');
  const goalAddBtn = document.querySelector('.goal-add-btn');
  const goalList = document.querySelector('.goal-list');
  if (goalInput && goalAddBtn && goalList) {
    goalAddBtn.onclick = function () {
      const value = goalInput.value.trim();
      if (value) {
        const li = document.createElement('li');
        // 텍스트만 li에 바로 넣지 않고, 텍스트 span 따로 만들어서 삭제버튼과 구분!
        const textSpan = document.createElement('span');
        textSpan.className = 'goal-text';
        textSpan.textContent = value;
        li.appendChild(textSpan);

        // 삭제 버튼
        const rm = document.createElement('span');
        rm.textContent = '✕';
        rm.className = 'remove-goal';
        rm.onclick = () => li.remove();
        li.appendChild(rm);

        goalList.appendChild(li);
        goalInput.value = '';
        goalInput.focus();
      }
    };
    // 엔터로 세부 목표 추가
    goalInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') goalAddBtn.click();
    });
  }

  // ------- 인증주기 커스텀 드롭다운 -------
  const certDropdown = document.getElementById('certDropdown');
  if (certDropdown) {
    const selected = certDropdown.querySelector('.dropdown-selected');
    const options = certDropdown.querySelectorAll('.dropdown-list li');
    if (selected) {
      selected.addEventListener('click', function (e) {
        e.stopPropagation();
        certDropdown.classList.toggle('open');
        selected.classList.toggle('active');
      });
    }
    options.forEach(opt => {
      opt.addEventListener('click', function (e) {
        e.stopPropagation();
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        if (selected) {
          selected.querySelector('.dropdown-selected-text').textContent = opt.textContent;
        }
        certDropdown.classList.remove('open');
        if (selected) selected.classList.remove('active');
      });
    });
    // 바깥쪽 클릭 시 닫기 (단, 드롭다운 내부 클릭은 무시)
    document.addEventListener('click', (e) => {
      if (!certDropdown.contains(e.target)) {
        certDropdown.classList.remove('open');
        if (selected) selected.classList.remove('active');
      }
    });
  }

  // ------- 등록(저장) -------
  const registerBtn = document.querySelector('.register-btn');
  if (registerBtn) {
    registerBtn.onclick = function () {
      const title = document.querySelector('.challenge-name-input').value.trim();
      const category = document.querySelector('.category-btn.selected')?.textContent.trim() || '';
      const periodInputs = document.querySelectorAll('.period-input');
      const startDate = periodInputs[0]?.value || '';
      const endDate = periodInputs[1]?.value || '';
      const isPublic = document.querySelector('.switch input').checked;
      const certSelected = document.querySelector('#certDropdown .dropdown-selected-text');
      const certCycle = certSelected ? certSelected.textContent : '';

      // 세부목표
      const goals = [];
      document.querySelectorAll('.goal-list li .goal-text').forEach(span => {
        goals.push(span.textContent.trim());
      });

      if (!title) {
        alert('도전 이름을 입력해주세요.');
        return;
      }

      const challenge = {
        id: Date.now(),
        title,
        category,
        startDate,
        endDate,
        isPublic,
        certCycle,
        goals,
        imgDataUrl,
        progress: 0
      };

      const prev = JSON.parse(localStorage.getItem('challenges') || '[]');
      prev.push(challenge);
      localStorage.setItem('challenges', JSON.stringify(prev));

      alert("도전이 등록되었습니다!");
      // *** SPA 방식: loadPage로 이동! ***
      if (typeof loadPage === "function") {
        loadPage('myChallenge');
      } else if (window.loadPage) {
        window.loadPage('myChallenge');
      }
    };
  }

  // ------- 닫기(✕) 버튼도 SPA 방식 -------
  const closeBtn = document.getElementById('challengeAddCloseBtn');
  if (closeBtn) {
    closeBtn.onclick = function () {
      if (typeof loadPage === "function") {
        loadPage('myChallenge');
      } else if (window.loadPage) {
        window.loadPage('myChallenge');
      }
    };
  }
})();
