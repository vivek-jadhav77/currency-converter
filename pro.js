const BASE_URL = "https://open.er-api.com/v6/latest/USD";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerHTML = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Update flag function
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// Button click event
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();

    let amount = document.querySelector(".amount input");
    let amtValue = amount.value;

    if (amtValue === "" || amtValue < 1) {
        amtValue = 1;
        amount.value = "1";
    }

    try {
        msg.innerText = "Fetching exchange rate...";

        let response = await fetch(BASE_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        let data = await response.json();

        let fromRate = data.rates[fromCurr.value];
        let toRate = data.rates[toCurr.value];

        // Universal conversion formula
        let finalAmount = (amtValue / fromRate) * toRate;

        msg.innerText = 
            `${amtValue} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;

    } catch (error) {
        msg.innerText = "Something went wrong. Please try again.";
        console.error("Error:", error);
    }
});