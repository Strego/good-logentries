## good-logentries

[Good](https://github.com/hapijs/good) Reporter for [LogEntries](https://logentries.com)

### Example

```javascript

var hapi = new Hapi.Server('127.0.0.1', 8080);

hapi.pack.register({
  plugin : require('good'),
  options : {
    reporters : [
      {
        reporter : require('good-logentries'),
        args : [
          {
            log     : '*',
            request : '*',
            error   : '*',
            ops     : '*'
          },
          {
            // Any option you can pass to node-logentries.logger (except levels)
            token  : 'YOUR LOG TOKEN',
            secure : true
          }
        ]
      }
    ]
  }
}, function(err) {
  if (err) {
    console.log(err);
    return;
  }
});

```
