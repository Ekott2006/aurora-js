# Aurora JS

Aurora is a powerful utility for enhancing HTTP requests in JS applications, providing an easy-to-use interface for making HTTP calls with advanced features like concurrency control, common headers

- Automatic loading state management.
- Setting limits for unresolved ongoing calls.
- Request cancellation.
- Authentication support.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Importing Aurora](#importing-aurora)
  - [Creating the instance](#creating-an-aurora-instance)
  - [Making HTTP Requests](#making-http-requests)
  - [Adding Headers and Params](#adding-headers-and-parameters)
  - [Removing Headers and Params](#removing-headers-and-parameters)
  - [Setting timeout](#setting-timeout)
- [Advanced Usage](#advanced-usage)
  - [Base URL](#base-url)
  - [Default Headers and Params](#defaults-headers-and-parameters)
  - [Max Concurrent Request Limit](#max-concurrent-request-limit)
  - [Custom AbortController](#custom-abort-controller)
  - [Call method](#call-method)
  - [Recall method](#recall-method)
- [Example](#example)
- [API Reference](#api-reference)

## Features

### Enhanced Axios Integration:

- Seamless integration with Axios, leveraging its powerful features.

### Loading State:

- Automatic handling of loading indicators.
- Simplifies state management during data fetching.

### Recall Functionality:

- Introducing a "recall" feature allowing developers to re-trigger Axios calls and update computed data.

### Request Cancellation:

- Mechanism to cancel unresolved requests, specially useful in scenarios like navigating away from a component while a request is still pending.
- Utilizes the modern AbortController for request cancellation.

### Authentication Support:

- Support for handling authentication tokens and headers.
- Easy configuration for adding authentication tokens to requests.

### Custom Headers and Params:

- Ability to add custom headers and query parameters to HTTP requests.
- Easy-to-use functions for adding and removing headers.

### Concurrency Control:

- Efficiently manage concurrent requests to avoid race conditions.
- Option to limit the number of simultaneous requests.

### Error Handling:

- Improved error handling with customized error messages and formats for a better understanding and handling.

## Installation

You can install Aurora JS using npm:

```bash
npm install aurora-js
```

Or yarn:

```bash
yarn add aurora-js
```

## Usage

### Importing Aurora

First, you need to import Aurora into your JavaScript project:

```js
import aurora, { Aurora } from "aurora-js";
```

### Creating an Aurora Instance

You can create an Aurora instance with several customizable options:

- **`url`**: The base URL for all HTTP requests.
- **`maxConcurrentRequests`**: The maximum number of concurrent requests allowed.
- **`abortController`**: An optional instance of `AbortController` for handling request cancellations.

```js
const auroraInstance = new Aurora({
  url: "https://api.example.com",
  maxConcurrentRequests: 5,
});
```

### Making HTTP Requests

You can use the instance methods to make HTTP requests. Each method (`get`, `post`, `put`, `delete`) returns a promise that resolves with an object containing the response, error, and additional control functions.

#### Example with `auroraInstance.get()` and `loadingCallback`

You can manage loading states easily using the `loadingCallback` option. This callback is triggered with `true` when the request starts and with `false` when the request finishes.

```js
const { response, error, hasError } = await auroraInstance.get({
  endpoint: "/endpoint",
  headers: { Authorization: "Bearer YOUR_ACCESS_TOKEN" },
  params: { page: 1, limit: 10 },
  loadingCallback: (isLoading) => {
    // Work with isLoading
  },
});
```

### Adding Headers and Parameters

Aurora allows you to add common headers and query parameters that will be included in all subsequent requests:

```js
auroraInstance.addHeaders({
  Authorization: "Bearer YOUR_ACCESS_TOKEN",
  "Content-Type": "application/json",
});

auroraInstance.addParams({ page: 1, limit: 10 });
```

### Removing Headers and Parameters

You can remove specific headers or query parameters by specifying the keys you want to remove. Alternatively, you can clear all headers or parameters.

```js
auroraInstance.removeHeaders(["Authorization"]);
auroraInstance.removeParams(["lang"]);

// Removing all headers or parameters
auroraInstance.removeHeaders();
auroraInstance.removeParams();
```

### Setting Timeout

Aurora allows you to set a global timeout for all HTTP requests. Requests that exceed the specified timeout will automatically fail.

```js
auroraInstance.setTimeout(5000); // Sets a 5-second timeout
auroraInstance.removeTimeout();
```

### Cancelling Requests

Aurora also supports request cancellation via `AbortController`. You can cancel all ongoing requests by invoking the `abortAll()` method.

```js
auroraInstance.abortAll(); // Cancels all ongoing requests
```

### Error Handling

Aurora automatically captures and handles errors using the `AuroraPromiseError` class, wrapping Axios errors with additional context. When a request fails, the returned object will include an `error` property containing the error details, and a `hasError` flag set to `true`.

```js
const { hasError, error } = await auroraInstance.get({
  endpoint: "/invalid-endpoint",
});
```

Here's the advanced usage section adapted for your JavaScript code:

---

## Advanced Usage

### Base URL

You can set a base URL for all requests made by the Aurora instance. This URL will be automatically prefixed to any endpoint you provide in subsequent requests.

```js
const auroraInstance = new Aurora({
  url: "https://api.example.com",
});
```

### Default Headers and Parameters

Aurora allows you to add default headers and parameters to every request made by the instance. These can be set using the `addHeaders` and `addParams` methods.

```js
auroraInstance.addHeaders({ "Custom-Header": "CustomValue" });
auroraInstance.removeHeaders(["Custom-Header"]);
auroraInstance.addParams({ page: 1, limit: 10 });
auroraInstance.removeParams(["page"]);
```

### Max Concurrent Request Limit

To limit the number of concurrent unresolved requests, use the `maxConcurrentRequests` option in the Aurora constructor or the `setMaxConcurrentRequestsLimit` method. If the number of unresolved requests exceeds this limit, further requests will fail until some are resolved.

```js
const auroraInstance = new Aurora({
  maxConcurrentRequests: 5,
});

// Or,
auroraInstance.setMaxConcurrentRequestsLimit(5);

// Pass no parameters to reset the limit to infinite
auroraInstance.setMaxConcurrentRequestsLimit();
```

### Custom Abort Controller

If you need custom control over request cancellation, you can provide your own `AbortController` to the Aurora instance. This is useful when you want more granular control over aborting specific requests or groups of requests.

```js
const customAbortController = new AbortController();
const auroraInstance = new Aurora({
  abortController: customAbortController,
});

// Later in your code, you can abort all ongoing requests using this controller
customAbortController.abort();
```

### Call Method

The `get()`, `post()`, `put()`, and `delete()` methods are all aliases of the main `call()` method. Each specific method simply passes the corresponding HTTP method string (e.g., `"get"`) to the `call()` method.

### Recall Method

The `recall()` method allows you to repeat a request without needing to create a new Aurora instance or redefine the request parameters. You can also modify some parameters before running the request again. This is particularly useful for scenarios where you need to refresh data periodically, retry a failed request, or adjust the query.

```js
const initialRequest = await auroraInstance.get({ endpoint: "/api/data" });

// Recall the request after 10 seconds
setTimeout(() => initialRequest.recall(), 10000);

// Recall the request after 10 seconds with modified parameters
setTimeout(() => initialRequest.recall({ params: { page: 2 } }), 10000);
```

### Managing the Loading State

Aurora provides a built-in way to manage the loading state of your requests. You can pass a `loadingCallback` to the request options, which will be called with `true` when the request starts and `false` when it ends.

```js
const setLoading = (isLoading) => {
  console.log(`Loading: ${isLoading}`);
  // Update the UI
};

const response = await auroraInstance.get({
  endpoint: "/api/data",
  loadingCallback: setLoading,
});
```

## Example

Here is a full example of using Aurora in a HTML Code Snippet

```html
<div>
  <div id="loading" style="display: none">Loading...</div>
  <div id="error" style="display: none"></div>
  <div id="response" style="display: none"></div>
  <button id="retry">Retry</button>
</div>

<script>
      import aurora from "./lib/index";
  const loadingElement = document.getElementById("loading");
  const errorElement = document.getElementById("error");
  const responseElement = document.getElementById("response");
  const retryButton = document.getElementById("retry");
  function loadingCallback(isLoading) {
    if (isLoading) {
      errorElement.style.display = "none";
      responseElement.style.display = "none";
    }
    loadingElement.style.display = isLoading ? "block" : "none";
  }
  const { error, hasError, recall, response } = await aurora.get({
    endpoint: "http://localhost:5173/",
    loadingCallback,
  });
  function updateUI() {
    if (hasError) {
      errorElement.style.display = "block";
      errorElement.textContent = error?.msg ?? "";
      return;
    }
    responseElement.style.display = "block";
    responseElement.textContent = response?.data ?? "";
  }

  retryButton.onclick = async () => {
    recall({ loadingCallback });
    updateUI();
  };
</script>
```

## API Reference

### Constructor

| Param                 | Type            | Nullable | Desc                                                  |
| --------------------- | --------------- | -------- | ----------------------------------------------------- |
| url                   | String          | &check;  | Base URL for HTTP requests.                           |
| maxConcurrentRequests | Number          | &check;  | Maximum number of concurrent requests allowed.        |
| abortController       | AbortController | &check;  | An optional AbortController for request cancellation. |
| axiosInstance         | AxiosInstance   | &check;  | An optional Axios instance for custom configuration.  |

### setMaxConcurrentRequestsLimit

Sets the maximum number of concurrent requests allowed for the `Aurora` instance.
| Param | Type | Nullable | Desc |
|-------|--------|----------|------|
| limit | Number | &check; | The maximum number of concurrent requests. If not provided, or if set to 0, concurrency control is disabled. |

### addHeaders

Adds common headers to the `Aurora` instance.

| Param   | Type   | Nullable | Desc                                                                   |
| ------- | ------ | -------- | ---------------------------------------------------------------------- |
| headers | Object | &cross;  | An object containing key-value pairs representing headers to be added. |

### removeHeaders

Removes specified headers from the `Aurora` instance. If no parameters are provided, removes all headers.

| Param       | Type          | Nullable | Desc                                                                                       |
| ----------- | ------------- | -------- | ------------------------------------------------------------------------------------------ |
| headerNames | Array<String> | &check;  | An optional array of header names to be removed. If not provided, all headers are removed. |

### addParams

Adds common query parameters to the `Aurora` instance.

| Param  | Type   | Nullable | Desc                                                                            |
| ------ | ------ | -------- | ------------------------------------------------------------------------------- |
| params | Object | &cross;  | An object containing key-value pairs representing query parameters to be added. |

### removeParams

Removes specified query parameters from the `Aurora` instance. If no parameters are provided, removes all parameters.

| Param      | Type          | Nullable | Desc                                                                                             |
| ---------- | ------------- | -------- | ------------------------------------------------------------------------------------------------ |
| paramNames | Array<String> | &check;  | An optional array of parameter names to be removed. If not provided, all parameters are removed. |

### setTimeout

Sets the timeout for all subsequent requests.

| Param   | Type   | Nullable | Desc                           |
| ------- | ------ | -------- | ------------------------------ |
| timeout | Number | &check;  | Timeout value in milliseconds. |

### removeTimeout

Removes the timeout configuration from the `Aurora` instance.

### abortAll

Aborts all ongoing requests using the `AbortController`'s signal.

Here’s an updated version of the README for the `call` method to reflect the new `AuroraCallOptions` type:

### call

Makes an HTTP request.
Returns an object containing `response`, `error`, `hasError`, and a `recall` function for retrying the request.

This method extends `AxiosRequestConfig`, allowing you to use all standard Axios configuration options in addition to the ones specified here.

| Param           | Type            | Nullable | Desc                                                                                                                             |
| --------------- | --------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| method          | String          | &cross;  | The HTTP method (e.g., 'get', 'post', 'put', 'delete').                                                                          |
| endpoint        | String          | &cross;  | The endpoint URL.                                                                                                                |
| abortController | AbortController | &check;  | The `AbortController` instance for canceling the request. If not provided, the default `AbortController` is used.                |
| loadingCallback | Function        | &check;  | A function that will be called with a boolean indicating whether the request is in progress (`true`) or has completed (`false`). |

### post

Makes a POST request using the `call` method with `method` set to 'post'.

| Param   | Type              | Nullable | Desc                 |
| ------- | ----------------- | -------- | -------------------- |
| options | AuroraCallOptions | &cross;  | The request options. |

### get

Makes a GET request using the `call` method with `method` set to 'get'.

| Param   | Type              | Nullable | Desc                 |
| ------- | ----------------- | -------- | -------------------- |
| options | AuroraCallOptions | &cross;  | The request options. |

### delete

Makes a DELETE request using the `call` method with `method` set to 'delete'.

| Param   | Type              | Nullable | Desc                 |
| ------- | ----------------- | -------- | -------------------- |
| options | AuroraCallOptions | &cross;  | The request options. |

### put

Makes a PUT request using the `call` method with `method` set to 'put'.

| Param   | Type              | Nullable | Desc                 |
| ------- | ----------------- | -------- | -------------------- |
| options | AuroraCallOptions | &cross;  | The request options. |
