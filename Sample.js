// jsx
const view = <p class="message">virtual dom</p>;

// トランスパイル後...
const view = h("p", { class: "message" }, "virtual dom");
