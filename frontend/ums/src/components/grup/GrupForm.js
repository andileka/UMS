import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

function GrupForm({
  grup,
  formError,
  submitButtonText = "Create Grup",
  handleSubmit,
  history,
}) {
  const [name, setName] = useState(grup ? grup.name : "");
  const [nameError, setNameError] = useState(null);
  const [description, setDescription] = useState(grup ? grup.description : "");
  const [descriptionError, setDescriptionError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    let hasError = false;
    if (name.length === 0) {
      setNameError("Name is required");
      hasError = true;
    } else {
      setNameError(null);
    }

    if (description.length === 0) {
      setDescriptionError("Description is required");
      hasError = true;
    } else {
      setDescriptionError(null);
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
      description,
    };

    handleSubmit(formData);
  };

  useEffect(() => {
    if (submitted) {
      validateForm();
    }
  }, [name, description, submitted]);

  const cancel = (e) => {
    e.preventDefault();
    history.push("/grups");
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
        <label className="col-md-4 col-form-label text-md-right">
          Description
        </label>

        <div className="col-md-6">
          <input
            id="description"
            type="text"
            className={"form-control" + (descriptionError ? " is-invalid" : "")}
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {descriptionError && (
            <span className="invalid-feedback" role="alert">
              <strong>{descriptionError}</strong>
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

export default withRouter(GrupForm);
