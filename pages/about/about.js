document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.querySelector('.gallery-grid');
  const items = document.querySelectorAll('.gallery-item');
  const infoPanel = document.getElementById('infoPanel');
  const infoImg = document.getElementById('infoImg');
  const infoTitle = document.getElementById('infoTitle');
  const infoDesc = document.getElementById('infoDesc');
  const openFull = document.getElementById('openFull');
  const closeInfo = document.getElementById('closeInfo');

  // Пример данных (должно соответствовать data-index)
  const images = Array.from(items).map((item, index) => ({
    src: item.querySelector('img').src,
    title: `Изображение ${index + 1}`,
    desc: `Описание к изображению ${index + 1}`
  }));

  let raf;

  /* ---------- Tilt эффект при наведении ---------- */
  galleryGrid.addEventListener('mousemove', (e) => {
    const card = e.target.closest('.gallery-item');
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -(y - centerY) / 15;
    const rotateY = (x - centerX) / 15;

    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
      card.style.boxShadow = '0 18px 40px rgba(15,23,42,0.12)';
      const img = card.querySelector('img');
      if (img) img.style.transform = 'scale(1.06) translateZ(0)';
    });
  });

  // Сброс эффектов
  galleryGrid.addEventListener('mouseleave', () => {
    items.forEach((card) => {
      card.style.transform = '';
      card.style.boxShadow = '';
      const img = card.querySelector('img');
      if (img) img.style.transform = '';
    });
  });

  galleryGrid.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.gallery-item');
    if (!card) return;
    requestAnimationFrame(() => {
      card.style.transform = '';
      card.style.boxShadow = '';
      const img = card.querySelector('img');
      if (img) img.style.transform = '';
    });
  });

  /* ---------- Клик по карточке — показать info ---------- */
  items.forEach((card, index) => {
    card.addEventListener('click', () => showInfo(index));
  });

  function showInfo(index) {
    const data = images[index];
    if (!data) return;

    infoImg.src = data.src;
    infoImg.alt = data.title;
    infoTitle.textContent = data.title;
    infoDesc.textContent = data.desc;
    openFull.href = data.src;

    infoPanel.classList.remove('fade-out');
    infoPanel.style.opacity = '1';
    infoPanel.style.transform = 'translateY(0)';
    infoPanel.style.pointerEvents = 'auto';
    infoPanel.classList.add('info-pop');
    infoPanel.style.boxShadow = '0 18px 40px rgba(15,23,42,0.08)';

    infoPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function hideInfo() {
    infoPanel.classList.add('fade-out');
    setTimeout(() => {
      infoPanel.style.opacity = '0';
      infoPanel.style.transform = 'translateY(8px)';
      infoPanel.style.pointerEvents = 'none';
      infoPanel.classList.remove('info-pop');
    }, 220);
  }

  closeInfo.addEventListener('click', hideInfo);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideInfo();
  });

  /* ---------- Эффект печатающего текста ---------- */
  (function typeWriter() {
    const sub = document.getElementById('subtitle');
    const fullText = 'Мы создаём интерфейсы, которые радуют — пролистай вниз, чтобы увидеть нашу галерею.';
    let i = 0;
    sub.textContent = '';
    const speed = 18;
    const timer = setInterval(() => {
      sub.textContent += fullText[i++] || '';
      if (i >= fullText.length) clearInterval(timer);
    }, speed);
  })();

  /* ---------- Клавиатурная доступность ---------- */
  items.forEach((item, index) => {
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        showInfo(index);
      }
    });
  });

  /* ---------- Очистка при закрытии страницы ---------- */
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(raf);
  });
});
