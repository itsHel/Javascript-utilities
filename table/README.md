# Table

```js
function Table(data, nav, parentEl, createRows, options = {})
```

## Args
- __data__          - Data to be used in _createRows_
- __nav__           - Navigation of table
- __parentEl__      - Element which will cointain table
- __createRows__    - Function to create html of table's body
- __options__       - Object, optional

## Options
### id _string_
id attribute of table

### saveFilters _boolean_
Enables saving of active filters to localStorage  
Default: __true__

### orderCaseSensitive _boolean_
Enables case sensitive sorting  
Default: __false__

### search _object_
Adds search, all properties are optional, passing empty object is enough for activation
- `search.id_`          - id attribute of search
- `search.icon`         - shows magnifier icon, default: __true__
- `search.placeholder`  - placeholder text, default: __Search...__
Default: __false__

### filter _object_
Enables table to by filtered by keywords 
- `filter.id`           - id attribute of filter, optional
- `filter.filters`      - _array_ of row properties, property passes filter if it has truthy value && is not equal to "0"
- `filter.nicknames`    - _array_ of placeholder texts of keywords, optional
Default: __false__

### filter _function_
Function to be executed once table has finished rendering

## Example
```js
new Table(
    data,
    tableNav,
    document.querySelector("body"),
    mycreateRows,
    {
        id: "file-table",
        tableListeners: mytableListeners,
        search: {
            id: "search-wrapper",
            icon: false,
            placeholder: "Hello..."
        },
        filter: {
            id: "myfilter",
            filters: ["active", "filename"],
            nicknames: ["Active", "Filename"]
        },
        saveFilters: false, 
        orderCaseSensitive: true   
    }
);
```
Full example in `test.html`
