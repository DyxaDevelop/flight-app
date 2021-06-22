import { useHistory, Link } from "react-router-dom";
import React from "react";
import { Formik } from "formik";

const Login = () => {
  let history = useHistory();
  localStorage.removeItem("authToken");
  return (
    <div className="container">
      <Formik
        initialValues={{ email: "", password: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            const requestBody = {
              email: values.email,
              password: values.password,
            };
            fetch(`/login`, {
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify(requestBody),
            })
              .then((response) => response.json())
              .then((res) => {
                localStorage.setItem("authToken", res.token);
                history.push("/main");
              });
            setSubmitting(false);
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
            <label>Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              placeholder="Email"
            />
            {errors.email && touched.email && errors.email}
            <label>Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              placeholder="Password"
            />
            {errors.password && touched.password && errors.password}
            <button
              type="submit"
              className="findBilets"
              disabled={isSubmitting}
            >
              Submit
            </button>
            <Link className="link-elem" to="/register">
              Register
            </Link>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
