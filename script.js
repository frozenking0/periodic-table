let elements = [];

const tableContainer = document.getElementById("periodic-table");
const infoPanel = document.getElementById("info-panel");

const resetBtn = document.getElementById("reset-btn");

async function loadPeriodicTableData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json');
        const data = await response.json();

        elements = data.elements.map(el => ({
            number: el.number,
            symbol: el.symbol,
            name: el.name,
            row: el.ypos,
            column: el.xpos,
            category: el.category.toLowerCase().replace(/ /g, '-')
        }));

        buildTable();
    } catch (error) {
        console.error("Oops! Something went wrong loading the data:", error);
    }
}




//console.log(elements);



resetBtn.addEventListener("click", (event) => {
    event.stopPropagation();

    infoPanel.style.borderStyle = "dashed";
    infoPanel.style.borderColor = "#bbb";
    infoPanel.innerHTML = `
    <p class="placeholder-text">Click on any element to view its details.</p>
    <button id="reset-btn">Reset Details</button>
    `;
    document.getElementById("reset-btn").addEventListener("click", () => resetBtn.click());
});

function buildTable() {
elements.forEach(element => {
    const elementDiv = document.createElement("div");
    elementDiv.classList.add("element");
    elementDiv.classList.add(element.category);

    elementDiv.id = element.name;

    elementDiv.style.gridRow = element.row;
    elementDiv.style.gridColumn = element.column;

    elementDiv.innerHTML = `<span>${element.number}</span><strong>${element.symbol}</strong>`;

    elementDiv.addEventListener("click", () => {
        
        infoPanel.style.borderStyle = "solid";
        infoPanel.style.borderColor = "#333";

        infoPanel.innerHTML = `
            <h2>${element.name} (${element.symbol})</h2>
            <p><strong>Atomic Number:</strong> ${element.number} | <strong>Category:</strong> ${element.category.replace('-', ' ')}</p>
            `; 

            resetBtn.style.display = "block";
            infoPanel.appendChild(resetBtn);
});

    tableContainer.appendChild(elementDiv);
});
}


const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("input", (event) => {

    const query = event.target.value.toLowerCase();

    const allVisualElements = document.querySelectorAll(".element");

    allVisualElements.forEach(card => {
        const elementData = elements.find(el => el.name === card.id);
        
    if (elementData) {
        const nameMatches = elementData.name.toLowerCase().includes(query);
        const symbolMatches = elementData.symbol.toLowerCase().includes(query);

        if (nameMatches || symbolMatches) {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
            card.style.pointerEvents = "auto";
        } else {
            card.style.opacity = "0.15";
            card.style.transform = "scale(0.9)";
            card.style.pointerEvents = "none";
        }
    }
    })
})

loadPeriodicTableData();
