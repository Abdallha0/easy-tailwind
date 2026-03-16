const contentContainer = document.getElementById("content-container");
const domain = location.origin
const contentSec = document.getElementById("content-sec");
contentContainer.innerHTML = `<h2 class="text-white text-center text-4xl p-20">Loading...</h2>`;
const defaultErrorEle = `<h2 class="text-white text-center text-4xl p-20">Something Went Error!</h2>`;

function copy(text) {
    navigator.clipboard.writeText(text)
    this.innerHTML = '<span class="skew-x-2">Copied</span>';
}

function card(i) {
    return `
    <div class="scroll-animate opacity-0 translate-y-10 duration-700 overflow-hidden z-50 rounded-lg bg-gradient-to-r from-[#0bcae4] via-[#b370ff] to-[#0bb9e4] shadow-[0_0_10px_5px_#ffffff41] w-[260px] h-[160px] p-[3px] cursor-pointer hover:translate-y-[-5px] transition-[all_.4s] hover:transition-[all_.4s] ">
                <div class="flex flex-col rounded-lg bg-[#1e1e1e] size-full">
                    <div class="p-4 pb-2 border-b-[1px] border-[#0bcbe43b]">
                        <p class="text-xl pb-2">${i.class}</p>
                        <p class="text-[#ffffff81]">${i.css}</p>
                    </div>
                    <div class="flex justify-between items-center gap-2 h-auto p-2">
                        <p class="capitalize text-wrap text-[13px] text-[#ffffff67] max-w-[calc(100%-4rem)]">
                            ${i.description}
                        </p>
                        <button onClick="copy('${i.class}')" title="copy class"
                            class="w-12 h-8 flex justify-center text-[11px] font-semibold items-center rounded-md bg-[#0bcae4] shadow-[0_0_5px_2px_#ffffff40] active:scale-90 active:shadow-none">
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

function renderData(status, data) {
    if (!status) return contentSec.innerHTML = defaultErrorEle;
    contentContainer.innerHTML = data.map((i) => {
        return card(i);
    }).join("");

    document.querySelectorAll(".scroll-animate").forEach(el => {
        observer.observe(el)
    });
}

async function fetchData() {
    try {
        const res = await fetch(domain + "/json/css-to-tailwind.json");
        const data = (await res.json()).slice((currentPage * 20) - 20, 20 * currentPage);
        return {
            ok: true,
            data,
        }
    } catch (err) {
        return {
            ok: false,
            message: "Something Went Error!"
        }
    }
}

async function SearchData(query) {
    try {
        const res = await fetch(domain + "/json/css-to-tailwind.json");
        const data = (await res.json()).find(i => i.css.startsWith(query));
        console.log(data)
        return {
            ok: true,
            data,
        }
    } catch (err) {
        return {
            ok: false,
            message: "Something Went Error!"
        }
    }
}

document.getElementById("search-form").onsubmit = (e) => {
    e.preventDefault();
    const value = e.target.search.value;
    if (!value) return;
    SearchData(value)
        .then((res) => renderData(res.ok, res.data))
        .catch((err) => contentSec.innerHTML = defaultErrorEle)
}

function init() {
    fetchData()
        .then((res) => renderData(res.ok, res.data))
        .catch((err) => contentSec.innerHTML = defaultErrorEle)
}

init()