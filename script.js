const loader = document.getElementById("loader");
const audio = document.getElementById("bg-audio");
const audioBtn = document.getElementById("sound-toggle");
const petalsContainer = document.getElementById("petals");
const enterSound = document.getElementById("enter-sound");

let isPlaying = false;
let isScrolling = false;
let offset = 80; // hauteur header
/*let targetY = target.offsetTop - offset;*/

document.body.style.overflow = "hidden";

// 🌸 PETALS
function createPetalsSoft() {
    for (let i = 0; i < 500; i++) {

        let petal = document.createElement("div");
        petal.classList.add("petal");

        petal.style.left = Math.random() * 100 + "vw";
        petal.style.animationDuration = (Math.random() * 5 + 2) + "s";

        let size = Math.random() * 6 + 8;
        petal.style.width = size + "px";
        petal.style.height = size + "px";

        petal.style.animationDelay = Math.random() * 3 + "s";

        petalsContainer.appendChild(petal);

        setTimeout(() => petal.remove(), 5000);
    }
}

// ENTER
loader.addEventListener("click", () => {

    enterSound.currentTime = 0;
    enterSound.play();
	
	// AUDIO START
    audio.volume = 0;
    audio.play();
    isPlaying = true;
    audioBtn.textContent = "🔊";

    let vol = 0;
    let fade = setInterval(() => {
        if (vol < 0.5) {
            vol += 0.01;
            audio.volume = vol;
        } else {
            clearInterval(fade);
        }
    }, 50);
	
	createPetalsSoft();

    setTimeout(() => {
        loader.style.opacity = "0";

        setTimeout(() => {
            loader.style.display = "none";
            document.body.style.overflow = "auto";
            initScroll();
        }, 2000);

    }, 2300);

    audio.volume = 100;
    audio.play();
    isPlaying = true;
    audioBtn.textContent = "🔊";
});

// AUDIO BUTTON
audioBtn.onclick = () => {
    if (audio.paused) {
        audio.play();
        audioBtn.textContent = "🔊";
        isPlaying = true;
    } else {
        audio.pause();
        audioBtn.textContent = "🔇";
        isPlaying = false;
    }
};

// AUTO PAUSE
document.addEventListener("visibilitychange", () => {
    if (document.hidden) audio.pause();
    else if (isPlaying) audio.play();
});

// LOGO CLICK
document.getElementById("logo").onclick = () => {
    gsap.to(window, { scrollTo: { y: 0, autoKill: false }, duration: 1 });
};

// SCROLL
function initScroll() {

    gsap.registerPlugin(ScrollTrigger);

    let sections = gsap.utils.toArray(".panel");
    let totalScroll = window.innerHeight * (sections.length - 1);

    gsap.to(sections, {
        yPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
            trigger: "#main",
            pin: true,
            scrub: 1,
            snap: 1 / (sections.length - 1),
			//snap: false,
            start: "top top",
            end: "+=" + totalScroll
        }
    });

    //sections.forEach((panel, i) => {
        //ScrollTrigger.create({
            //trigger: panel,
           // start: "top center",
           // onEnter: () => setActive(i),
           // onEnterBack: () => setActive(i)
        //});
   // });
   
   sections.forEach((panel, i) => {

    ScrollTrigger.create({
        trigger: panel,
        start: "top center",
        onEnter: () => {
            setActive(i);
            resetSwitcher(panel);
        },
        onEnterBack: () => {
            setActive(i);
            resetSwitcher(panel);
        }
    });

});

    //function setActive(index) {
        //document.querySelectorAll(".dot").forEach(d => d.classList.remove("active"));
        //document.querySelectorAll(".dot")[index].classList.add("active");
    //}
	
	function setActive(index) {
        document.querySelectorAll(".dot").forEach(d => d.classList.remove("active"));
        document.querySelectorAll("nav a").forEach(a => a.classList.remove("active"));

        document.querySelectorAll(".dot")[index].classList.add("active");
        document.querySelectorAll("nav a")[index].classList.add("active");
    }

    //document.querySelectorAll(".dot").forEach((dot, i) => {
        //dot.onclick = () => {
            //gsap.to(window, {
                //scrollTo: { y: i * window.innerHeight, autoKill: false },
                //duration: 1
            //});
        //};
    //});
	
	// NAV CLICK
    /*document.querySelectorAll("nav a").forEach((link, i) => {
        link.addEventListener("click", e => {
            e.preventDefault();
			
			let targetId = link.getAttribute("href");
			let target = document.querySelector(targetId);
			
			isScrolling = true; // 🔥 on bloque le reste
			
            gsap.to(window, {
                scrollTo: {
                    //y: i * window.innerHeight,
					y: target,
                    autoKill: false,
                },
                duration: 1,
				overwrite: true, // 🔥 très important
				onComplete: () => {
        setTimeout(() => {
            isScrolling = false;
        }, 500);
            }
            });
        });
    });*/
	
	document.querySelectorAll("nav a").forEach(link => {

    link.addEventListener("click", e => {

        e.preventDefault();

        let targetId = link.getAttribute("href");
        let target = document.querySelector(targetId);

        isScrolling = true;

        let targetY = target.offsetTop;

        gsap.to(window, {
            scrollTo: {
                y: targetY,
                autoKill: false
            },
            duration: 1,
            overwrite: true,
            ease: "power2.inOut",

            onComplete: () => {

                // 🔥 correction finale ultra importante
                window.scrollTo(0, targetY);

                setTimeout(() => {
                    isScrolling = false;
                }, 500);

            }
        });

    });

});

    document.getElementById("nav-indicator").style.opacity = "1";

    ScrollTrigger.refresh();
}

