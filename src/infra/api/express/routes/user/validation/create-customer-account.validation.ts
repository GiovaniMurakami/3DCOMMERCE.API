// src/routes/validators/create-customer-account.validator.ts
import { body } from "express-validator";

export const createCustomerAccountValidator = [
  body("email")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("fullName")
    .isString().withMessage("Full name must be a string")
    .isLength({ min: 2 }).withMessage("Full name must be at least 2 characters long"),

  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .notEmpty().withMessage("Password is required"),
];
