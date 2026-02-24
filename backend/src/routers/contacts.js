import { Router } from "express";

const contactRouter = Router();

contactRouter.get("/", contactController.index) // fetch all contact of req.user
contactRouter.post("/", contactController.add)  // add new contact to req.user
contactRouter.delete("/:contactId", contactController.remove) // remove contact from req.user

