import { useValidation, Validation } from "n/lib/validation";
import styles from "../pages/index.module.css";

const reg = /%|#|\$|@|!/;

const nameFieldValidation = Validation.new("")
  .length(2, 20)
  .match(/^[A-z]*$/)
  .blocking();

const UserSignIn = Validation.createSlice({
  username: "",
  password: "",
}).validate({
  username: Validation.new("").length(5, 10).not(),
  password: Validation.new("").match(reg),
});

const UserPreferences = Validation.createSlice({
  displayName: "",
  email: "",
}).validate({
  displayName: nameFieldValidation.includes("@"),
  email: Validation.new("").length(2, 200).includes("@"),
});

const UserPreferences2 = Validation.createSlice({
  firstName: "",
  lastName: "",
  confirmPassword: "",
  button: "",
});

console.log("UserSignIn", UserSignIn);

const UserSignUp = UserSignIn.mergeStates(
  UserPreferences,
  UserPreferences2
).validate({
  firstName: nameFieldValidation,
  lastName: nameFieldValidation,
  confirmPassword: Validation.new("").custom((val) => val.length > 5),
  button: Validation.new(""),
});

console.log("UserForm", UserSignUp);

export default function LoginForm() {
  const { sync, isValid, actions } = useValidation(UserSignUp);

  return (
    <div className={styles.form}>
      Username:{" "}
      <input
        {...sync(
          "username",
          {
            border: "thick double rgba(0,0,0,0)",
          },
          {
            border: "thick double red",
          }
        )}
        type={"text"}
        placeholder={"Enter your username"}
      />
      First Name:{" "}
      <input
        {...sync(
          "firstName",
          {
            border: "thick double rgba(0,0,0,0)",
          },
          {
            border: "thick double red",
          }
        )}
        type={"text"}
        placeholder={"Enter your first name"}
      />
      Last Name:{" "}
      <input
        {...sync(
          "lastName",
          {
            border: "thick double rgba(0,0,0,0)",
          },
          {
            border: "thick double red",
          }
        )}
        type={"text"}
        placeholder={"Enter your last name"}
      />
      Password:{" "}
      <input
        {...sync(
          "password",
          {
            border: "thick double rgba(0,0,0,0)",
          },
          {
            border: "thick double red",
          }
        )}
        type={"password"}
        placeholder={"Enter your name"}
      />
      Password:{" "}
      <input
        {...sync(
          "confirmPassword",
          {
            border: "thick double rgba(0,0,0,0)",
          },
          {
            border: "thick double red",
          }
        )}
        type={"password"}
        placeholder={"Enter your name"}
      />
      Radio Option:
      <input
        {...sync(
          "button",
          {
            border: "thick double rgba(0,0,0,0)",
          },
          {
            border: "thick double red",
          }
        )}
        placeholder={"Enter your name"}
        type="radio"
        checked={actions.watch("button") === "1"}
      />
    </div>
  );
}
