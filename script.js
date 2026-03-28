const loader = document.getElementById("loader");
const audio = document.getElementById("bg-audio");
const audioBtn = document.getElementById("sound-toggle");
const petalsContainer = document.getElementById("petals");
const enterSound = document.getElementById("enter-sound");

let isPlaying = false;

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
    audioBtn.textContent = "SON ON";
});

// AUDIO BUTTON
audioBtn.onclick = () => {
    if (audio.paused) {
        audio.play();
        audioBtn.textContent = "SON ON";
        isPlaying = true;
    } else {
        audio.pause();
        audioBtn.textContent = "SON OFF";
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
            start: "top top",
            end: "+=" + totalScroll
        }
    });

    sections.forEach((panel, i) => {
        ScrollTrigger.create({
            trigger: panel,
            start: "top center",
            onEnter: () => setActive(i),
            onEnterBack: () => setActive(i)
        });
    });

    function setActive(index) {
        document.querySelectorAll(".dot").forEach(d => d.classList.remove("active"));
        document.querySelectorAll(".dot")[index].classList.add("active");
    }

    document.querySelectorAll(".dot").forEach((dot, i) => {
        dot.onclick = () => {
            gsap.to(window, {
                scrollTo: { y: i * window.innerHeight, autoKill: false },
                duration: 1
            });
        };
    });

    document.getElementById("nav-indicator").style.opacity = "1";

    ScrollTrigger.refresh();
}