function notify(text, type = "", delay = 4000){
    // Example:
    //          notify("", "load");
    //          notify("Deleted", "succ");
    // Types:   warn. succ, load

    const $ = document.querySelectorAll.bind(document);

    let ico = "";
    let headerText = "Notify";
    switch(type){
        case "warn":
            ico = '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="19" r="2"/><path d="M10 3h4v12h-4z"/></svg>';
            headerText = "Warning";
            break;
        case "succ":
            ico = '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
            headerText = "Success";
            break;
        case "load":
            ico = '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg>';
            headerText = "Loading";
            text = "&nbsp;<img src='img/loading.gif'>"
            break;
        case "":
            delay = 0;
            break;
    }

    let notify;
    
    if(!$("#z-notify").length){
        let notifyHtml = "<div id=z-notify data-index=0 class='notify-" + type + "'><div class=notify-header><span class='notify-icons'>" + ico + "</span><span class=header-text>" + headerText + "</span></div><div class=notify-text>" + text + "</div></div>";
        $("html")[0].insertAdjacentHTML('beforeend', notifyHtml);
        notify = $("#z-notify")[0];

        notify.addEventListener("click", function(){
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

    if(type != "load" && delay != 0){
        setTimeout(function(){
            if(notify.dataset.index == thisIndex)
                notify.classList.remove("notify-visible");
        }, delay);
    }
}