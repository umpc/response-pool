# Response Pool

Response Pool is a very small library (< 40 LoC), based on [js-csp](https://github.com/ubolonton/js-csp), that can be used to pause subsequent function calls and pass a value from the first call to the callback functions of later calls as soon as it becomes available.

For example: Functions within a Web API library may depend on having an access token available. If the library instance has not yet been authenticated, and then four such functions are executed from within the same block, each function will check the token state and will attempt to concurrently log-in.

This library provides an easy way of preventing this behavior in JavaScript, and in the example case, prevents four concurrent login attempts when only one with the same parameters is desired.

Response Pool was created for a specific purpose and meets the goals that it was written for, though feel free to submit a pull request or an issue.

## Example Implementation

```expensiveCall``` blocks subsequent calls while running and then passes the result
from the first function call into the callback functions of the subsequent calls.

```
import ResponsePool from 'response-pool';
const rPool = new ResponsePool();                 // Create a new pool for a specific function or set of parameters.

function expensiveCall(respCallback) {
  if (rPool.isPending()) {                        // Check if a response value might be published.
    rPool.subVal(respCallback);                   // Wait for the value, then pass it to respCallback.
    return;                                       // Done.
  }
  try {
    rPool.pending();                              // Effectively disable expensiveNetworkRequest.

    handler(expensiveNetworkRequest(), val => {
      try {
        rPool.pubVal(val, respCallback);          // Publish response value to subscribers.
        rPool.done();                             // Enable expensiveNetworkRequest again.
      }
      catch (ex) {
        throw ex;
      }
    });
  }
  catch (ex) {
    rPool.reset();                                // Publish null value to subscribers and enable expensiveNetworkRequest again.
    throw ex;
  }
}
```

## License

The source code is available under the [MIT License](https://opensource.org/licenses/MIT).