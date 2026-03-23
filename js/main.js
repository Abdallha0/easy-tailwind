const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-10")
        }
    })
});

const pagination = document.getElementById("pagination")
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
let currentPage = 1;

// Prev/Next handlers
prevBtn.addEventListener("click", () => {
    currentPage--;
    if (currentPage === 1) {
        pagination.classList.remove("justify-between")
        prevBtn.classList.add("hidden")
    }
    init(currentPage)
});

nextBtn.addEventListener("click", () => {
    currentPage++
    init(currentPage)
});

function checkCssRegex(value) {
    const cssPropertyRegex = /^[a-zA-Z-]+:\s*[^;]+;?$/;
    if (!cssPropertyRegex.test(value)) {
        return { ok: false, value: "Wrong Css Formating" }
    }

    let splitValue = value.split('');

    // check from space after colon
    let getColonIndex = splitValue.indexOf(':')
    if (splitValue[getColonIndex + 1] !== " ") {
        splitValue.splice(getColonIndex + 1, 0, " ");
        return { ok: true, value: splitValue.join("") }
    }

    return {
        ok: true,
        value,
    }
}

function planB(data, query) {
    let property = query.split(":")[0];
    let value = query.split(":")[1].trim();

    // filter css porperty & value to check if it real css property & value
    let isRealProperty = data.filter(i => typeof i === "object" && i.css.includes(property));
    let isRealValue = data.filter(i => typeof i === "object" && i.css.includes(value));

    // if propert and value are correct 
    if (isRealProperty.length && isRealValue.length) {
        let prop = isRealProperty[0].css.split("-")[0];
        let propValue = value.replace(";", "")
        return {
            css: query,
            class: `${isRealProperty[0].css.split(":")[0]}-[${propValue.replace(" ", "_")}]`, // make coustme class
            description: `set ${prop.split(":")[0]} to ${propValue}.`,
            category: prop.split("-")[0]
        }

    // if css value isn't found in data return all items that matches css porperty
    } else if (isRealProperty.length && !isRealValue.length) return sortingData(query, isRealProperty, /([a-zA-Z-]+)\s*\(/)
    // if css property isn't found in data return all items that matches css value
    else if (!isRealProperty.length && isRealValue.length) return sortingData(query, isRealValue, /^([a-zA-Z-]+)\s*:/)
    // if not return null
    else return null
}

function sortingData(query, array, regex) {
    const match = query.match(regex);
    const searchTerm = match ? match[1] : "";
    return array.sort((a, b) => {
        const aMatch = a.css.includes(searchTerm);
        const bMatch = b.css.includes(searchTerm);

        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
    });
}