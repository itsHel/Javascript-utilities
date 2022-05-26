// TODO
//  - thumbnails

function gallery(baseImages, options = {}){
    options.chevronsOnSide = options.chevronsOnSide ?? false;
    options.stopAnimation = options.stopAnimation ?? false;
    options.showChevron = options.showChevron ?? true;
    options.showHeader = options.showHeader ?? true;
    options.showName = options.showName ?? false;
    options.slide = (options.slide ?? false) && !options.stopAnimation;             // Ignores slides if stopAnimation

    this.index = 0;
    this.slideIndex = 0;

    this.modal = null;
    this.galleryImages = null;
    this.indexEl = null;
    this.dummyImg = null;
    this.chevrons = {left: null, right: null};

    let blockCloseByClickInterval = null;
    let closeByClickAllowed = true;

    this.createHtml = function(){
        let html = `<div class=gallery-modal-full tabindex=0><div class=gallery-modal-wrapper>`
        
        if(options.showHeader){
            html += `<div class=gallery-modal-head><span class=gallery-index>1</span><span>/</span><span class=length>${baseImages.length}</span></div>`;
        }

        html += `<div class=gallery-modal-images>
                    <div class="gallery-modal-images-inside">
                        <img style="visibility:hidden; pointer-events:none" class="dummy" src='${baseImages[0].src}'>`;

        baseImages.forEach((img, index) => {
            html += "<img class=\"gallery-img" + ((options.slide) ? " slide" : "") + "\" data-index='" + index + "' src='" + img.src + "'>";
        });

        html += `</div></div><div class=gallery-modal-footer>`

        if(options.showName){
            html += `<div class=gallery-img-name></div>`;
        }

        if(options.showChevron){
            html += `<div class="gallery-chevron-wrapper ${(options.chevronsOnSide) ? " on-side" : ""}"><svg class=gallery-chevron viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none" opacity=".87"/><path d="M17.51 3.87L15.73 2.1 5.84 12l9.9 9.9 1.77-1.77L9.38 12l8.13-8.13z"/></svg>
                        <svg class=gallery-chevron viewBox="0 0 24 24"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><polygon points="6.23,20.23 8,22 18,12 8,2 6.23,3.77 14.46,12"/></g></svg></div>`;
        }

        html += `</div></div></div>`;

        document.querySelector("body").insertAdjacentHTML("beforeend", html);

        this.modal = document.querySelector(".gallery-modal-full:last-of-type");
        this.galleryImages = this.modal.getElementsByClassName("gallery-img");              // getElementsByClassName updates dynamically
        this.indexEl = this.modal.querySelector(".gallery-index");
        this.dummyImg = this.modal.querySelector(".dummy");
        this.chevrons.left = this.modal.querySelector(".gallery-chevron:first-of-type");
        this.chevrons.right = this.modal.querySelector(".gallery-chevron:last-of-type");

        this.setNavSizes();

        if(options.slide){
            // On load of last non-duplicate img
            this.galleryImages[galleryImages.length - 1].addEventListener("load", () => {
                let leftTotal = 0;
                
                for(let i = 0; i < galleryImages.length; i++){

                    if(i != 0){
                        leftTotal += galleryImages[i - 1].offsetWidth;
                    }

                    galleryImages[i].style.left = leftTotal + "px";
                }
            });
        }

        if(options.stopAnimation){
            for(let i = 0; i < this.galleryImages.length; i++){
                this.galleryImages[i].style.transition = "none";
            }
        }
    }

    this.moveImg = function(prevIndex, preventAnimation = false){
        if(options.slide){
            var wrapper = this.galleryImages[0].parentNode;

            if(this.index > prevIndex && !preventAnimation){
                ++this.slideIndex;
                if(this.slideIndex == this.galleryImages.length){
                    this.slideIndex = this.galleryImages.length - 1;
                    this.galleryImages[this.galleryImages.length - 1].after(this.galleryImages[0]);
                    this.galleryImages[this.galleryImages.length - 1].style.left = (parseInt(this.galleryImages[this.galleryImages.length - 2].style.left) + this.galleryImages[this.galleryImages.length - 1].offsetWidth) + "px";
                }
            }

            if(this.index < prevIndex && !preventAnimation){
                --this.slideIndex;
                if(this.slideIndex < 0){
                    this.slideIndex = 0;
                    this.galleryImages[0].before(this.galleryImages[this.galleryImages.length - 1]);
                    this.galleryImages[0].style.left = (parseInt(this.galleryImages[1].style.left) - this.galleryImages[0].offsetWidth) + "px";
                }
            }

            if(preventAnimation){
                wrapper.style.transition = "none";
            }
            
            let gotoIndex;
            if(preventAnimation){
                gotoIndex = Array.from(wrapper.children).indexOf(wrapper.querySelector("[data-index=\"" + this.index + "\"]")) - 1;
                slideIndex = gotoIndex;
            } else {
                gotoIndex = slideIndex;
            }
            
            // Real slide moving
            wrapper.style.left = (parseInt(this.galleryImages[gotoIndex].style.left) * -1) + "px";

            if(preventAnimation && !options.stopAnimation){
                // setTimeout to prevent element from ignoring transition "none"
                setTimeout(() => {
                    wrapper.style.transition = "";
                }, 0);
            }
        }

        if(this.index == this.galleryImages.length){
            this.index = 0;
        }
        
        if(this.index < 0){
            this.index = this.galleryImages.length - 1;
        }

        if(!options.slide){
            // Opacity transition
            if(preventAnimation){
                this.galleryImages[prevIndex].style.transition = "none";
                this.galleryImages[this.index].style.transition = "none";
            }

            this.galleryImages[prevIndex].style.opacity = 0;
            this.galleryImages[this.index].style.opacity = 1;
        }

        if(options.showChevron && !preventAnimation){
            let animatedChevron;

            if((prevIndex < this.index && (prevIndex != 0 || index == 1)) || (prevIndex == this.galleryImages.length - 1 && this.index == 0)){
                animatedChevron = this.chevrons.right;
            } else {
                animatedChevron = this.chevrons.left;
            }

            animatedChevron.style.animationName = "none";
            animatedChevron.clientWidth;
            animatedChevron.style.animationName = "chevronClick";
        }

        if(options.showHeader){
            this.indexEl.textContent = this.index + 1;
        }

        if(preventAnimation && !options.stopAnimation){
            // setTimeout to prevent element from ignoring transition "none"
            setTimeout(() => {
                this.galleryImages[prevIndex].style.transition = "";
                this.galleryImages[this.index].style.transition = "";
            }, 0);
        }

        // Resizes wrapper in case of different sized images
        if(this.dummyImg.naturalHeight != baseImages[this.index].naturalHeight || this.dummyImg.naturalWidth != baseImages[this.index].naturalWidth){
            this.dummyImg.src = baseImages[this.index].src;
        }

        if(options.showName){
            this.modal.querySelector(".gallery-img-name").textContent = baseImages[this.index].src.replaceAll(/.+\/|\..+/g, "");
        }

        // To prevent accidental close when img size changes
        clearInterval(blockCloseByClickInterval);
        closeByClickAllowed = false;

        blockCloseByClickInterval = setInterval(() => {
            closeByClickAllowed = true;
        }, 500);
    }

    this.setNavSizes = function(){
        // Changing css properties automatically scales img
        // header height                = 32px
        // chervons height              = 38px
        // name height                  = 22px
        // chevron + name height        = 74px

        if(options.showHeader){
            modal.style.setProperty('--header-height', "32px");
        }

        if(options.showChevron && options.showName && options.chevronsOnSide){
            modal.style.setProperty('--footer-height', "22px");
            modal.style.setProperty('--chevrons-side-width', "74px");
            return;
        }

        if(options.showChevron && options.chevronsOnSide){
            modal.style.setProperty('--footer-height', "0px");
            modal.style.setProperty('--chevrons-side-width', "74px");
            return;
        }

        if(!options.showChevron && !options.showName){
            modal.style.setProperty('--footer-height', "0px");
            return;
        }

        if(options.showChevron && options.showName){
            modal.style.setProperty('--footer-height', "58px");
            return;
        }

        if(options.showChevron && !options.showName){
            modal.style.setProperty('--footer-height', "38px");
            return;
        }

        if(!options.showChevron && options.showName){
            modal.style.setProperty('--footer-height', "38px");
            return;
        }
    }

    this.setListeners = function(){
        this.modal.addEventListener("keydown", (e) => {
            if(e.key == "Escape"){
                modal.classList.remove("gallery-show");
                modal.blur();
                return;
            }

            if(e.key == "ArrowLeft" || e.key == "ArrowRight"){
                let prevIndex = this.index;

                if(e.key == "ArrowLeft"){
                    --this.index;
                } else {
                    ++this.index;
                }

                this.moveImg(prevIndex);
            }
        });

        baseImages.forEach((img, i) => {
            img.addEventListener("click", () => {
                let prevIndex = this.index;

                this.index = i;
                this.slideIndex = this.index;

                this.moveImg(prevIndex, true);
                modal.classList.add("gallery-show");
                modal.focus();
            });
        });

        this.modal.querySelectorAll(".gallery-chevron").forEach((chevron, i) => {
            chevron.addEventListener("click", () => {
                let prevIndex = this.index;

                if(i == 0){
                    --this.index;
                } else {
                    ++this.index;
                }

                this.moveImg(prevIndex);
            });
        });

        this.modal.addEventListener("click", (e) => {
            // Close modal on background click
            if(closeByClickAllowed && (e.target.classList.contains("gallery-modal-full") || e.target.classList.contains("gallery-modal-dismiss"))){
                modal.classList.remove("gallery-show");
                modal.blur();
                return;
            }

            if(e.target.nodeName == "IMG"){
                let prevIndex = this.index;

                // Check if click was on left or right side
                if(e.offsetX < e.target.offsetWidth / 2){
                    --this.index;
                } else {
                    ++this.index;
                }

                this.moveImg(prevIndex);
            }
        });
    }

    this.createHtml();
    this.setListeners();
}
