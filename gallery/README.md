# Gallery

```js
function gallery(baseImages, options = {})
```

## Args

-   **baseImages** - Nodelist of images
-   **options** - Object, optional

## Options

### slide _boolean_

Enables slide effect (opacity effect is default), ignored if `stopAnimation == true`  
Default: **false**

### showName _boolean_

Shows filename of images  
Default: **false**

### showHeader _boolean_

Shows header  
Default: **true**

### showChevron _boolean_

Shows chevrons  
Default: **true**

### stopAnimation _boolean_

Disables animation  
Default: **false**

### chevronsOnSide _boolean_

Puts chevrons on image sides  
Default: **false**

## Example

```js
gallery(document.querySelectorAll("img"), {
    chevronsOnSide: false,
    stopAnimation: false,
    showChevron: true,
    showHeader: true,
    showName: true,
    slide: true,
});
```
