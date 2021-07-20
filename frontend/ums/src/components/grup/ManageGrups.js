import React, { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import moment from "moment-timezone";
import { Button, Row, Col } from "react-bootstrap";

import { fetchGrups, deleteGrup } from "../../services";
import ConfirmDialog from "../common/ConfirmDialog";

export default function Grups({ history }) {
  const [grups, setGrups] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  async function fetchData() {
    try {
      const data = await fetchGrups({ page, perPage, search });
      setGrups(data.grups);
      setTotal(data.total);
      setPage(data.page);
      setLoaded(true);
    } catch (e) {
      setFetchError(e.message);
    }
  }

  useEffect(() => {
    fetchData();
  }, [page, perPage, search]);

  const onClickGrups = (grupId) => {
    history.push(`/grup/${grupId}`);
  };

  const startIndex = Math.min(perPage * (page - 1) + 1, total);
  const endIndex = Math.min(startIndex + perPage - 1, total);

  const renderTable = () => {
    return (
      <table className="table table-hover mb-0">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {grups &&
            grups.map((grup, idx) => (
              <tr key={grup.id} onClick={() => onClickGrups(grup.id)}>
                <th>{startIndex + idx}</th>
                <td>{grup.name}</td>
                <td>{grup.description}</td>
                <td>{moment(grup.createdAt).format("MMMM D YYYY")}</td>
              </tr>
            ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4 className="pt-2">Manage Grups</h4>
              <div className="clearfix pt-3">
                <Row>
                  <Col>
                    <div className=" float-left form-group has-search">
                      <span className="fa fa-search form-control-feedback"></span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setPage(1);
                        }}
                      />
                    </div>
                  </Col>

                  <Col xs lg="2">
                    {" "}
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        history.push("/grups/add");
                      }}
                    >
                      Add New Grup
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="card-body">
              <div className="">{renderTable()}</div>

              {!fetchError && loaded && grups.length === 0 && (
                <div className="text-center">"No Grups found."</div>
              )}
            </div>
            <div className="card-footer">
              <div className="float-right"></div>

              <Pagination
                page={page}
                perPage={perPage}
                total={total}
                onChange={(p) => setPage(p)}
              />
              <div className="float-right mx-4 mt-2">
                Showing ({startIndex} - {endIndex}) / {total}
              </div>
              <div className="float-right mr-2 mt-1">
                Show per page &nbsp;
                <select
                  className="form-control-sm"
                  value={perPage}
                  onChange={(event) => {
                    setPerPage(parseInt(event.target.value));
                    setPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        show={dialogOpen}
        text="Are you sure you want to delete this Grup?"
        onHide={() => setDialogOpen(false)}
      />
    </div>
  );
}
