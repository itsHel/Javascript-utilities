# Table

```js
function Table(data, nav, parentEl, createRows, options = {})
```

## Args

-   **data** - Data to be used in _createRows_
-   **nav** - Navigation of table
-   **parentEl** - Element which will cointain table
-   **createRows** - Function to create html of table's body
-   **options** - Object, optional

## Options

### id _string_

id attribute of table

### saveFilters _boolean_

Enables saving of active filters to localStorage  
Default: **true**

### orderCaseSensitive _boolean_

Enables case sensitive sorting  
Default: **false**

### search _object_

Adds search, all properties are optional, passing empty object is enough for activation  
Default: **false**

-   `search.id_` - id attribute of search
-   `search.icon` - shows magnifier icon, default: **true**
-   `search.placeholder` - placeholder text, default: **Search...**

### filter _object_

Enables table to by filtered by keywords  
Default: **false**

-   `filter.id` - id attribute of filter, optional
-   `filter.filters` - **array** of row properties, property passes filter if it has truthy value && is not equal to "0"
-   `filter.nicknames` - **array** of placeholder texts of keywords, optional

### filter _function_

Function to be executed once table has finished rendering

### defaultOrder _string_

Name of column which orders table on load  
Default is _first column_

### disableNavSorting _boolean_

Disables sorting table by clicking on head  
Default: **false**

### reverseOrder _array_

Array of columns(_string_) which will be sorted in reversed order  
Default: **false**

## Example

```js
new Table(data, tableNav, document.querySelector("body"), mycreateRows, {
    id: "file-table",
    tableListeners: mytableListeners,
    search: {
        id: "search-wrapper",
        icon: false,
        placeholder: "Hello...",
    },
    filter: {
        id: "myfilter",
        filters: ["active", "filename"],
        nicknames: ["Active", "Filename"],
    },
    saveFilters: false,
    orderCaseSensitive: true,
    defaultOrder: "count",
    disableNavSorting: false,
    reverseOrder: ["pages"],
});
```

Full example in `test.html`