// SWITCHERS

const switchers = document.querySelectorAll(".content-switcher2");

switchers.forEach(switcher => {

    const contents = switcher.querySelectorAll(".content");
    const controls = switcher.querySelectorAll(".controls span");

    controls.forEach(btn => {

        btn.addEventListener("click", () => {

            let index = btn.dataset.index;

            contents.forEach(c => c.classList.remove("active"));
            controls.forEach(c => c.classList.remove("active"));

            contents[index].classList.add("active");
            controls[index].classList.add("active");

        });

    });

});

function resetSwitcher(panel) {

    let switcher = panel.querySelector(".content-switcher2");
    if (!switcher) return;

    let contents = switcher.querySelectorAll(".content");
    let controls = switcher.querySelectorAll(".controls span");

    contents.forEach(c => c.classList.remove("active"));
    controls.forEach(c => c.classList.remove("active"));

    contents[0].classList.add("active");
    controls[0].classList.add("active");
}

//const materials = document.querySelectorAll(".material");

//materials.forEach((mat, index) => {

    //mat.addEventListener("click", () => {

        //materials.forEach(m => m.classList.remove("active"));

        //mat.classList.add("active");

    //});

//});

const materials = document.querySelectorAll(".material2");

function updateMaterials(activeIndex) {

    materials.forEach((mat, i) => {

        mat.classList.remove("active", "left", "right");

        if (i === activeIndex) {
            mat.classList.add("active");
        }
        else if (i < activeIndex) {
            mat.classList.add("left");
        }
        else {
            mat.classList.add("right");
        }

    });

}

materials.forEach((mat, index) => {
    mat.addEventListener("click", () => {
        updateMaterials(index);
    });
});

const sections = document.querySelectorAll(".panel");
const navLinks = document.querySelectorAll("nav a");

/*window.addEventListener("scroll", (e) => {
	
	if (isScrolling) return; // 🔥 bloque pendant animation

    let scrollPos = window.scrollY + window.innerHeight / 2;

    sections.forEach((section, i) => {

        if (
            scrollPos >= section.offsetTop &&
            scrollPos < section.offsetTop + section.offsetHeight
        ) {
            navLinks.forEach(link => link.classList.remove("active"));
            navLinks[i].classList.add("active");
        }

    });

});*/

window.addEventListener("scroll", () => {

    if (isScrolling) return;

    let currentSection = null;
    let minDistance = Infinity;

    sections.forEach((section, i) => {

        let distance = Math.abs(section.offsetTop - window.scrollY -10);

        if (distance < minDistance) {
            minDistance = distance;
            currentSection = i;
        }

    });

    navLinks.forEach(link => link.classList.remove("active"));
    navLinks[currentSection].classList.add("active");

});

// init
updateMaterials(0);