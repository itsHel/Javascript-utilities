class Modal{
    static show(text, type = "", callback = false, once = false){
        // Example:
        //          Modal.show("Warning text", "warn", () => { console.log("confirmed") });
        //          Modal.show("Good job!", "succ");

        // Types: warn, succ
        
        // If callback is set modal acts as confirm - on yes will execute callback
        // If once is true modal is shown only once per session (browser/tab closing)

        if(once && sessionStorage["modalshown"]){
            return;
        }

        let heading, ico;
        
        switch(type){
            case "warn":
                ico = '<svg viewBox="1 1 22 22"><path d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="19" r="2"/><path d="M10 3h4v12h-4z"/></svg>';
                heading = "<div class='modal-heading warn-modal'><span class='modal-icons'>" + ico + "</span>Warning</div>";
                break;
            case "succ":
                ico = '<svg viewBox="1 1 22 22"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
                heading = "<div class='modal-heading succ-modal'><span class='modal-icons'>" + ico + "</span>Success</div>";
                break;
            case "notify":
                ico = '<svg viewBox="1 1 22 22"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/></svg>';
                heading = "<div class='modal-heading notify-modal'><span class='modal-icons'>" + ico + "</span>" + type + "</div>";
                break;
            case "": default:
                heading = "";
                break;
        }

        if(!document.querySelector("#z-modal-full")){
            // Create new modal
            let html = Modal.modalHtml(heading, text);
            
            document.querySelector("body").insertAdjacentHTML("beforeend", html);
            let modal = document.querySelector("#z-modal-full");

            modal.addEventListener("click", function(e){
                if(e.target.id == "z-modal-full" || e.target.id == "modal-dismiss" || e.target.id == "modal-confirm"){
                    if(!callback || e.target.id != "modal-confirm"){
                        modal.classList.remove("z-modal-show");
                    }
                    
                    sessionStorage["modalshown"] = 1;
                }
            });

            modal.addEventListener("transitionend", function(e){
                if(e.propertyName == "top" && modal.classList.contains("z-modal-show")){
                    let input = modal.querySelector("input");
                    if(input){
                        input.focus();
                    } else {
                        modal.querySelector("button").focus();
                    }
                }
            });
        
            window.addEventListener("keydown", function(e){
                if(modal.classList.contains("z-modal-show")){
                    if(e.key == "Escape"){
                        e.preventDefault();
                        modal.classList.remove("z-modal-show");

                        sessionStorage["modalshown"] = 1;
                    }
                }
            });
        } else {
            // Modal already exists
            document.querySelector("#z-modal-full .modal-text").innerHTML = text;
            document.querySelector("#z-modal-full .modal-heading-wrapper").innerHTML = heading;
        }

        let modal = document.querySelector("#z-modal-full");
        let confirm = modal.querySelector("#modal-confirm");
        
        if(callback){
            confirm.outerHTML = confirm.outerHTML;
            confirm = modal.querySelector("#modal-confirm");

            confirm.closest(".modal-buttons").style.flexDirection = "row-reverse";
            confirm.style.visibility = "visible";
            
            confirm.addEventListener("click", function(){modal.classList.remove("z-modal-show");}, {once: true});
            confirm.addEventListener("click", callback, {once: true});
        } else {
            confirm.style.visibility = "hidden";
            confirm.closest(".modal-buttons").style.flexDirection = "row";
        }

        modal.clientWidth;
        modal.classList.add("z-modal-show");
    }

    static modalHtml(heading = "", text = ""){
        return `<div id=z-modal-full>
                    <div id=z-modal-wrapper>
                        <div class=modal-heading-wrapper>${heading}</div>
                        <div class=modal-text>${text}</div>
                        <div class=modal-buttons>
                            <button id=modal-confirm class="button">Ok</button>
                            <button id=modal-dismiss class="button">Close</button>
                        </div>
                        <button id=dummy style="position:absolute;pointer-events:none;opacity:0;" onfocus="document.querySelector('#z-modal-full button').focus();"></button>
                    </div>
                </div>`;
    }

    static preload(){
        if(!document.querySelector("#z-modal-full")){
            // Create new modal
            let html = Modal.modalHtml();
            
            document.querySelector("body").insertAdjacentHTML("beforeend", html);
            let modal = document.querySelector("#z-modal-full");
            
            modal.addEventListener("click", function(e){
                if(e.target.id == "z-modal-full" || e.target.id == "modal-dismiss" || e.target.id == "modal-confirm"){
                    modal.classList.remove("z-modal-show");
                    sessionStorage["modalshown"] = 1;
                }
            });
            
            window.addEventListener("keydown", function(e){
                if(e.key == "Escape"){
                    modal.classList.remove("z-modal-show");
                    sessionStorage["modalshown"] = 1;
                }
            });
        }
    }
}
