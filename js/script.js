const contentContainer = document.getElementById("content-container");
const domain = location.origin
const contentSec = document.getElementById("content-sec");
contentContainer.innerHTML = `<h2 class="text-white text-center text-4xl p-20">Loading...</h2>`;

const errorMsg = (msg) => `<h2 class="capitalize text-white text-center text-4xl p-20">${msg}</h2>`

function copy(text) {
    navigator.clipboard.writeText(text);
    document.getElementById(text).innerHTML = '<span class="-rotate-12 transition-all duration-300">Copied</span>';
    setTimeout(() => {
        document.getElementById(text).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                                class="bi bi-copy" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                    d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                            </svg>`
    }, 3000);
}

function card(i) {
    return `
    <div class="scroll-animate opacity-0 translate-y-10 duration-700 overflow-hidden z-50 rounded-lg bg-gradient-to-r from-[#0bcae4] via-[#b370ff] to-[#0bb9e4] shadow-[0_0_10px_5px_#b370ff41] w-[280px] h-[180px] p-[3px] cursor-pointer hover:translate-y-[-5px] transition-[all_.4s] hover:transition-[all_.4s] ">
                <div class="flex flex-col rounded-lg bg-[#1e1e1e] size-full">
                    <div class="p-4 pb-2 border-b-[1px] border-[#0bcbe43b] h-[60%]">
                        <p class="text-xl pb-2">${i.class}</p>
                        <p class="text-[#ffffff81] text-nowrap">${i.css}</p>
                    </div>
                    <div class="flex justify-between gap-2 p-2 size-full h-[40%]">
                        <p class="capitalize text-wrap self-start text-[13px] text-[#ffffff67] max-w-[calc(100%-4rem)]">
                            ${i.description}
                        </p>
                        <button id="${i.class}" onClick="copy('${i.class}')" title="copy"
                            class="w-12 h-8 flex justify-center self-end text-[11px] font-semibold items-center rounded-md bg-[#0bcae4] shadow-[0_0_5px_2px_#ffffff40] active:scale-90 active:shadow-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                                class="bi bi-copy" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                    d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>`
}

function renderCards(data) {

    if (!data.ok || data.message) {
        contentSec.innerHTML = errorMsg(data.message)
        return;
    };

    contentContainer.innerHTML = data.payload.map((i) => {
        return card(i);
    }).join("");

    document.querySelectorAll(".scroll-animate").forEach(el => {
        observer.observe(el)
    });
}

async function fetchData() {
    try {
        const res = await fetch(domain + "/easy-tailwind/json/css-to-tailwind.json");
        const data = await res.json() || [];

        if (data.length < 1) {
            return {
                ok: false,
                payload: [],
                message: "No data found"
            }
        }

        return {
            ok: true,
            payload: data,
            message: null,
        }
    } catch (err) {
        return {
            ok: false,
            payload: [],
            message: "Something Went Error!"
        }
    }
}

async function SearchData(query) {
    contentContainer.innerHTML = `<h2 class="text-white text-center text-4xl p-20">Loading...</h2>`;
    const res = await fetchData();
    if (!res.ok || res.message) return renderCards(res);

    const data = Array(res.payload.find(i => i.css.startsWith(query)));
    if (data.length < 1) {
        return {
            ok: false,
            payload: [],
            message: "No property matches with your query"
        }
    }

    return {
        ok: true,
        payload: data,
        message: null,
    }

}

document.getElementById("search-form").onsubmit = function (e) {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (!query) {
        init();
        return;
    };
    const { ok, value } = checkCssRegex(query);
    if (!ok) {
        e.target.search.placeholder = value;
        this.reset();
        init();
        return;
    };
    SearchData(value)
        .then((res) => renderCards(res))
        .catch((err) => renderCards({ message: "something went wrong", ok: false, payload: [] }))
}

function init() {
    fetchData()
        .then(({ ok, payload, message }) => {
            const data = {
                ok,
                payload: payload.slice((currentPage * 20) - 20, 20 * currentPage),
                message
            };
            renderCards(data)
        })
        .catch((err) => {
            console.error(err)
            renderCards({ message: "something went wrong", ok: false, payload: [] })
        })
}

init()
