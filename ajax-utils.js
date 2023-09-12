(function(global) {
    //Set up a namespace for our utility
    var ajaxUtils = {};


    // Returns an HTTP request object
    function getRequestObject() {
        if (window.XMLHttpRequest) {
            return (new XMLHttpRequest());
        } else if (window.ActiveXObject) {
            return (new ActiveXObject("Microsoft.XMLHTTOP"));
        } else {
            global.alert("Ajax is not support!");
            return (null);
        }
    }

    ajaxUtils.sendGetRequest =
        function(requestUrl, responseHandler, isJsonResponse) {
            var request = getRequestObject();
            request.onreadystatechange = function() {
                handleResponse(request, responseHandler, isJsonResponse);
            };
            request.open("GET", requestUrl, true);
            request.send(); //for POST only
        };

    function handleResponse(request, responseHandler, isJsonResponse) {
        if ((request.readyState == 4) && (request.status == 200)) {
            responseHandler(request);

            if (isJsonResponse == undefined) {
                isJsonResponse = true;
            }
            if (isJsonResponse) {
                responseHandler(JSON.parse(request.responseText))
            } else {
                responseHandler(request.responseText);
            }
        }
    }

    global.$ajaxUtils = ajaxUtils;

})(window);