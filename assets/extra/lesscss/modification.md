# Less modification

## Added code

```javascript
let lessFileGeneratedCount = 0;

function generateFinalCountMessage(time) {
    if (lessFileGeneratedCount == 1){
        return `[1 CSS file generated in ${time}ms]`
    } else {
        return `[${lessFileGeneratedCount} CSS files generated in ${time}ms]`
    }
};
```

## Modified code

```javascript

```