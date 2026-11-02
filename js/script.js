const svg = document.querySelector(".visualizer-svg");

// 各バーの幅
const barWidths = [
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
    14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
];

const barHeight = 170;
const gap = 15;

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