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
            case "":
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
                    modal.classList.remove("z-modal-show");
                    sessionStorage["modalshown"] = 1;
                }
            });
        
            window.addEventListener("keydown", function(e){
                if(modal.classList.contains("z-modal-show")){
                    if(e.key == "Escape"){
                        e.preventDefault();
                        modal.classList.remove("z-modal-show");
                        sessionStorage["modalshown"] = 1;
                    }
                    if(e.key == "Enter"){
                        e.preventDefault();
                        modal.querySelector("#modal-confirm").click();
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
            
            confirm.addEventListener("click", callback, {once: true});
        } else {
            confirm.style.visibility = "hidden";
            confirm.closest(".modal-buttons").style.flexDirection = "row";
        }

        modal.clientWidth;
        modal.classList.add(("z-modal-show"));
    }

    static modalHtml(heading = "", text = ""){
        return `<div id=z-modal-full>
                    <div id=z-modal-wrapper>
                        <div class=modal-heading-wrapper>${heading}</div>
                        <div class=modal-text>${text}</div>
                        <div class=modal-buttons>
                            <button id=modal-confirm class="button">Ok</button>
                            <button id=modal-dismiss class="button">Zavřít</button>
                        </div>
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
