import express from "express";
import {
    addPaperToLibrary,
    getLibraryPapers,
    updatePaper,
    deletePaper,
    searchLibrary,
    closeLibModal,
} from "../controllers/library.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/library/add", verifyToken, addPaperToLibrary);
router.get("/library/papers", verifyToken, getLibraryPapers);
router.put("/library/paper/:pid/update", verifyToken, updatePaper);
router.delete("/library/paper/:pid/delete", verifyToken, deletePaper);
router.get("/library/search", verifyToken, searchLibrary);

router.get("/libmodal/close", closeLibModal);

export default router;
