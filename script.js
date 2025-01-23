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

  ScrollTrigger.create({
    trigger:'.page-2',
    start:'top 5%',
    end:"bottom 5%",
    onEnter(){
      gsap.to('nav .nav-lines .line',{
        background:"white"
      })
      gsap.to('nav p',{
        color:"white"
      })
    },
    onLeave(){
      gsap.to('nav .nav-lines .line',{
        background:"#121111"
      })
      gsap.to('nav p',{
        color:"#121111"
      })
    },
    onEnterBack(){
      gsap.to('nav .nav-lines .line',{
        background:"white"
      })
      gsap.to('nav p',{
        color:"white"
      })
    },
    onLeaveBack(){
      gsap.to('nav .nav-lines .line',{
        background:"#121111"
      })
      gsap.to('nav p',{
        color:"#121111"
      })
    }
  })

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

  function ToSpans(elm) {
    const Elements = document.querySelectorAll(elm);
    if (!(Elements?.length >= 0) || !Elements ) return;
    Elements.forEach((Element) => {
      const Text = Element.textContent;
      const Spans = Text.split('').map((e, i) => {
        const Span = document.createElement("span");
        Span.innerHTML = e == " " ? "&nbsp;" : e;
        return Span;
      });
      Element.innerHTML = "";
      Element.append(...Spans);
    });
  }

  ToSpans(".text-w h1");
  ToSpans(".text-w h3");
  gsap.set('.text-w h1 span',{
    y:100
  })
  gsap.set('.text-w h3 span',{
    y:100
  })
  // ToSpans(".text-w h3");

  function Reveal() {
    gsap.to(".loading", {
      delay: 0.2,
      scaleX: 0,
      duration: 0.6,
      ease: "power2.in",
    });
    gsap.to(".loader", {
      delay: 0.5,
      y: "-100%",
      duration: 1.2,
      ease: "power2.in",
      onComplete: () => gsap.set(".loader", { display: "none" }),
    });
    gsap.to('.landing .landing-text .text-w h1 span',{
      delay:2,
      y:0,
      stagger:.01,
      ease:'power2'
    })
    gsap.to('.landing .landing-text .text-w h3 span',{
      delay:2.3,
      y:0,
      stagger:.01,
      ease:'power2'
    })
    gsap.to('.landing-images .images .Image',{
      delay:3,
      opacity:.7,
      stagger:.02,
    })
  }

  // Loading logic
  let totalImageLoaded = 0;
  RChilds.forEach((Child, i) => {
    const RObject = Child.querySelector(".r_object");
    const img = document.createElement("img");
    const idx = i % Data.length;
    img.src = Data[idx].img;
    RObject.appendChild(img);

    img.onload = () => {
      totalImageLoaded++;
      gsap.to(".loading-line", {
        scaleX: totalImageLoaded / RChilds.length,
        onComplete() {
          if (totalImageLoaded === RChilds.length) {
            Reveal();
          }
        },
      });
    };
  });

  // Generate a cryptographically random number
  const Random = () => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    let val = array[0] / (0xffffffff + 1);

    return val;
  };

  // Optimized image grid display
  const imagesCon = document.querySelector(".landing-images .images");
  const showHeroImages = () => {
    imagesCon.innerHTML = "";

    const width = innerWidth * 1.3,
      height = innerHeight * 1.3;

    gsap.set(imagesCon, {
      width,
      height,
    });

    const { sin, cos, PI, floor, random, min, max } = Math;

    // Constants
    const Factor = 200; // Spacing between circles
    let Radius = Factor;
    // const MaxLoops = min(floor(width / 100), 2); // Cap the loops for performance
    const MaxLoops = 2; // Cap the loops for performance

    for (let i = 1; i <= MaxLoops; i++) {
      // Calculate the number of images based on the circle's circumference and image width
      let circumference = 2 * Math.PI * Radius;
      let maxImages = Math.floor(circumference / 100); // Assume image width of 100px
      let InnerLoops = Math.min(maxImages, 8); // Cap the number of images for performance

      // Calculate the angle increment based on the number of images
      const DeltaTheta = (2 * Math.PI) / InnerLoops;

      for (let j = 0; j < InnerLoops; j++) {
        const Theta = DeltaTheta * j; // Uniform spacing
        const x = Math.cos(Theta) * Radius;
        const y = Math.sin(Theta) * Radius;

        // Create and position the image container
        const ImgCon = document.createElement("div");
        ImgCon.classList.add("Image");
        gsap.set(ImgCon, {
          position: "absolute",
          top: height / 2 + y - 65, // Center vertically (- half height)
          left: width / 2 + x - 50, // Center horizontally (- half width)
          width: 100,
          height: 100,
          opacity:0
        });
        ImgCon.innerHTML = `<img src='${
          Data[floor(random() * Data.length)].img
        }' />`;
        imagesCon.appendChild(ImgCon);
      }
      Radius += Factor; // Increase radius for the next circle
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

  document
    .querySelector(".landing")
    .addEventListener("mousemove", handleImageMove);

  // Navigation toggle
  const navIcon = document.querySelector(".nav-lines");
  const navIconLines = navIcon.querySelectorAll(".line");
  let isNavOpen = false;
  let isAnimating = false;

  const toggleNav = () => {
    isNavOpen = !isNavOpen;

    if (isAnimating) return;
    const timeline = gsap.timeline({
      onComplete() {
        isAnimating = false;
      },
    });
    isAnimating = true;

    if (isNavOpen) {
      timeline
        .to(navIconLines[0], { rotate: 45 })
        .to(navIconLines[1], { rotate: -45 }, "<")
        .to(".nav-lines", { gap: 0 }, "<")
        .to(
          ".nav-content",
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 1,
          },
          "<"
        )
        .to(".nav-content a", { y: 0, stagger: 0.04 }, "<0.2");
    } else {
      timeline
        .to(".nav-content a", { y: "100%", stagger: 0.04 })
        .to(
          ".nav-content",
          {
            clipPath: "polygon(0 0, 100% 0, 100% 0%, 0 0%)",
            duration: 1,
          },
          "<"
        )
        .to(navIconLines[0], { rotate: 0 }, "<")
        .to(navIconLines[1], { rotate: 0 }, "<")
        .to(".nav-lines", { gap: "0.4rem" }, "<");
    }
  };

  navIcon.addEventListener("click", toggleNav);

  // Resize handling
  let resizeID;
  window.onresize = () => {
    clearTimeout(resizeID);
    resizeID = setTimeout(() => {
      showHeroImages();
      gsap.to('.landing-images .images .Image',{
        opacity:.7,
        stagger:.02,
      })
    }, 1000);
  };
});
