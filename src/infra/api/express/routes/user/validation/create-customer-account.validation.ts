// src/routes/validators/create-customer-account.validator.ts
import { body } from "express-validator";

export const createCustomerAccountValidator = [
  body("email")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("fullName")
    .isString().withMessage("Full name must be a string")
    .isLength({ min: 2 }).withMessage("Full name must be at least 2 characters long"),

  body("cpf")
    .isString().withMessage("CPF must be a string")
    .notEmpty().withMessage("CPF is required"),

  body("phone")
    .isString().withMessage("Phone number must be a string")
    .notEmpty().withMessage("Phone number is required")
    .matches(/^\d+$/).withMessage("Phone number must contain only digits"),

  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .notEmpty().withMessage("Password is required"),

  body("customerProfile.address")
    .notEmpty().withMessage("Address is required")
    .isString().withMessage("Address must be a string"),

  body("customerProfile.city")
    .notEmpty().withMessage("City is required")
    .isString().withMessage("City must be a string"),
];
