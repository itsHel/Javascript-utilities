# Gallery

```js
function gallery(baseImages, options = {})
```

## Args
- __baseImages__    - Nodelist of images
- __options__       - Object, optional

## Options
### slide _boolean_
Enables slide effect (opacity effect is default), ignored if `stopAnimation == true`
Default: __false__

### showName _boolean_
Shows filename of images
Default: __false__

### showHeader _boolean_
Shows header
Default: __true__

### showChevron _boolean_
Shows chevrons
Default: __true__

### stopAnimation _boolean_
Disables animation
Default: __false__

### chevronsOnSide _boolean_
Puts chevrons on image sides
Default: __false__

## Example
```js
gallery(
    document.querySelectorAll("img"), 
    { 
        chevronsOnSide: false, 
        stopAnimation: false, 
        showChevron: true, 
        showHeader: true, 
        showName: true, 
        slide: true
    }
);
