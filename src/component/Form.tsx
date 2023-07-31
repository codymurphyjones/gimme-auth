import React from "react";
import { type FieldValues, useForm } from "react-hook-form";

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = (data: FieldValues) => console.log(data);
  const sub = handleSubmit(onSubmit);
  //   const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data);
  console.log("name:", errors.name);
  console.log("err", errors);
  return (
    <div>
      <div className="container">
        <h3>Form</h3>
        <form
          onSubmit={(e) => {
            void sub(e).catch();
          }}
        >
          <div className="mb-5">
            <label className="form-label" htmlFor="name">
              Name:
            </label>
            <input
              id="name"
              type="text"
              className="form-control"
              {...register("name", { required: true, minLength: 3 })}
            />
            {errors.name?.type === "required" && (
              <p>This name field is required</p>
            )}

            {errors.name?.type === "minLength" && <p>Minimum length is </p>}
          </div>

          <div className="mb-5">
            <label className="form-label" htmlFor="age">
              Age
            </label>
            <input
              id="age"
              type="number"
              className="form-control"
              {...register("age")}
            />
          </div>

          <button className="btn btn-lg btn-primary">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Form;
