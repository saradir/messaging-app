import { Router } from "express";
import * as contactController from "../controllers/contacts.js"
import { validateAddContact, validateRemoveContact, validateSearchQuery } from "../validators/contacts.js";
import { handleValidationErrors } from "../middlewares/handleValidationErrors.js";
import { requireAuth } from "../middlewares/authenticate.js";

const contactsRouter = Router();
contactsRouter.use("/", requireAuth)
contactsRouter.get("/", contactController.index) // fetch all contact of req.user
contactsRouter.post("/", validateAddContact, handleValidationErrors, contactController.add)  // add new contact to req.user
contactsRouter.get("/search", validateSearchQuery, handleValidationErrors, contactController.findUser)
contactsRouter.delete("/:contactId", validateRemoveContact, handleValidationErrors, contactController.remove) // remove contact from req.user

export default contactsRouter;

