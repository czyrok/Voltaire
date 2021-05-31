# less.min.js file changes

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

**Before**
```javascript
new Date,h=l-a,s.logger.info("Less has finished and no sheets were loaded."),r({startTime:a,endTime:l,totalMilliseconds:h,sheets:s.sheets.length})):m((function(t,n,f,p,d){if(t)return u.add(t,t.href||p.href),void o(t);d.local?s.logger.info("Loading "+p.href+" from cache."):s.logger.info("Rendered "+p.href+" successfully."),i(e.document,n,p),s.logger.info("CSS for "+p.href+" generated in "+(new Date-l)+"ms"),0===--c&&(h=new Date-a,s.logger.info("Less has finished. CSS generated in "+h+"ms")
```

**After**
```javascript
new Date,h=l-a,s.logger.info("[No CSS file generated]"),r({startTime:a,endTime:l,totalMilliseconds:h,sheets:s.sheets.length})):m((function(t,n,f,p,d){if(t)return u.add(t,t.href||p.href),void o(t);i(e.document,n,p),lessFileGeneratedCount++,0===--c&&(h=new Date-a,s.logger.info(generateFinalCountMessage(h))
```