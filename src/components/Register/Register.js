import React from "react";
import { Formik } from "formik";

const Register = () => {
  localStorage.removeItem("authToken");
  return (
    <div className="container">
      <Formik
        initialValues={{ email: "", password1: "", name: "", password2: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          } else if (!values.name) {
            errors.name = "Required";
          } else if (!values.password1) {
            errors.password1 = "Required";
          } else if (values.password1 !== values.password2) {
            errors.password2 = "Password mismatch";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            let reqBody = {
              name: values.name,
              email: values.email,
              password: values.password1,
            };
            fetch(`/register`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(reqBody),
            })
              .then((response) => response.json())
              .then((res) => {})
              .catch((error) => {
                console.error("Error:", error["message"]);
              });
            setSubmitting(true);
          }, 400);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="login-form input-group" onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              placeholder="Your name"
            />
            {errors.name && touched.name && errors.name}
            <label>Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              placeholder="Your email"
            />
            {errors.email && touched.email && errors.email}
            <label>Password</label>
            <input
              type="password"
              name="password1"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              placeholder="Your password"
            />
            {errors.password1 && touched.password1 && errors.password1}
            <label>Repeat password</label>
            <input
              type="password"
              name="password2"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password2}
              placeholder="Repeat your password"
            />
            {errors.password2 && touched.password2 && errors.password2}
            <button
              type="submit"
              className="findBilets"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
