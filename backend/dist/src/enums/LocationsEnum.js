"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var locationTypeEnum;
(function (locationTypeEnum) {
    locationTypeEnum[locationTypeEnum["COUNTRY"] = 1] = "COUNTRY";
    locationTypeEnum[locationTypeEnum["CITY"] = 2] = "CITY";
    locationTypeEnum[locationTypeEnum["ANY"] = 0] = "ANY";
})(locationTypeEnum || (locationTypeEnum = {}));
exports.default = locationTypeEnum;
