// A simple check to see if there is a global Proxy function and it's native.
// Although this isn't fool-proof, it's a fairly reliable way of checking
// whether or not the browser supports Proxy.
var IS_PROXY_AVAILABLE = (
    typeof window.Proxy === "function"
    && window.Proxy.toString.indexOf("[native code]") > -1
);
