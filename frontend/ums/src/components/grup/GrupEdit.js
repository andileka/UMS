import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GrupForm from "./GrupForm";
import { updateGrup, fetchGrup } from "../../services";

export default function GrupEdit({ history }) {
  const [grup, setGrup] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const { grupId } = useParams();
  useEffect(() => {
    async function fetchData() {
      try {
        const fetched = await fetchGrup(grupId);
        setGrup(fetched);
      } catch (e) {
        history.push("/grups");
      }
    }
    fetchData();
  }, [history, grupId]);

  const submitForm = async (formData) => {
    try {
      await updateGrup(grupId, formData);
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
            <div className="card-header font-weight-bold">Update grup</div>
            <div className="card-body">
              {grup && (
                <GrupForm
                  grup={grup}
                  submitButtonText="Update Grup"
                  formError={submitError}
                  handleSubmit={submitForm}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
