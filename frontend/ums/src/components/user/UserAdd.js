import React, { useState, useEffect } from "react";
import UserForm from "./UserForm";
import { createUser, fetchGrups } from "../../services";

export default function UserAdd({ history }) {
  const [grups, setGrups] = useState([]);
  const [submitError, setSubmitError] = useState(null);

  async function fetchData() {
    try {
      const data = await fetchGrups();
      setGrups(data.grups);
    } catch (e) {
      setSubmitError(e.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const submitForm = async (formData) => {
    try {
      await createUser(formData);
      history.push("/users");
    } catch (e) {
      setSubmitError(e.message);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header font-weight-bold">Create User</div>
            <div className="card-body">
              <UserForm
                submitButtonText="Create User"
                formError={submitError}
                handleSubmit={submitForm}
                grups={grups}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
