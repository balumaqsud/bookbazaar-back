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
const Product_model_1 = __importDefault(require("../schema/Product.model"));
const View_service_1 = __importDefault(require("./View.service"));
const Errors_1 = __importStar(require("../libs/Errors"));
const product_enum_1 = require("../libs/enums/product.enum");
const view_enum_1 = require("../libs/enums/view.enum");
const config_1 = require("../libs/config");
class ProductService {
    constructor() {
        this.productModel = Product_model_1.default;
        this.viewService = new View_service_1.default();
    }
    //spa
    async getProduct(memberId, id) {
        const productId = (0, config_1.convertToMongoDbId)(id);
        let result = await this.productModel
            .findOne({
            _id: productId,
            productStatus: product_enum_1.ProductStatus.PROCESS,
        })
            .exec();
        if (!result)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_DATA_FOUND);
        //TO DO:
        if (memberId) {
            const input = {
                memberId: memberId,
                viewRefId: productId,
                viewGroup: view_enum_1.ViewGroup.PRODUCT,
            };
            const existView = await this.viewService.checkViewExistence(input);
            console.log("view:", existView);
            if (!existView) {
                //insert one view
                console.log("planning to insert a view");
                await this.viewService.insertMemberView(input);
                //increase counts
                result = await this.productModel
                    .findByIdAndUpdate(productId, { $inc: { productView: +1 } }, { new: true })
                    .exec();
            }
        }
        return result?.toJSON();
    }
    async getAllProducts() {
        const result = await this.productModel.find().exec();
        if (!result)
            throw new Errors_1.default(Errors_1.HttpCode.BAD_REQUEST, Errors_1.Message.NO_DATA_FOUND);
        return result;
    }
    async getProducts(inquiry) {
        const match = { productStatus: product_enum_1.ProductStatus.PROCESS };
        if (inquiry.productCategory) {
            match.productCategory = inquiry.productCategory;
        }
        if (inquiry.search) {
            match.productName = { $regex: new RegExp(inquiry.search, "i") };
        }
        const sort = inquiry.order === "productPrice"
            ? { [inquiry.order]: 1 }
            : { [inquiry.order]: -1 };
        const result = await this.productModel
            .aggregate([
            { $match: match },
            { $sort: sort },
            { $skip: (inquiry.page * 1 - 1) * inquiry.limit }, //72
            { $limit: inquiry.limit * 1 }, //73+
        ])
            .exec();
        console.log(result);
        if (!result)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_DATA_FOUND);
        return result;
    }
    async createNewProduct(input) {
        try {
            const result = await this.productModel.create(input);
            return result.toObject();
        }
        catch (error) {
            console.log("error in createProduct:service: ", error);
            throw error instanceof Errors_1.default ? error.message : Errors_1.Message.CREATE_FAILED;
        }
    }
    async updateTheProduct(id, input) {
        try {
            const result = await this.productModel
                .findOneAndUpdate({ _id: id }, input, { new: true })
                .exec();
            return result?.toObject();
        }
        catch (error) {
            console.log("error in Update:service: ", error);
            throw error instanceof Errors_1.default ? error.message : Errors_1.Message.UPDATE_FAILED;
        }
    }
}
exports.default = ProductService;
