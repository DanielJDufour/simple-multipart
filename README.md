# simple-multipart
Simplest Parser of Multi-Part Form Data.

# features
- Simple Function Call
- Auto-Detects Boundaries
- Works great on AWS Lambda

# usage
```javascript
const parse = require("simple-multipart/parse");

const parts = parse(body);
```

# usage in AWS Lambda Functions
```javascript
const parse = require("simple-multipart/parse");

exports.handler = async function(event, context) {
    const parts = parse(event.body);
};
```

# longer example
```javascript
const parse = require("simple-multipart/parse");

const body = `--formBoundary
Content-Disposition: form-data; name="full_name"

George Washington
--formBoundary
Content-Disposition: form-data; name="biography"; filename="biography.txt"

George Washington was an American political leader, military general, statesman, and founding father who served as the first president of the United States from 1789 to 1797. Previously, he led Patriot forces to victory in the nation's War for Independence. (Wikipedia)
--formBoundary--`;

const parts = parse(body);

```
parts are
```json
[
    {
        "name": "full_name",
        "content": "George Washington"
    },
    {
        "name": "biography",
        "filename": "bio.txt",
        "content": "George Washington was an American political leader, military general, statesman, and founding father who served as the first president of the United States from 1789 to 1797. Previously, he led Patriot forces to victory in the nation's War for Independence. (Wikipedia)"
    }
]
```


