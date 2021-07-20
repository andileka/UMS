import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ConfirmDialog from "../common/ConfirmDialog";
import { Button, DropdownButton, Dropdown, Row, Col } from "react-bootstrap";
import {
  fetchGrup,
  deleteGrup,
  removeUserFromGrup,
  getEdditableUsersForGrup,
  addUserToGrup,
} from "../../services";
import moment from "moment-timezone";

export default function Grup({ history }) {
  const { grupId } = useParams();
  const [grup, setGrup] = useState(null);
  const [edditableUsers, setEdditableUsers] = useState(null);
  const [confirmDialogInfo, setConfirmDialogInfo] = useState({
    open: false,
    disabled: false,
    action: null,
    id: null,
  });

  async function fetchGrupData() {
    if (!grupId) {
      history.goBack();
    }
    try {
      const data = await fetchGrup(grupId);
      setGrup(data);
    } catch (e) {
      history.goBack();
    }
  }
  async function fetchEdditableUsersForGrup() {
    if (!grupId) {
      history.goBack();
    }
    try {
      const data = await getEdditableUsersForGrup(grupId);
      setEdditableUsers(data);
    } catch (e) {
      history.goBack();
    }
  }

  useEffect(() => {
    fetchGrupData();
    fetchEdditableUsersForGrup();
  }, []);

  const onClickDeleteGrup = (grupId) => {
    if (grup && grup.users && grup.users.length > 0) {
      setConfirmDialogInfo({
        open: true,
        text: "You need to delet all the users befor deleting the grup ",
        action: "undelete_grup",
        disabled: true,
      });
    } else {
      setConfirmDialogInfo({
        open: true,
        text: "Are you sure to remove this Grup ?",
        action: "delete_grup",
        id: grupId,
        disabled: false,
      });
    }
  };

  if (grup && grup.users && grup.users.length > 0) {
  }

  const onClickAddUser = async (grupId, userId) => {
    try {
      await addUserToGrup({
        grupId: grupId,
        userId: userId,
      });
    } catch (e) {
      console.log(e);
    }

    fetchGrupData();
    fetchEdditableUsersForGrup();
  };

  const onHideConfirmDialog = () => {
    setConfirmDialogInfo({
      open: false,
    });
  };

  const onDialogConfirm = async () => {
    try {
      if (confirmDialogInfo.action === "remove_user") {
        await removeUserFromGrup(confirmDialogInfo.id);
        fetchGrupData();
        fetchEdditableUsersForGrup();
        setConfirmDialogInfo({
          open: false,
        });
      } else if (confirmDialogInfo.action === "delete_grup") {
        await deleteGrup(confirmDialogInfo.id);
        history.push("/");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onClickRemoveUser = (grupId, userId) => {
    setConfirmDialogInfo({
      open: true,
      text: "Are you sure to remove this ?",
      action: "remove_user",
      id: {
        grupId: grupId,
        userId: userId,
      },
      disabled: false,
    });
  };

  const renderTable = () => {
    return (
      <table className="table table-hover mb-0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Created Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {grup &&
            grup.users &&
            grup.users.map((users) => (
              <tr key={users._id}>
                <td>{users.name}</td>
                <td>{users.surname}</td>
                <td>{moment(users.createdAt).format("MMMM D YYYY")}</td>
                <td>
                  {users._id && (
                    <>
                      <Button
                        variant="danger"
                        onClick={(e) => {
                          e.preventDefault();
                          onClickRemoveUser(grup.id, users._id);
                        }}
                      >
                        Remove from grup
                      </Button>
                    </>
                  )}
                </td>
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
          {grup && (
            <div>
              <div className="card">
                <div className="card-body">
                  <h2 className="mb-0">{grup.name}</h2>

                  <p className="pt-2 mb-3">{grup.description}</p>
                </div>
              </div>
              <div className="card mt-5">
                <div className="card-body">
                  <Row>
                    <Col>
                      {" "}
                      <DropdownButton
                        id="dropdown-basic-button"
                        title="Add Another User "
                      >
                        {edditableUsers &&
                          edditableUsers.map((user) => (
                            <Dropdown.Item
                              key={user._id}
                              className="pb-2"
                              onClick={(e) => {
                                e.preventDefault();
                                onClickAddUser(grup.id, user._id);
                              }}
                            >
                              {user.name} {user.surname}
                            </Dropdown.Item>
                          ))}
                      </DropdownButton>
                    </Col>
                    <Col xs lg="2">
                      <Button
                        variant="success"
                        onClick={(e) => {
                          e.preventDefault();
                          history.push(`/grups/${grup.id}/edit`);
                        }}
                      >
                        Edit Grup
                      </Button>
                    </Col>
                    <Col xs lg="2">
                      <Button
                        variant="danger"
                        onClick={(e) => {
                          e.preventDefault();
                          onClickDeleteGrup(grup.id);
                        }}
                      >
                        Delete Grup
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="card mt-5">
                <div className="card-body">
                  <h5>Users list of {grup.name}</h5>
                </div>
              </div>
            </div>
          )}

          <div className="">{renderTable()}</div>

          {grup && grup.users && grup.users.length === 0 && (
            <div className="text-center">"No Users found."</div>
          )}
        </div>
        <ConfirmDialog
          show={confirmDialogInfo.open}
          text={confirmDialogInfo.text}
          onConfirm={onDialogConfirm}
          onHide={onHideConfirmDialog}
          disabled={confirmDialogInfo.disabled}
        />
      </div>
    </div>
  );
}
