import { Data } from "./data.js";
console.clear();

document.addEventListener("DOMContentLoaded", () => {
  const RImages = document.querySelectorAll(".r_images .r_child");
  let TotalImageLoaded = 0;
  RImages.forEach((Image, i) => {
    const RObject = Image.querySelector(".r_object");
    const img = document.createElement("img");
    img.src = Data[i].img;
    RObject.appendChild(img);
    img.onload = () => {
      TotalImageLoaded++;
      gsap.to(".loading-line", {
        scaleX: TotalImageLoaded / RImages.length,
        onComplete() {
          if (TotalImageLoaded == RImages.length) {
            gsap.to(".loader", {
              delay:.3,
              y: "-100%",
              duration: 0.6,
              ease: "power3.out",
              onComplete() {
                gsap.set(".loader", {
                  display: "none",
                });
              },
            });
          }
        },
      });
    };
  });

  const ImagesCon = document.querySelector(".landing-images .images");
  const NavIcon = document.querySelector(".nav-lines");
  const NavIconLines = NavIcon.querySelectorAll(".nav-lines .line");

  let IsNavOpen = false;

  const ToggleNav = () => {
    if (IsNavOpen) {
      IsNavOpen = false;
      gsap.to(".nav-content a", {
        y: "100%",
        delay: 0.1,
        stagger: 0.04,
      });
      gsap.to(".nav-content", {
        delay: 0.2,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 0.6,
        ease: "power2.out",
      });
      gsap.to(".nav-lines", {
        gap: "0.4rem",
      });
      gsap.to(NavIconLines[0], {
        rotate: 0,
      });
      gsap.to(NavIconLines[1], {
        rotate: 0,
      });
    } else {
      IsNavOpen = true;
      gsap.to(".nav-lines", {
        gap: 0,
      });
      gsap.to(NavIconLines[0], {
        rotate: 45,
      });
      gsap.to(NavIconLines[1], {
        rotate: -45,
      });
      gsap.to(".nav-content", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 1,
        ease: "power3",
      });
      gsap.to(".nav-content a", {
        y: 0,
        delay: 0.2,
        stagger: 0.04,
      });
    }
  };

  const ShowHeroImages = () => {
    ImagesCon.innerHTML = "";
    const width = innerWidth;
    const height = innerHeight;
    const TotalWidth = width * 2;
    const TotalHeight = height * 2;
    const Cols = Math.min(10, Math.floor(TotalWidth / 100));
    const Rows = Math.min(6, Math.floor(TotalHeight / 100));
    gsap.set(ImagesCon, {
      width: TotalWidth,
      height: TotalHeight,
      gridTemplateRows: Rows,
      gridTemplateColumns: Cols,
    });

    for (let i = 0; i < Cols; i++) {
      for (let j = 0; j < Rows; j++) {
        const RI = Math.floor(Math.random() * Data.length);
        const Image = document.createElement("div");
        Image.classList.add("Image");
        Image.innerHTML = `<img src='${Data[RI].img}' />`;

        const DeltaX = i % 2 == 0 ? ((Math.random() - 0.5) * width) / 10 : 0;
        const DeltaY = j % 2 == 0 ? ((Math.random() - 0.5) * width) / 10 : 0;

        gsap.set(Image, {
          width: 100,
          height: 100,
          gridColumn: i + 1,
          gridRow: j + 1,
          // background:'red',
          x: DeltaX,
          y: DeltaY,
        });
        ImagesCon.appendChild(Image);
      }
    }
  };
  // ShowHeroImages();
  const HandleImageMove = (() => {
    let OpacityID = null;
    return (e) => {
      clearTimeout(OpacityID);
      gsap.to(".images .Image", {
        opacity: 1,
        duration: 0.3,
        stagger: 0.001,
      });
      const { clientX: x, clientY: y } = e;
      const Progress = {
        x: ((x - innerWidth / 2) / innerWidth) * 10,
        y: ((y - innerHeight / 2) / innerHeight) * 10,
      };
      gsap.to(".images", {
        x: `${Progress.x}%`,
        y: `${Progress.y}%`,
        duration: 1,
        ease: [0.61, 1, 0.88, 1],
        overwrite: "auto",
      });
      OpacityID = setTimeout(() => {
        gsap.to(".images .Image", {
          opacity: 0.8,
          duration: 0.5,
        });
      }, 600);
    };
  })();

  const RTheta = 360 / RImages.length;
  RImages.forEach((RImage, i) => {
    gsap.set(RImage, {
      rotate: RTheta * i,
    });
  });

  NavIcon.addEventListener("click", ToggleNav);

  // document.addEventListener("mousemove", HandleImageMove);

  let ResizeID = null;
  window.onresize = () => {
    clearTimeout(ResizeID);
    ResizeID = setTimeout(() => {
      ShowHeroImages();
    }, 1000);
  };
});
