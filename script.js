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
    document.querySelectorAll("nav a").forEach((link, i) => {
        link.addEventListener("click", e => {
            e.preventDefault();
            gsap.to(window, {
                scrollTo: {
                    //y: i * window.innerHeight,
					y: section,
                    autoKill: false,
                },
                duration: 1,
            });
        });
    });

    document.getElementById("nav-indicator").style.opacity = "1";

    ScrollTrigger.refresh();
}

// SWITCHERS

const switchers = document.querySelectorAll(".content-switcher");

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

    let switcher = panel.querySelector(".content-switcher");
    if (!switcher) return;

    let contents = switcher.querySelectorAll(".content");
    let controls = switcher.querySelectorAll(".controls span");

    contents.forEach(c => c.classList.remove("active"));
    controls.forEach(c => c.classList.remove("active"));

    contents[0].classList.add("active");
    controls[0].classList.add("active");
}