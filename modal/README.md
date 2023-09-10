# Modal

```js
Modal.show(text, (type = ""), (callback = false), (once = false));
```

## Args

-   **text** - Displayed text
-   **type** - Dictates color and icon
-   **callback** - If callback is set modal acts as confirm - on "Ok" callback is executed
-   **once** - If true modal is shown only once per one _sessionStorage_

### Types

-   warn
-   succ
-   notify

### Example

```js
Modal.show(
    "Warning text",
    "warn",
    () => {
        console.log("confirmed");
    },
    true,
);
```

## Notes

-   If callback is set modal acts as confirm - on yes will execute callback
-   If once is true modal is shown only once per session (browser/tab closing)
-   `Modal.preload()` preloads hidden modal
