"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.HttpCode = void 0;
var HttpCode;
(function (HttpCode) {
    HttpCode[HttpCode["OK"] = 200] = "OK";
    HttpCode[HttpCode["CREATED"] = 201] = "CREATED";
    HttpCode[HttpCode["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
    HttpCode[HttpCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpCode[HttpCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpCode[HttpCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpCode[HttpCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpCode[HttpCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HttpCode || (exports.HttpCode = HttpCode = {}));
var Message;
(function (Message) {
    Message["SOMETHING_WENT_WRONG"] = "something went wrong";
    Message["NO_DATA_FOUND"] = "No data is found!";
    Message["CREATE_FAILED"] = "Create is failed! Admin already exists";
    Message["UPDATE_FAILED"] = "Update is failed!";
    Message["USER_NOT_FOUND"] = "User not found, wrong Id";
    Message["WRONG_PASSWORD"] = "Password is incorrect";
    Message["USED_NICK_PHONE"] = "Used Nickname or Email";
    Message["NOT_AUTHENTICATED"] = "You are not authenticated yet, Please Login first!";
    Message["MORE_IMAGE"] = "Please upload more than one photos!";
    Message["PROFILE_IMAGE_NEEDED"] = "\u3156lease, Upload Profile Image!";
    Message["BLOCKED_USER"] = "You are blocked, please connect to the Restaurant";
    Message["TOKEN_CREATION_FAIL"] = "TOKEN_CREATION_FAIL";
})(Message || (exports.Message = Message = {}));
class Errors extends Error {
    constructor(statusCode, errorMessage) {
        super();
        this.code = statusCode;
        this.message = errorMessage;
    }
}
Errors.standard = {
    code: HttpCode.INTERNAL_SERVER_ERROR,
    message: Message.SOMETHING_WENT_WRONG,
};
exports.default = Errors;
