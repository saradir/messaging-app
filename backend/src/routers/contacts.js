import { Router } from "express";
import * as contactController from "../controllers/contacts.js"
const contactsRouter = Router();

contactsRouter.get("/", contactController.index) // fetch all contact of req.user
contactsRouter.post("/", contactController.add)  // add new contact to req.user
contactsRouter.get("/search", contactController.findUser)
//contactsRouter.delete("/:contactId", contactController.remove) // remove contact from req.user

export default contactsRouter;

