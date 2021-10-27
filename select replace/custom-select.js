'use strict';

// Replaces already existing select
function customSelect(selector, optionsPicked = {}){
    // Todo:    - add backgroud to scrolled element on keypress?
    //          - redo without jquery, without replacing base select, with clip-path ?

    // Set base select display:none; in css
    // Alternative chevron: ›   ˆ   ∟   ❯
    // Use "vertical-align: top;" to stop vertical center

    // Set defaults
    let options = {
      maxHeight: optionsPicked.maxHeight ?? 400,
      maxWidth: optionsPicked.maxWidth ?? 999,
      scrollOnKey: optionsPicked.scrollOnKey ?? false,
      // Callback function which stops select from being slided up if clicked on item (allows to click on multiple items without closing)
      // dontCloseCallback returning true = dont close
      dontCloseCallback: optionsPicked.dontCloseCallback ?? false,
      // Boolean, otherwise same as above
      dontClose: optionsPicked.dontClose ?? false
    }

    let originalSelectChangedByThis = false;
    
    $(selector).each(function(){
      
      let $selectOriginal = $(this);

      if($selectOriginal.next().hasClass("custom-select-wrapper")){
        $selectOriginal.next(".custom-select-wrapper").remove();
      }

      let headerSelect;
            
      let selectFull = "<div class=\"custom-select-wrapper " + $selectOriginal.attr("class") + "\">";
      let items = "<div class=\"select-items-wrapper\">";

      $selectOriginal.find("option").each(function(){
        let selectClass = "";
        if($(this).attr("selected") == "selected" || $(this).prop("selected") == true){
          headerSelect = "<div class=\"custom-select-header\"><span>" + $(this).text() + "</span><span class=\"chevron\"></span></div>";
          selectClass = "custom-selected";
        }
        items += "<div title=\"" + $(this).text() + "\" class=\"custom-select-item " + selectClass + "\">" + $(this).text() + "</div>";
      });
      if(!headerSelect){
        let text = $selectOriginal.find("option").eq(0).text();
        headerSelect = "<div class=\"custom-select-header\"><span>" + text + "</span><span class=\"chevron\"></span></div>";
        items = items.replace("custom-select-item ", "custom-select-item custom-selected");
      }

      selectFull += headerSelect + items + "</div></div>";
      $selectOriginal.after(selectFull);

      let $selectWrapper = $selectOriginal.next().find(".select-items-wrapper");
      let $selectHeader = $selectOriginal.next().find(".custom-select-header");
      let height = $selectWrapper.css("height");
      // let width = (parseFloat($selectWrapper.width()) + 1 - 2*parseFloat($selectWrapper.find("div:first").css("padding-left"))).toString() + "px";

      // $selectOriginal.next().find("span:first-of-type").css({minWidth: width});
      $selectWrapper.css({maxHeight: "0px", minWidth: "100%", maxWidth: options.maxWidth});
      $selectWrapper.parent().css({maxWidth: options.maxWidth});
      $selectHeader.parent().css({maxWidth: options.maxWidth});

      $selectWrapper.find(".custom-select-item").on("click", function(){
        let index = $(this).index();
        if(options.dontClose || (options.dontCloseCallback && options.dontCloseCallback())){
          if($(this).hasClass("custom-selected-multi")){
            $(this).removeClass("custom-selected-multi");
          } else {
            $(this).addClass("custom-selected-multi");
          }
        } else {
          $(this).addClass("custom-selected").siblings().removeClass("custom-selected");
          // Set original select
          originalSelectChangedByThis = true;
          $selectOriginal.next().find("span:first-of-type").text($(this).text());
          $selectOriginal.find("option").eq(index).prop("selected", true);
          $selectOriginal.change();
        }
      });

      $selectHeader.on("click", function(){
        if(!$selectWrapper.html())
          return;

        if(options.dontClose || (options.dontCloseCallback && options.dontCloseCallback())){
          $selectWrapper.find(".custom-selected").removeClass("custom-selected");
        } else {
          $selectWrapper.find(".custom-selected-multi").removeClass("custom-selected-multi");
        }
        // Header
        if($selectWrapper.css("max-height") == "0px"){
          if(height == "0px"){
            $selectWrapper.css({maxHeight: ""});
            height = $selectWrapper.css("height");
          }
          if(height.replace("px", "") > options.maxHeight){
            height = options.maxHeight + "px";
            $selectWrapper.css({overflow: "auto"});
          }

          $selectWrapper.css({maxHeight: height});
          $selectWrapper.addClass("show-select");
          $selectOriginal.next().find(".chevron").addClass("rotate");

          // Open to top if limited space
          if($selectHeader[0].getBoundingClientRect().y + $selectHeader.outerHeight() + parseInt(height) > window.innerHeight){
            $selectWrapper.css({bottom: "100%", top: "auto"});
          } else {
            $selectWrapper.css({bottom: "auto", top: "100%"});
          }
        } else {
          $selectWrapper.css({maxHeight: "0px"});
          $selectWrapper.removeClass("show-select");
          $selectOriginal.next().find(".chevron").removeClass("rotate");
        }
      });

      $selectOriginal.css({display: "none"});

      $(window).on("click", function(e){
        if(options.dontClose || (options.dontCloseCallback && options.dontCloseCallback() && e.target.classList.contains("custom-select-item")))
          return;

        if((!e.target || !e.target.parentNode) || (e.target.className != "custom-select-header" && e.target.parentNode.className != "custom-select-header")){
          $selectWrapper.css({maxHeight: "0px"});
          $selectWrapper.removeClass("show-select");
          $selectOriginal.next().find(".chevron").removeClass("rotate");
        }
      });

      // triggers same functions as LINE 60
      $selectOriginal.on("change", function(){
        if(originalSelectChangedByThis){
          let selected = $(this).children(':selected').text();
          if($selectWrapper.find(".custom-selected").text() != selected){
            $selectWrapper.children().each(function(){
              if($(this).text() == selected){
                $selectOriginal.next().find("span:first-of-type").text(selected);
                $(this).addClass("custom-selected").siblings().removeClass("custom-selected");
              }
            });
          }
        }
        originalSelectChangedByThis = false;
      });
      
      // Scrolling on keypress
      if(options.scrollOnKey){
        let $customSelect = $selectOriginal.next(".custom-select-wrapper");
        // debugger;
        $customSelect.attr("tabindex", "1").on("keydown", function(e){
            if(e.keyCode == 27){
                // Close on Esc
                $customSelect.find(".select-items-wrapper").css({maxHeight: "0px"});
                $customSelect.find(".select-items-wrapper").removeClass("show-select");
                $customSelect.find(".custom-select-header").find(".chevron").removeClass("rotate");
            }

            let scrolled = false;
            $customSelect.find(".select-items-wrapper div:not(:first)").each(function(){
                if(!scrolled && $(this).text()[0].toLowerCase() == e.key){
                    scrolled = true;
                    let top = $(this).position().top + $(this).parent().scrollTop();
                    $customSelect.find(".select-items-wrapper").animate({scrollTop: top}, 300);
                }
            });
        });
      }
    });
}