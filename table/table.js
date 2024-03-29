function Table(data, nav, parentEl, createRows, options = {}) {
    // TH data-column = name of sort property for row       Example: <th data-column='date'...      = Sorted by row.date, Should be in ''   Leave empty to ignore for sort
    // TH must have <span class="table-chevron"></span>     - replaced by chevron
    // TD with class .search-ignore will be ignored on search
    // options.filter = { filters: [], nicknames: [], id: ""}
    // filter = keep if(parseInt(row.property))
    // saveFilters      - saves active filters to localStorage

    const chevron =
        '<svg viewBox="2 2 20 20"><path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg>';

    options.id = options.id ?? getUniqueId();
    options.tableListeners = options.tableListeners ?? false; // Callback, receives table element as parameter
    options.filter = options.filter ?? false;
    options.search = options.search ?? false;
    options.saveFilters = options.saveFilters ?? true; // true = active filters are saved to localStorage
    options.orderCaseSensitive = options.orderCaseSensitive ?? false;
    options.defaultOrder = options.defaultOrder ?? false;
    options.disableNavSorting = options.disableNavSorting ?? false;
    options.reverseOrder = options.reverseOrder ?? false;

    this.element = null;

    var self = this;
    var firstRender = true;
    var activeFilters = [];
    var columnTypes = {};
    var order = {
        reverse: false,
        column: "",
    };

    if (options.defaultOrder) {
        order.column = options.defaultOrder;
    } else {
        // Default order is first row
        try {
            order.column = nav.match(/<th\sdata\-column='(.*?)'/)[1];
        } catch (e) {}
    }

    if (options.saveFilters) {
        activeFilters = JSON.parse(
            localStorage["filters-" + options.id] ?? "[]",
        );

        // In case of old localStorage record and empty filter - add it
        if (activeFilters?.length && !options.filter?.filters?.length) {
            options.filter = { filters: [...activeFilters] };
        }
    }

    this.render = function (renderData = null) {
        if (firstRender || renderData) {
            if (renderData) {
                data = renderData;
            }

            // Check values of all columns and assign them with types - int/string
            let temp = {};

            for (const property in data[0]) {
                columnTypes[property] = "int";
                temp[property] = "";
            }

            for (let i = 0; i < data.length; i++) {
                for (const property in temp) {
                    if (isNaN(data[i][property])) {
                        columnTypes[property] = "string";
                        delete temp[property];
                    }
                }
            }
        }

        if (!renderData) {
            renderData = data;
        }

        if (activeFilters.length) {
            renderData = renderData.filter((row) => {
                let keep = true;

                for (let i = 0; i < activeFilters.length; i++) {
                    if (
                        !(row[activeFilters[i]] && row[activeFilters[i]] != "0")
                    ) {
                        keep = false;
                        break;
                    }
                }

                return keep;
            });
        }

        if (order.column) {
            let reverseOrder = options.reverseOrder.includes(order.column);

            renderData.sort((a, b) => {
                if (columnTypes[order.column] == "string") {
                    // String sorting
                    if (options.orderCaseSensitive ^ reverseOrder) {
                        if (!order.reverse) {
                            if (a[order.column] > b[order.column]) return 1;
                            if (a[order.column] < b[order.column]) return -1;
                            return 0;
                        } else {
                            if (a[order.column] < b[order.column]) return 1;
                            if (a[order.column] > b[order.column]) return -1;
                            return 0;
                        }
                    } else {
                        if (!order.reverse ^ reverseOrder) {
                            if (
                                a[order.column].toLowerCase() >
                                b[order.column].toLowerCase()
                            )
                                return 1;
                            if (
                                a[order.column].toLowerCase() <
                                b[order.column].toLowerCase()
                            )
                                return -1;
                            return 0;
                        } else {
                            if (
                                a[order.column].toLowerCase() <
                                b[order.column].toLowerCase()
                            )
                                return 1;
                            if (
                                a[order.column].toLowerCase() >
                                b[order.column].toLowerCase()
                            )
                                return -1;
                            return 0;
                        }
                    }
                } else {
                    // Number sorting
                    if (!order.reverse ^ reverseOrder) {
                        if (a[order.column] === "") return 1;
                        if (b[order.column] === "") return -1;
                        return b[order.column] - a[order.column];
                    } else {
                        if (a[order.column] === "") return -1;
                        if (b[order.column] === "") return 1;
                        return a[order.column] - b[order.column];
                    }
                }
            });
        }

        let tableBody = createRows(renderData);

        if (firstRender) {
            nav = nav.replaceAll(
                "<ico>",
                '<span class="table-chevron">' + chevron + "</span>",
            );
            parentEl.insertAdjacentHTML(
                "beforeend",
                "<table id='" +
                    options.id +
                    "' class='z-table'>" +
                    "<thead><tr>" +
                    nav +
                    "</tr></thead><tbody>" +
                    tableBody +
                    "</tbody></div>",
            );

            this.element = parentEl.querySelector("#" + options.id);
        } else {
            parentEl.querySelector("#" + options.id + " tbody").innerHTML =
                tableBody;
        }

        if (options.tableListeners) {
            options.tableListeners(this.element);
        }

        // Do only once
        if (firstRender) {
            if (order.column) {
                this.element
                    .querySelector("th[data-column='" + order.column + "']")
                    .classList.add("th-active");
            } else {
                this.element
                    .querySelector("thead th")
                    .classList.add("th-active");
                order.column =
                    this.element.querySelector("thead th").dataset.column;
            }

            self.addNavListeners();

            if (options.filter) {
                self.addFilters();
            }

            if (options.search) {
                self.addSearch();
            }

            firstRender = false;
        }
    };

    this.addNavListeners = function () {
        this.element.querySelectorAll("th").forEach((el) => {
            if (!el.dataset.column) {
                el.style.pointerEvents = "none";
                return;
            }

            el.addEventListener("click", function () {
                if (this.classList.contains("th-active")) {
                    if (this.classList.contains("th-reverse")) {
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

                this.parentNode.querySelectorAll("th").forEach((el) => {
                    if (el != this) {
                        el.classList.remove("th-active", "th-reverse");
                    }
                });

                this.classList.add("th-active");

                if (!options.disableNavSorting) {
                    self.render();
                }
            });
        });
    };

    this.addFilters = function () {
        let filtersHtml =
            "<div id='filters-" + options.id + "' class=table-filters>";

        options.filter.filters.forEach((filter, i) => {
            let name =
                options.filter.nicknames && options.filter.nicknames[i]
                    ? options.filter.nicknames[i]
                    : filter;
            let button =
                "<button class='filter-button' data-type='" +
                filter +
                "'>" +
                name +
                "</button>";

            filtersHtml += button;
        });
        filtersHtml += "</div>";

        if (options.filter.id) {
            document
                .querySelector("#" + options.filter.id)
                .insertAdjacentHTML("beforeend", filtersHtml);
        } else {
            this.appendToOptions(filtersHtml);
        }

        document
            .querySelectorAll("#filters-" + options.id + " button")
            .forEach((el) => {
                el.addEventListener("click", function () {
                    if (this.classList.contains("filter-active")) {
                        this.classList.remove("filter-active");

                        activeFilters = activeFilters.filter(
                            (filter) => filter != this.dataset.type,
                        );
                    } else {
                        this.classList.add("filter-active");

                        activeFilters.push(this.dataset.type);
                    }

                    localStorage["filters-" + options.id] =
                        JSON.stringify(activeFilters);

                    self.render();
                });
            });

        if (options.saveFilters) {
            activeFilters.forEach((filter) => {
                try {
                    document
                        .querySelector("[data-type='" + filter + "']")
                        .classList.add("filter-active");
                } catch (e) {}
            });
        }
    };

    this.addSearch = function () {
        const searchIcon =
            '<svg viewBox="1 1 20 20"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>';

        let placeholder = options.search.placeholder ?? "Search...";
        let searchButton =
            options.search.icon === false
                ? ""
                : "<div class=btn-search>" + searchIcon + "</div>";

        let searchHtml =
            "<div class=table-search-wrapper>" +
            searchButton +
            "<input id='search-" +
            options.id +
            "' type=search class=table-search autocomplete=off placeholder='" +
            placeholder +
            "'></div>";

        if (options.search.id) {
            document.querySelector("#" + options.search.id).innerHTML =
                searchHtml;
        } else {
            this.appendToOptions(searchHtml);
        }

        let search = document.querySelector("#search-" + options.id);

        search.previousElementSibling.addEventListener("click", function () {
            search.focus();
        });

        search.addEventListener("keyup", function (e) {
            if (
                e.key.toLowerCase() != "enter" &&
                e.key.toLowerCase() != "escape"
            ) {
                searchFilter(this.value);
            }
        });
        search.addEventListener("search", function () {
            searchFilter(this.value);
        });

        function searchFilter(query) {
            if (!query) {
                this.element.querySelectorAll("tbody tr").forEach((row) => {
                    row.style.display = "table-row";
                });

                return;
            }

            let toHide = [];

            this.element.querySelectorAll("tbody tr").forEach((row) => {
                let hide = true;

                row.querySelectorAll("td:not(.search-ignore)").forEach((td) => {
                    if (td.textContent.match(query)) {
                        hide = false;

                        return false;
                    }
                });

                if (hide) {
                    toHide.push(1);
                } else {
                    toHide.push(0);
                }
            });

            this.element.querySelectorAll("tbody tr").forEach((row, index) => {
                if (toHide[index]) {
                    row.style.display = "none";
                } else {
                    row.style.display = "table-row";
                }
            });
        }
    };

    this.appendToOptions = function (addHtml) {
        let tableOptions = document.querySelector(
            "#table-options-" + options.id,
        );

        if (tableOptions) {
            tableOptions.insertAdjacentHTML("beforeend", addHtml);
        } else {
            let tableOptionsHtml =
                "<div id='table-options-" +
                options.id +
                "' class=table-options>" +
                addHtml +
                "</div>";
            this.element.insertAdjacentHTML("beforebegin", tableOptionsHtml);
        }
    };

    function getUniqueId() {
        let i = 0;
        let id = "table-";

        do {
            id += i;
            i++;
        } while (document.querySelector("#" + id));

        return id;
    }

    this.render();
}
