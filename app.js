

// ---------- 1. Grab the elements ----------
const screen = document.querySelector(".screen");
const toolButtons = document.querySelectorAll("[data-model]");
const resetBtn = document.getElementById("reset");
const form = document.getElementById("resize-form");
const sizeInput = document.getElementById("size");

// ---------- 2. State ----------
let mode = "black";   // active tool
let size = 64;        // rows (columns = rows * 1.5 so squares stay square)

// ---------- 3. Build the grid ----------
function buildGrid(rows) {
    const cols = Math.round(rows * 1.5);
    screen.innerHTML = "";

    const fragment = document.createDocumentFragment();
    for (let r = 0; r < rows; r++) {
        const row = document.createElement("div");
        row.className = "row";
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.level = 0;          // used for gray shading
            row.appendChild(cell);
        }
        fragment.appendChild(row);
    }
    screen.appendChild(fragment);
}

// ---------- 4. Paint one cell ----------
function paint(cell) {
    if (mode === "black") {
        cell.style.background = "#000";
        cell.dataset.level = 10;
    } else if (mode === "gray") {
        const level = Math.min(Number(cell.dataset.level) + 1, 10);
        const shade = Math.round(230 * (1 - level / 10));
        cell.style.background = `rgb(${shade}, ${shade}, ${shade})`;
        cell.dataset.level = level;
    } else if (mode === "rainbow") {
        const hue = Math.floor(Math.random() * 360);
        cell.style.background = `hsl(${hue}, 90%, 55%)`;
        cell.dataset.level = 0;
    } else if (mode === "erase") {
        cell.style.background = "";
        cell.dataset.level = 0;
    }
}

// ---------- 5. Draw on hover / finger drag ----------
function handleDraw(event) {
    const target = document.elementFromPoint(event.clientX, event.clientY);
    if (target && target.classList.contains("cell")) {
        paint(target);
    }
}
screen.addEventListener("pointermove", handleDraw);
screen.addEventListener("pointerdown", handleDraw);

// ---------- 6. Tool buttons ----------
toolButtons.forEach(button => {
    button.addEventListener("click", () => {
        let chosen = button.dataset.model.toLowerCase();
        mode = chosen === "grey" ? "gray" : chosen;   // accepts "grey" or "gray"

        toolButtons.forEach(b => b.classList.remove("active"));
        button.classList.add("active");
    });
});

// ---------- 7. Reset ----------
resetBtn.addEventListener("click", () => buildGrid(size));

// ---------- 8. Resize ----------
form.addEventListener("submit", event => {
    event.preventDefault();
    let value = parseInt(sizeInput.value, 10);
    if (isNaN(value)) value = 16;
    value = Math.max(1, Math.min(100, value));
    sizeInput.value = value;
    size = value;
    buildGrid(size);
});

// ---------- 9. Start ----------
sizeInput.value = size;
buildGrid(size);
toolButtons[0].classList.add("active");   // highlight Black at the start

