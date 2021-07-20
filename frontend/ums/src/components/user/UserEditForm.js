import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

function UserEditForm({
  user,
  formError,
  submitButtonText = "Create user",
  handleSubmit,
  history,
}) {
  const [name, setName] = useState(user ? user.name : "");
  const [nameError, setNameError] = useState(null);
  const [surname, setSurname] = useState(user ? user.surname : "");
  const [surnameError, setSurnameError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    let hasError = false;
    if (name.length === 0) {
      setNameError("Name is required");
      hasError = true;
    } else {
      setNameError(null);
    }

    if (surname.length === 0) {
      surnameError("surname is required");
      hasError = true;
    } else {
      setSurnameError(null);
    }
    return !hasError;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validateForm()) {
      return;
    }
    const formData = {
      name,
      surname,
    };

    handleSubmit(formData);
  };

  useEffect(() => {
    if (submitted) {
      validateForm();
    }
  }, [name, surname, submitted]);

  const cancel = (e) => {
    e.preventDefault();
    history.push("/users");
  };

  return (
    <form onSubmit={submitForm}>
      <div className="form-group row">
        <label className="col-md-4 col-form-label text-md-right">Name</label>

        <div className="col-md-6">
          <input
            id="name"
            type="text"
            className={"form-control" + (nameError ? " is-invalid" : "")}
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {nameError && (
            <span className="invalid-feedback" role="alert">
              <strong>{nameError}</strong>
            </span>
          )}
        </div>
      </div>

      <div className="form-group row">
        <label className="col-md-4 col-form-label text-md-right">Surname</label>

        <div className="col-md-6">
          <input
            id="surname"
            type="text"
            className={"form-control" + (surnameError ? " is-invalid" : "")}
            name="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />

          {surnameError && (
            <span className="invalid-feedback" role="alert">
              <strong>{surnameError}</strong>
            </span>
          )}
        </div>
      </div>

      <div className="form-group row mb-0">
        <div className="col-md-6 offset-md-4">
          {formError && (
            <div className="pb-3 text-danger">
              <strong>{formError}</strong>
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            {submitButtonText}
          </button>
          <button className="ml-2 btn btn-secondary" onClick={cancel}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

export default withRouter(UserEditForm);
