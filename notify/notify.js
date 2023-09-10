function notify(text, type = "", delay = 4000) {
    // Example:
    //          notify("", "load");
    //          notify("Deleted", "succ");
    // Types:   warn. succ, load

    const $ = document.querySelectorAll.bind(document);

    let ico = "";
    let headerText = "Notify";

    switch (type) {
        case "warn":
            ico =
                '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="19" r="2"/><path d="M10 3h4v12h-4z"/></svg>';
            headerText = "Warning";
            break;
        case "succ":
            ico =
                '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
            headerText = "Success";
            break;
        case "load":
            ico =
                '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg>';
            headerText = "Nahrávání";
            text = "&nbsp;<img src='img/loading.gif'>";
            break;
        case "info":
            ico =
                '<svg viewBox="1 1 22 22"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/></svg>';
            headerText = "Info";
            break;
        case "":
            delay = 0;
            break;
    }

    let notify;

    if (!$("#z-notify").length) {
        let notifyHtml =
            "<div id=z-notify data-index=0 class='notify-" +
            type +
            "'><div class=notify-header><span class='notify-icons'>" +
            ico +
            "</span><span class=header-text>" +
            headerText +
            "</span></div><div class=notify-text>" +
            text +
            "</div></div>";
        $("html")[0].insertAdjacentHTML("beforeend", notifyHtml);
        notify = $("#z-notify")[0];

        notify.addEventListener("click", function () {
            this.classList.remove("notify-visible");
        });
    } else {
        notify = $("#z-notify")[0];
        notify.querySelector(".header-text").textContent = headerText;
        notify.querySelector(".notify-icons").innerHTML = ico;
        notify.querySelector(".notify-text").innerHTML = text;
        notify.dataset.index++;
    }

    let thisIndex = notify.dataset.index;

    notify.style.transition = "all 0s";
    notify.classList.remove("notify-visible");
    notify.clientWidth;
    notify.style.removeProperty("transition");

    notify.setAttribute("class", "notify-visible notify-" + type);

    if (type != "load" && delay != 0) {
        setTimeout(function () {
            if (notify.dataset.index == thisIndex)
                notify.classList.remove("notify-visible");
        }, delay);
    }
}
