const svg = document.querySelector(".visualizer-svg");

// 各バーの幅
const barWidths = Array.from({ length: 50 }, () =>
    Math.floor(Math.random() * 10) + 1
);

const barHeight = 50;
const minGap = 3;
const maxGap = 10;

// SVGのバーを生成
let x = 0;

barWidths.forEach((width, index) => {
    const rect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
    );

    rect.setAttribute("x", x);
    rect.setAttribute("width", width);
    rect.setAttribute("height", barHeight);

    rect.classList.add("bar");

    if (index === 1) {
        rect.classList.add("active");
    }

    svg.appendChild(rect);

    // 次のバーとの間隔をランダム生成
    const gap = Math.random() * (maxGap - minGap) + minGap;

    x += width + gap;
});

//activeを切り替える

const bars = svg.querySelectorAll(".bar");

bars.forEach((bar) => {
    bar.addEventListener("mouseover", () => {
        bars.forEach((b) => b.classList.remove("active"));
        bar.classList.add("active");
    });
});

// lenis

const lenis = new Lenis({
    autoRaf: true,
    duration: 1.4,
    smoothWheel: true,
    anchors: true,
});