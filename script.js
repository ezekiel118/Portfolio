// Gallery modal carousel for grouped projects (AGS and POS)
(function(){
  const galleries = {
    AGS: ['picture/ags1.jpg','picture/ags2.jpg','picture/ags3.png','video/agsvid.mp4'],
    POS: ['picture/POS1.PNG','picture/POS2.PNG','picture/POS3.PNG','picture/POS4.PNG']
  };

  // Map of which items are videos (instead of images)
  const isVideo = {
    'video/agsvid.mp4': true
  };

  const modal = document.getElementById('galleryModal');
  const modalImageWrap = document.querySelector('.modal-image-wrap');
  const btnClose = document.getElementById('modalClose');
  const btnPrev = document.getElementById('modalPrev');
  const btnNext = document.getElementById('modalNext');

  let currentGallery = null;
  let currentIndex = 0;

  function openGallery(group, startIndex = 0) {
    const list = galleries[group];
    if (!list) return;
    currentGallery = group;
    currentIndex = startIndex || 0;
    showImage();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeGallery() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentGallery = null;
    
    // Stop any playing video
    const video = modalImageWrap.querySelector('video');
    if (video) video.pause();
  }

  function showImage() {
    const list = galleries[currentGallery];
    if (!list || !list.length) return;
    const src = list[currentIndex];
    
    // Clear previous content
    modalImageWrap.innerHTML = '';
    
    if (isVideo[src]) {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.style.maxWidth = '100%';
      video.style.maxHeight = '75vh';
      video.style.borderRadius = '10px';
      video.style.display = 'block';
      video.style.margin = '0 auto';
      modalImageWrap.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Project image';
      img.style.maxWidth = '100%';
      img.style.maxHeight = '75vh';
      img.style.borderRadius = '10px';
      img.style.objectFit = 'contain';
      img.style.display = 'block';
      img.style.margin = '0 auto';
      modalImageWrap.appendChild(img);
    }
    
    const caption = document.createElement('div');
    caption.className = 'modal-caption';
    caption.textContent = `${currentGallery} ${currentIndex + 1} / ${list.length}`;
    modalImageWrap.appendChild(caption);
  }

  function prevImage() {
    const list = galleries[currentGallery];
    if (!list) return;
    currentIndex = (currentIndex - 1 + list.length) % list.length;
    showImage();
  }

  function nextImage() {
    const list = galleries[currentGallery];
    if (!list) return;
    currentIndex = (currentIndex + 1) % list.length;
    showImage();
  }

  // Attach click handlers for group covers
  document.querySelectorAll('.project-group').forEach(el => {
    el.addEventListener('click', () => {
      const grp = el.getAttribute('data-group');
      openGallery(grp, 0);
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const grp = el.getAttribute('data-group');
        openGallery(grp, 0);
      }
    });
  });

  btnClose.addEventListener('click', closeGallery);
  btnPrev.addEventListener('click', prevImage);
  btnNext.addEventListener('click', nextImage);

  // Close when clicking outside the modal-content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeGallery();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!currentGallery) return;
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'Escape') closeGallery();
  });

  // Preload images (videos can't be easily preloaded)
  function preloadGroup(group) {
    const list = galleries[group] || [];
    list.forEach(src => {
      if (!isVideo[src]) {
        const i = new Image(); i.src = src;
      }
    });
  }
  Object.keys(galleries).forEach(preloadGroup);

})();