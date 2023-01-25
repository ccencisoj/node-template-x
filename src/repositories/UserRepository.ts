import { User } from "../entities/User";
import { Schema, model } from "mongoose";
import { MongoRepository } from "../common/MongoRepository";
import { UserValidator } from "../validators/UserValidator";
import { ValidationSchema } from "../common/ValidationSchema";
import { RepositoryWithValidation } from "../common/RepositoryWithValidation";

const searchables = ["email"];

const MongoSchema = new Schema<User>({
  id: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  createdAt: {type: String, required: true},
  updatedAt: {type: String, required: true},
  deletedAt: {type: String, required: false},
  isDeleted: {type: Boolean, required: true}
})

const MongoModel = model("User", MongoSchema);

export const UserRepository = (
  new RepositoryWithValidation(
    new MongoRepository<User>(MongoModel, searchables),
    new ValidationSchema<User>({
      id: {
        type: String,
        unique: true,
        required: false,
        validate: UserValidator.validateId
      },
      email: {
        type: String,
        unique: true,
        required: true,
        validate: UserValidator.validateEmail
      },
      password: {
        type: String,
        unique: false,
        required: true,
        validate: UserValidator.validatePassword
      },
      createdAt: {
        type: String,
        unique: false,
        required: true,
        validate: UserValidator.validateDate
      },
      updatedAt: {
        type: String,
        unique: false,
        required: true,
        validate: UserValidator.validateDate
      },
      deletedAt: {
        type: String,
        unique: false,
        required: false,
        validate: UserValidator.validateDate
      },
      isDeleted: {
        type: Boolean,
        unique: false,
        required: true,
        validate: UserValidator.validatePassword
      }
    })
  )
)
