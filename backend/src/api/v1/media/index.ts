import { Router } from "express";

const media = Router();

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

export default media;