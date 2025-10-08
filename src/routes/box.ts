import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import { getBoxes } from "../controller/getBoxes";
import { searchBoxes } from "../controller/searchBoxes";
import { addBoxWithUpload } from "../controller/addBox";
import { deleteBox } from "../controller/deleteBox";
import { getBoxById } from "../controller/getBoxById";
import { updateOneBox } from "../controller/updateOneBox";

const router = express.Router();

router.get("/box", verifyToken, getBoxes);

router.get("/box/search", verifyToken, searchBoxes);

router.post("/box", addBoxWithUpload);

router.get("/box/:_id", getBoxById);

router.put("/box/:_id", updateOneBox);

router.delete("/box/:_id", deleteBox);

export { router as boxRouter };
