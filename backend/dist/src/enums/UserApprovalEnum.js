"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserApprovalEnum;
(function (UserApprovalEnum) {
    UserApprovalEnum[UserApprovalEnum["PENDING"] = 10] = "PENDING";
    UserApprovalEnum[UserApprovalEnum["UNKNOWN"] = 15] = "UNKNOWN";
    UserApprovalEnum[UserApprovalEnum["APPROVED"] = 20] = "APPROVED";
    UserApprovalEnum[UserApprovalEnum["REJECTED"] = 30] = "REJECTED";
    UserApprovalEnum[UserApprovalEnum["REGISTERED"] = 40] = "REGISTERED";
    UserApprovalEnum[UserApprovalEnum["UPDATE"] = 25] = "UPDATE";
})(UserApprovalEnum || (UserApprovalEnum = {}));
exports.default = UserApprovalEnum;
