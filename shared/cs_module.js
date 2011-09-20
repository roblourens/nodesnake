/*  cs_module.js
 *  
 *  Tool to export data as module on server or to add it to window on the client
 *  Requires that the client does not have a variable named exports
 *
 *  Dependencies:
 * 
 */

/* Allows code to register itself globally in exports when on the server, and 
 * in window when on the client. */
function clientServerModule(data, outExports) {
    // if the data is an object
    if (typeof(data) !== 'object')
        throw "data must be an object";

    for (key in data)
        // if on server
        if (outExports)
            outExports[key] = data[key];

        // if on client
        else
            window[name] = data;
}

if (typeof(exports) !== 'undefined')
    exports.clientServerModule = clientServerModule;
