    function Table(data, nav, parentDiv, createRows, options = {}){
        // TH data-column = name of sort property for row       Example: <th data-column='date'...      = Sorted by row.date, Should be in ''   Leave empty to ignore for sort
        // TH must have <span class="table-chevron"></span>     - replaced by chevron
        // TD with class .search-ignore will be ignored on search
        // options.filter = { filters: [], nicknames: [], id: ""}
        // filter = keep if(parseInt(row.property))
        // saveFilters      - saves active filters to localStorage
    
        const chevron = '<svg viewBox="2 2 20 20"><path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg>';
    
        options.id = options.id ?? getUniqueId();
        options.tableListeners = options.tableListeners ?? false;       // Callback, receives table element as parameter
        options.filter = options.filter ?? false;
        options.search = options.search ?? false;
        options.saveFilters = options.saveFilters ?? true;                       // false = active filters are saved to localStorage 
        options.orderCaseSensitive = options.orderCaseSensitive ?? false;
    
        var self = this;
        var tableEl;
        var firstRender = true;
        var activeFilters = [];
        var order = {
            reverse: false,
            column: ""
        };
    
        // Default order is first row
        try { order.column = nav.match(/<th\sdata\-column='(.*?)'/)[1] } catch(e){}

        if(options.saveFilters){
            activeFilters = JSON.parse(localStorage["filters-" + options.id] ?? "[]");
    
            // In case of old localStorage record and empty filter - add it
            if(activeFilters?.length && !options.filter?.filters?.length){
                options.filter = { filters: [...activeFilters] };
            }
        }
    
        this.render = function(renderData){
            data = renderData;

            if(activeFilters.length){
                renderData = renderData.filter(row => {
                    let keep = true;
                    for(let i = 0; i < activeFilters.length; i++){
                        if(!parseInt(row[activeFilters[i]])){
                            keep = false;
                            break;
                        }
                    }
    
                    return keep;
                });
            }
    
            if(order.column){
                renderData.sort((a, b) => {
                    if(isNaN(a[order.column])){
                        // String sorting
                        if(options.orderCaseSensitive){
                            if(!order.reverse){
                                if(a[order.column] > b[order.column]) return 1;
                                if(a[order.column] < b[order.column]) return -1;
                                return 0;
                            } else {
                                if(a[order.column] < b[order.column]) return 1;
                                if(a[order.column] > b[order.column]) return -1;
                                return 0;
                            }
                        } else {
                            if(!order.reverse){
                                if(a[order.column].toLowerCase() > b[order.column].toLowerCase()) return 1;
                                if(a[order.column].toLowerCase() < b[order.column].toLowerCase()) return -1;
                                return 0;
                            } else {
                                if(a[order.column].toLowerCase() < b[order.column].toLowerCase()) return 1;
                                if(a[order.column].toLowerCase() > b[order.column].toLowerCase()) return -1;
                                return 0;
                            }
                        }
                    } else {
                        // Number sorting
                        if(!order.reverse)
                            return b[order.column] - a[order.column]; 
                        else
                            return a[order.column] - b[order.column];
                    }
                });
            }
            
            let tableBody = createRows(renderData);
    
            if(firstRender){
                nav = nav.replaceAll('<ico>', '<span class="table-chevron">' + chevron + '</span>');
                parentDiv.insertAdjacentHTML("beforeend", "<table id='" + options.id + "' class='z-table'>" + "<thead><tr>" + nav + "</tr></thead><tbody>" + tableBody + "<tbody>");
                tableEl = parentDiv.querySelector("#" + options.id);
            } else {
                parentDiv.querySelector("#" + options.id + " tbody").innerHTML = tableBody;
            }
    
            if(options.tableListeners)
                options.tableListeners(tableEl);
    
            // Do only once
            if(firstRender){
                tableEl.querySelector("thead th").classList.add("th-active");
                order.column = tableEl.querySelector("thead th").dataset.column;
    
                self.addNavListeners();
    
                if(options.filter){
                    self.addFilters();
                }
    
                if(options.search){
                    self.addSearch();
                }
    
                firstRender = false;
            }
        }
    
        this.addNavListeners = function(){
            tableEl.querySelectorAll("th").forEach(el => {
                if(!el.dataset.column){
                    el.style.pointerEvents = "none";
                    return;
                }
    
                el.addEventListener("click", function(){
                    // Start on reverse order for dates
                    if(this.classList.contains("datetype")){
                        this.classList.add("th-active");
                    }

                    if(this.classList.contains("th-active")){
                        if(this.classList.contains("th-reverse")){
                            order.reverse = false;
                            this.classList.remove("th-reverse");
                        } else {
                            order.reverse = true;
                            this.classList.add("th-reverse");
                        }
                    } else {
                        order.reverse = false;
                    }
                    order.column = this.dataset.column;
                    
                    this.parentNode.querySelectorAll("th").forEach(el => {
                        if(el != this){
                            el.classList.remove("th-active", "th-reverse");
                        }
                    });
    
                    this.classList.add("th-active");
    
                    self.render(data);
                });
            });
        }
    
        this.addFilters = function(){
            let filtersHtml = "<div id='filters-" + options.id + "' class=table-filters>";
    
            options.filter.filters.forEach((filter, i) => {
                let name = ((options.filter.nicknames && options.filter.nicknames[i]) ? options.filter.nicknames[i] : filter);
                let button = "<button class='filter-button' data-type='" + filter + "'>" + name + "</button>";
    
                filtersHtml += button;
            });
            filtersHtml += "</div>";
    
            if(options.filter.id){
                document.querySelector("#" + options.filter.id).insertAdjacentHTML("beforeend", filtersHtml);
            } else {
                appendToOptions(filtersHtml);
            }
    
            document.querySelectorAll("#filters-" + options.id + " button").forEach(el => {
                el.addEventListener("click", function(){
                    if(this.classList.contains("filter-active")){
                        this.classList.remove("filter-active");
    
                        activeFilters = activeFilters.filter(filter => filter != this.dataset.type);
                    } else {
                        this.classList.add("filter-active");
            
                        activeFilters.push(this.dataset.type);
                    }
    
                    localStorage["filters-" + options.id] = JSON.stringify(activeFilters);
            
                    self.render(data);
                });
            });
    
            if(options.saveFilters){
                activeFilters.forEach(filter => {
                    try { document.querySelector("[data-type='" + filter + "']").classList.add("filter-active"); } catch(e){};
                });
            }
        }
    
        this.addSearch = function(){
            const searchIcon = '<svg viewBox="1 1 20 20"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>';
            
            let placeholder = options.search.placeholder ?? "Search...";
            let searchButton = ((options.search.icon === false) ? "" : "<div class=btn-search>" + searchIcon + "</div>");
    
            let searchHtml = "<div class=table-search-wrapper>" + searchButton + "<input id='search-" + options.id + "' type=search class=table-search autocomplete=off placeholder='" + placeholder + "'></div>";
    
            if(options.search.id){
                document.querySelector("#" + options.search.id).innerHTML = searchHtml;
            } else {
                appendToOptions(searchHtml);
            }
    
            let search = document.querySelector("#search-" + options.id);
    
            search.previousElementSibling.addEventListener("click", function(){
                search.focus();
            });
    
            search.addEventListener("keyup", function(e){
                if(e.key.toLowerCase() != "enter" && e.key.toLowerCase() != "escape"){
                    searchFilter(this.value);
                }
            });
            search.addEventListener("search", function(){
                searchFilter(this.value);
            });
    
            function searchFilter(query){
                if(!query){
                    tableEl.querySelectorAll("tbody tr").forEach(row => {
                        row.style.display = "table-row";
                    });
                    return;
                }
        
                let toHide = [];
    
                tableEl.querySelectorAll("tbody tr").forEach(row => {
                    let hide = true;
                    row.querySelectorAll("td:not(.search-ignore)").forEach(td => {
                        if(td.textContent.match(query)){
                            hide = false;
                            return false;
                        }
                    });
    
                    if(hide)
                        toHide.push(1);
                    else
                        toHide.push(0);
                });
    
                tableEl.querySelectorAll("tbody tr").forEach((row, index) => {
                    if(toHide[index])
                        row.style.display = "none";
                    else
                        row.style.display = "table-row";
                });
            }
        }
    
        function getUniqueId(){
            let i = 0;
            let id = "table-";
            do {
                id += i;
                i++;
            } while(document.querySelector("#" + id))
    
            return id;
        }
    
        function appendToOptions(addHtml){
            let tableOptions = document.querySelector("#table-options-" + options.id);
            if(tableOptions){
                tableOptions.insertAdjacentHTML("beforeend", addHtml);
            } else {
                let tableOptionsHtml = "<div id='table-options-" + options.id + "' class=table-options>" + addHtml + "</div>";
                tableEl.insertAdjacentHTML("beforebegin", tableOptionsHtml);
            }
        }
    
        this.render(data);
    }
