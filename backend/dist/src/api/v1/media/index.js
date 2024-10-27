"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const media = (0, express_1.Router)();
media.get("/avatar/:fileName", (req, res) => {
    res.sendFile(`/uploads/profiles/${req.params.fileName}`, { root: "." }, (err) => {
        if (err) {
            res.json({ message: "File not found" });
        }
    });
});
media.get("/profile/:fileName", (req, res) => {
    res.sendFile(`/uploads/profiles/${req.params.fileName}`, { root: "." }, (err) => {
        if (err) {
            res.json({ message: "File not found" });
        }
    });
});
media.get("/images/:fileName", (req, res) => {
    res.sendFile(`/public/images/${req.params.fileName}`, { root: "." }, (err) => {
        if (err) {
            res.json({ message: "File not found" });
        }
    });
});
exports.default = media;
