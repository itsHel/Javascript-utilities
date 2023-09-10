# Modal

```js
Modal.show(text, type = "", callback = false, once = false)
```

## Args
- __text__      - Displayed text
- __type__      - Dictates color and icon
- __callback__  - If callback is set modal acts as confirm - on "Ok" callback is executed
- __once__      - If true modal is shown only once per one _sessionStorage_

### Types
- warn
- succ
- notify

### Example
```js
Modal.show("Warning text", "warn", () => { console.log("confirmed") }, true);
```

## Notes
- If callback is set modal acts as confirm - on yes will execute callback
- If once is true modal is shown only once per session (browser/tab closing)
- `Modal.preload()` preloads hidden modal
