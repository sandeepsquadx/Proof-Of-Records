var error = {"isJoi" : false, "message" : ""};

var logerror = {
    operation : "",
    caller_id : "",
    error : {}
}

let successResponse = function(result) {
        return {
            status : 200,
            error : null,
            data : result
    }
};

let errorResponse = function(error) {
        return {
            status : 400,
            error : error,
            data : null
        }
};

const dateMaker = function(){
    return new Date().getTime();
}

module.exports = {
    error,
    logerror,
    successResponse,
    errorResponse,
    dateMaker
}