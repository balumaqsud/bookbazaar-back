"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Errors_1 = __importStar(require("../libs/Errors"));
const Product_service_1 = __importDefault(require("../model/Product.service"));
const productService = new Product_service_1.default();
const productController = {};
productController.getAllProducts = async (req, res) => {
    try {
        console.log("getAllProducts");
        const data = await productService.getAllProducts();
        res.render("products", { products: data });
    }
    catch (error) {
        if (error instanceof Errors_1.default)
            res.status(error.code).json(error.message);
        else {
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard.message);
        }
    }
};
productController.createNewProduct = async (req, res) => {
    try {
        console.log("createNewProduct");
        const data = req.body;
        if (!req.files?.length)
            throw new Errors_1.default(Errors_1.HttpCode.BAD_REQUEST, Errors_1.Message.MORE_IMAGE);
        data.productImages = req.files?.map((ele) => {
            return ele.path;
        });
        await productService.createNewProduct(data);
        res.send(`<script>alert("Created successfully");  window.location.reload(); window.location.replace('/admin/product/all')</script>`); //sends this after image uploaded successfully
    }
    catch (error) {
        if (error instanceof Errors_1.default)
            res.status(error.code).json(error.message);
        else {
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard.message);
        }
    }
};
productController.updateTheProduct = async (req, res) => {
    try {
        console.log("updateTheProduct");
        const id = req.params.id;
        const input = req.body;
        const result = await productService.updateTheProduct(id, input);
        res.status(Errors_1.HttpCode.OK).json({ data: result });
    }
    catch (error) {
        if (error instanceof Errors_1.default)
            res.status(error.code).json(error.message);
        else {
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard.message);
        }
    }
};
// for SPA
productController.getProduct = async (req, res) => {
    try {
        const { id } = req.params, memberId = req.member?._id ?? null, result = await productService.getProduct(memberId, id);
        res.status(Errors_1.HttpCode.OK).json(result);
    }
    catch (error) {
        if (error instanceof Errors_1.default)
            res.status(error.code).json(error.message);
        else {
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
        }
    }
};
productController.getProducts = async (req, res) => {
    try {
        const { order, page, limit, productCategory, search } = req.query;
        const inquiry = {
            order: String(order),
            page: Number(page),
            limit: Number(limit),
        };
        if (productCategory) {
            inquiry.productCategory = productCategory;
        }
        if (search) {
            inquiry.search = String(search);
        }
        const result = await productService.getProducts(inquiry);
        res.status(Errors_1.HttpCode.OK).json(result);
    }
    catch (error) {
        if (error instanceof Errors_1.default)
            res.status(error.code).json(error.message);
        else {
            res.status(500).json(Errors_1.default.standard);
        }
    }
};
exports.default = productController;
