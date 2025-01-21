import { Data } from "./data.js";
import Lenis from "https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/+esm";
console.clear();

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis();
  const throttle = (func, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  // Smooth scrolling integration
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.lagSmoothing(0);

  // Scroll-triggered animations
  ScrollTrigger.create({
    trigger: ".landing",
    start: "top top",
    end: "bottom top",
    onUpdate(e) {
      const progress = e.progress;
      const translateY = progress * 200;
      gsap.set(".landing-content", { y: translateY });
    },
  });

  // Rotating child elements with scroll
  const RChilds = gsap.utils.toArray(".r_images .r_child");
  const RTheta = 360 / RChilds.length;
  RChilds.forEach((Child, i) => {
    gsap.to(Child, {
      rotate: i * RTheta,
      scrollTrigger: {
        trigger: ".page-2",
        start: "top 35%",
        end: "top -5%",
        scrub: 2,
      },
    });
  });

  // Loading logic
  let totalImageLoaded = 0;
  RChilds.forEach((Child, i) => {
    const RObject = Child.querySelector(".r_object");
    const img = document.createElement("img");
    img.src = Data[i].img;
    RObject.appendChild(img);

    img.onload = () => {
      totalImageLoaded++;
      gsap.to(".loading-line", {
        scaleX: totalImageLoaded / RChilds.length,
        onComplete() {
          if (totalImageLoaded === RChilds.length) {
            gsap.to(".loading", { delay: 0.2, scaleX: 0, duration: 0.6, ease: "power2.in" });
            gsap.to(".loader", {
              delay: 0.5,
              y: "-100%",
              duration: 1.2,
              ease: "power2.in",
              onComplete: () => gsap.set(".loader", { display: "none" }),
            });
          }
        },
      });
    };
  });

  // Optimized image grid display
  const imagesCon = document.querySelector(".landing-images .images");
  const showHeroImages = () => {
    imagesCon.innerHTML = "";
    const width = innerWidth;
    const height = innerHeight;
    const totalWidth = width * 2;
    const totalHeight = height * 2;
    const cols = Math.min(10, Math.floor(totalWidth / 100));
    const rows = Math.min(6, Math.floor(totalHeight / 100));

    gsap.set(imagesCon, {
      width: totalWidth,
      height: totalHeight,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
    });

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const ri = Math.floor(Math.random() * Data.length);
        const image = document.createElement("div");
        image.classList.add("Image");
        image.innerHTML = `<img src='${Data[ri].img}' />`;

        gsap.set(image, {
          width: 100,
          height: 100,
          gridColumn: i + 1,
          gridRow: j + 1,
          x: i % 2 === 0 ? (Math.random() - 0.5) * width / 10 : 0,
          y: j % 2 === 0 ? (Math.random() - 0.5) * width / 10 : 0,
        });
        imagesCon.appendChild(image);
      }
    }
  };
  showHeroImages();

  // Throttled mousemove event
  const handleImageMove = throttle((e) => {
    const { clientX: x, clientY: y } = e;
    const progress = {
      x: ((x - innerWidth / 2) / innerWidth) * 10,
      y: ((y - innerHeight / 2) / innerHeight) * 10,
    };

    gsap.to(".images", {
      x: `${progress.x}%`,
      y: `${progress.y}%`,
      duration: 1,
      ease: [0.61, 1, 0.88, 1],
    });
  }, 50);

  document.querySelector(".landing").addEventListener("mousemove", handleImageMove);

  // Navigation toggle
  const navIcon = document.querySelector(".nav-lines");
  const navIconLines = navIcon.querySelectorAll(".line");
  let isNavOpen = false;

  const toggleNav = () => {
    isNavOpen = !isNavOpen;
    const timeline = gsap.timeline();

    if (isNavOpen) {
      timeline
        .to(navIconLines[0], { rotate: 45 })
        .to(navIconLines[1], { rotate: -45 }, "<")
        .to('.nav-lines',{gap:0},'<')
        .to(".nav-content", { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 1 })
        .to(".nav-content a", { y: 0, stagger: 0.04 }, "<0.2");
      } else {
        timeline
        .to(".nav-content a", { y: "100%", stagger: 0.04 })
        .to(".nav-content", { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", duration: 0.6 }, "<0.2")
        .to(navIconLines[0], { rotate: 0 })
        .to(navIconLines[1], { rotate: 0 }, "<")
        .to('.nav-lines',{gap:'0.4rem'},'<')
    }
  };

  navIcon.addEventListener("click", toggleNav);

  // Resize handling
  let resizeID;
  window.onresize = () => {
    clearTimeout(resizeID);
    resizeID = setTimeout(() => {
      showHeroImages();
    }, 1000);
  };
});
