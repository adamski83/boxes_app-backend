"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boxRouter = void 0;
const express_1 = __importDefault(require("express"));
const box_1 = __importDefault(require("../schema/box"));
const user_1 = require("./user");
const router = express_1.default.Router();
exports.boxRouter = router;
router.get("/box/search", user_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allBoxes = yield box_1.default.find({});
        res.json(allBoxes);
    }
    catch (error) {
        res.status(400).json({ message: "Wystąpił błąd podczas pobierania boxów" });
    }
}));
router.delete("/box/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const box = yield box_1.default.findByIdAndDelete(id);
        if (!box) {
            return res.status(404).json({ message: "Box not found" });
        }
        return res.status(200).json({ message: "Box deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}));
router.delete("/box/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const boxId = req.params.id;
    try {
        const box = yield box_1.default.findByIdAndDelete(boxId);
        if (box) {
            console.log(`Box with ID ${boxId} was deleted successfully.`);
            res.send(`Box with ID ${boxId} was deleted successfully.`);
        }
        else {
            console.log(`Box with ID ${boxId} was not found.`);
        }
    }
    catch (error) {
        console.log(error);
    }
}));
router.post("/box", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, amount, dimension, usage, picture, createdAt } = req.body;
    try {
        const newBox = new box_1.default({
            name,
            description,
            amount,
            dimension,
            usage,
            picture,
            createdAt,
        });
        yield newBox.save();
        res.status(201).json(newBox);
    }
    catch (error) {
        res.status(500).json({ message: "Wystąpił błąd podczas dodawania boxa" });
    }
}));
router.put("/box/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const boxId = req.params.id;
    const { name, description, amount, dimension, usage, picture, createdAt } = req.body;
    console.log(boxId);
    try {
        const box = yield box_1.default.findByIdAndUpdate(boxId, { name, description, amount, dimension, usage, picture, createdAt }, { new: true });
        if (!box) {
            return res
                .status(404)
                .json({ message: "Box o podanym id nie został znaleziony" });
        }
        res.json(box);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Wystąpił błąd podczas aktualizacji boxa" });
    }
}));
