/* =====================================================================
   Shared MENU overlay behaviour (top-right button on every page).
   Adapted from the uploaded component. Self-contained: it does not
   depend on any page-specific ".hero" element, so it works on both the
   home page and the projects page. Requires GSAP (loaded on the page).
   ===================================================================== */
(function () {
  if (typeof gsap === 'undefined') return;

  /* ---- Image stack parallax / tilt ---- */
  const menuImgContainer = document.querySelector('.menu-img');
  const images = document.querySelectorAll('.menu-img img');
  if (menuImgContainer && images.length) {
    let mouse = { x: 0, y: 0 };
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    const scales = [0.81, 0.84, 0.87, 0.9];

    const update = () => {
      const dx = mouse.x - cx;
      const dy = mouse.y - cy;
      const tiltx = (dy / cy) * 20;
      const tilty = (dx / cx) * 20;
      gsap.to(menuImgContainer, {
        duration: 2,
        transform: `rotate3d(${tiltx}, ${tilty}, 0, 15deg)`,
        ease: 'power3.out',
      });
      images.forEach((img, index) => {
        const parallaxX = -(dx * (index + 1)) / 100;
        const parallaxY = -(dy * (index + 1)) / 100;
        gsap.to(img, {
          duration: 2,
          transform: `translate(calc(-50% + ${parallaxX}px), calc(-50% + ${parallaxY}px)) scale(${scales[index]})`,
          ease: 'power3.out',
        });
      });
    };

    document.body.addEventListener('mousemove', (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      update();
    });
    window.addEventListener('resize', () => {
      cx = window.innerWidth / 2;
      cy = window.innerHeight / 2;
    });
  }

  /* ---- Open / close ---- */
  const menuOpen = document.querySelector('.menu-open');
  const menuClose = document.querySelector('.menu-close');
  if (!menuOpen || !menuClose) return;

  let isOpen = false;
  const defaultEase = 'power4.inOut';

  gsap.set('.menu-logo img', { y: 50 });
  gsap.set('.menu-link p', { y: 40 });
  gsap.set('.menu-sub-item p', { y: 12 });
  gsap.set(['#img-2, #img-3, #img-4'], { top: '150%' });

  const openMenu = () => {
    gsap.to('.menu', {
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
      pointerEvents: 'all',
      duration: 1.25,
      ease: defaultEase,
    });
    gsap.to('.menu-logo img', { y: 0, duration: 1, delay: 0.75, ease: 'power3.out' });
    gsap.to('.menu-link p', { y: 0, duration: 1, stagger: 0.075, delay: 1, ease: 'power3.out' });
    gsap.to('.menu-sub-item p', { y: 0, duration: 0.75, stagger: 0.05, delay: 1, ease: 'power3.out' });
    gsap.to(['#img-2, #img-3, #img-4'], {
      top: '50%', duration: 1.25, ease: defaultEase, stagger: 0.1, delay: 0.25,
      onComplete: () => { isOpen = true; },
    });
  };

  const closeMenu = () => {
    gsap.to('.menu-items', { top: '-300px', opacity: 0, duration: 1.25, ease: defaultEase });
    gsap.to('.menu', {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      pointerEvents: 'none',
      duration: 1.25,
      ease: defaultEase,
      onComplete: () => {
        gsap.set('.menu', { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' });
        gsap.set('.menu-logo img', { y: 50 });
        gsap.set('.menu-link p', { y: 40 });
        gsap.set('.menu-sub-item p', { y: 12 });
        gsap.set('.menu-items', { opacity: 1, top: '0px' });
        gsap.set(['#img-2, #img-3, #img-4'], { top: '150%' });
        isOpen = false;
      },
    });
  };

  menuOpen.addEventListener('click', () => { if (!isOpen) openMenu(); });
  menuClose.addEventListener('click', () => { if (isOpen) closeMenu(); });
})();
