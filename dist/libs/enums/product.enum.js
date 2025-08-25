"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductCategory = exports.ProductType = exports.ProductStatus = void 0;
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["PAUSE"] = "PAUSE";
    ProductStatus["PROCESS"] = "PROCESS";
    ProductStatus["DELETE"] = "DELETE";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
var ProductType;
(function (ProductType) {
    ProductType["ELECTRONIC"] = "ELECTRONIC";
    ProductType["PHYSICAL"] = "PHYSICAL";
})(ProductType || (exports.ProductType = ProductType = {}));
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["HORROR"] = "HORROR";
    ProductCategory["FANTASY"] = "FANTASY";
    ProductCategory["SCIENCE_FICTION"] = "SCIENCE_FICTION";
    ProductCategory["ROMANCE"] = "ROMANCE";
    ProductCategory["KIDS"] = "KIDS";
    ProductCategory["HISTORY"] = "HISTORY";
    ProductCategory["POETRY"] = "POETRY";
    ProductCategory["ADVENTURE"] = "ADVENTURE";
    ProductCategory["THRILLER"] = "THRILLER";
})(ProductCategory || (exports.ProductCategory = ProductCategory = {}));
