import React, { useState } from "react";
import GrupForm from "./GrupForm";
import { createGrup } from "../../services";

export default function GrupAdd({ history }) {
  const [submitError, setSubmitError] = useState(null);
  const submitForm = async (formData) => {
    try {
      await createGrup(formData);
      history.push("/grups");
    } catch (e) {
      setSubmitError(e.message);
    }
  };
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header font-weight-bold">Create Grup</div>
            <div className="card-body">
              <GrupForm
                submitButtonText="Create Grup"
                formError={submitError}
                handleSubmit={submitForm}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
