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
const Member_model_1 = __importDefault(require("../schema/Member.model"));
const Errors_1 = __importStar(require("../libs/Errors"));
const member_enum_1 = require("../libs/enums/member.enum");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = require("../libs/config");
//Member service helps us to control member schema and stands between schema and controller!
class MemberService {
    //schema from schemaModel
    constructor() {
        this.memberModel = Member_model_1.default;
    }
    async getAdmin() {
        const result = await this.memberModel
            .findOne({ memberType: member_enum_1.MemberType.ADMIN })
            .exec();
        if (!result)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_DATA_FOUND);
        return result.toJSON();
    }
    //signin process
    //SPA
    async signup(input) {
        const salt = await bcryptjs_1.default.genSalt();
        input.memberPassword = await bcryptjs_1.default.hash(input.memberPassword, salt);
        try {
            const result = await this.memberModel.create(input);
            result.memberPassword = "";
            return result.toJSON();
        }
        catch (error) {
            throw new Errors_1.default(Errors_1.HttpCode.BAD_REQUEST, Errors_1.Message.USED_NICK_PHONE);
        }
    }
    async login(input) {
        const status = console.log(input);
        const member = await this.memberModel
            .findOne({
            memberNick: input.memberNick,
            memberStatus: { $ne: member_enum_1.MemberStatus.DELETE },
        }, { memberNick: 1, memberPassword: 1, memberStatus: 1 })
            .exec();
        if (!member)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.USER_NOT_FOUND);
        else if (member.memberStatus === member_enum_1.MemberStatus.BLOCK) {
            throw new Errors_1.default(Errors_1.HttpCode.FORBIDDEN, Errors_1.Message.BLOCKED_USER);
        }
        const isMatch = await bcryptjs_1.default.compare(input.memberPassword, member.memberPassword);
        if (!isMatch)
            throw new Errors_1.default(Errors_1.HttpCode.UNAUTHORIZED, Errors_1.Message.WRONG_PASSWORD);
        //lean() cannot be used for further errors it makes
        const result = await this.memberModel.findById(member._id).exec();
        return result?.toJSON();
    }
    //SSR
    //signin process
    async processSignUp(input) {
        // throwing error if admin type exists
        const exist = await this.memberModel
            .findOne({ memberType: member_enum_1.MemberType.ADMIN })
            .exec();
        if (exist) {
            console.log("admin exist");
            throw new Errors_1.default(Errors_1.HttpCode.BAD_REQUEST, Errors_1.Message.CREATE_FAILED);
        }
        //hashing password coming in input
        const salt = await bcryptjs_1.default.genSalt();
        input.memberPassword = await bcryptjs_1.default.hash(input.memberPassword, salt);
        //tying to create and admin with memberModel.create()
        try {
            const result = await this.memberModel.create(input);
            result.memberPassword = "";
            //sending result as Member type
            return result.toObject();
        }
        catch (error) {
            throw new Errors_1.default(Errors_1.HttpCode.BAD_REQUEST, Errors_1.Message.CREATE_FAILED);
        }
    }
    //login process
    async processLogin(input) {
        //finding memberNick in database as the same as input's memberNick! and returning memberNick and password
        const member = await this.memberModel
            .findOne({ memberNick: input.memberNick }, { memberNick: 1, memberPassword: 1 })
            .exec();
        if (!member)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.USER_NOT_FOUND);
        //checking if input's password and password in db is the same!
        const isMatch = await bcryptjs_1.default.compare(input.memberPassword, member.memberPassword);
        if (!isMatch)
            throw new Errors_1.default(Errors_1.HttpCode.BAD_REQUEST, Errors_1.Message.WRONG_PASSWORD);
        //finding member in db
        const result = await this.memberModel.findById(member._id).exec();
        return result?.toObject();
    }
    async getAllUsers() {
        const result = await this.memberModel
            .find({
            memberType: member_enum_1.MemberType.USER,
        })
            .exec();
        if (!result)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_DATA_FOUND);
        return result;
    }
    //updateMember
    async updateMember(member, input) {
        const memberID = (0, config_1.convertToMongoDbId)(member._id);
        const result = await this.memberModel
            .findByIdAndUpdate({ _id: memberID }, input, { new: true })
            .exec();
        if (!result)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_MODIFIED, Errors_1.Message.UPDATE_FAILED);
        return result.toJSON();
    }
    async getMemberDetail(member) {
        const memberId = (0, config_1.convertToMongoDbId)(member._id);
        const result = await this.memberModel
            .findOne({
            _id: memberId,
            memberStatus: member_enum_1.MemberStatus.ACTIVE,
        })
            .exec();
        if (!result)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_DATA_FOUND);
        return result.toJSON();
    }
    //top Users
    async getTopUsers() {
        const result = await this.memberModel
            .find({
            memberStatus: member_enum_1.MemberStatus.ACTIVE,
            memberPoints: { $gte: 1 },
        })
            .sort({ memberPoints: -1 })
            .limit(4)
            .exec();
        if (!result || result.length === 0) {
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_DATA_FOUND);
        }
        return result;
    }
    async updateTheUser(input) {
        input._id = (0, config_1.convertToMongoDbId)(input._id);
        const result = await this.memberModel
            .findByIdAndUpdate({
            _id: input._id,
        }, input, { new: true })
            .exec();
        if (!result)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_DATA_FOUND);
        return result.toObject();
    }
    //addUserPoint
    async addUserPoint(member) {
        const memberId = (0, config_1.convertToMongoDbId)(member._id);
        const result = await this.memberModel.findOneAndUpdate({
            _id: memberId,
            memberStatus: member_enum_1.MemberStatus.ACTIVE,
            memberType: member_enum_1.MemberType.USER,
        }, { $inc: { memberPoints: 1 } }, { new: true });
        return result?.toJSON();
    }
}
exports.default = MemberService;
