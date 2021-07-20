import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ConfirmDialog from "../common/ConfirmDialog";
import { Button, DropdownButton, Dropdown, Row, Col } from "react-bootstrap";
import {
  fetchUser,
  deleteUser,
  removeGrupFromUser,
  getEdditableGrupsForUser,
  addGrupToUser,
} from "../../services";
import moment from "moment-timezone";

export default function User({ history }) {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [edditableGrups, setEdditableGrups] = useState(null);
  const [confirmDialogInfo, setConfirmDialogInfo] = useState({
    open: false,
    disabled: false,
    action: null,
    id: null,
  });

  async function fetchUserData() {
    if (!userId) {
      history.goBack();
    }
    try {
      const data = await fetchUser(userId);
      setUser(data);
    } catch (e) {
      history.goBack();
    }
  }
  async function fetchEdditableGrupsForUser() {
    if (!userId) {
      history.goBack();
    }
    try {
      const data = await getEdditableGrupsForUser(userId);
      setEdditableGrups(data);
    } catch (e) {
      history.goBack();
    }
  }

  useEffect(() => {
    fetchUserData();
    fetchEdditableGrupsForUser();
  }, []);

  const onClickDeleteUser = (userId) => {
    if (user && user.grups && user.grups.length > 0) {
      setConfirmDialogInfo({
        open: true,
        text: "You need to delet all the grups befor deleting the user ",
        action: "undelete_user",
        disabled: true,
      });
    } else {
      setConfirmDialogInfo({
        open: true,
        text: "Are you sure to remove this user ?",
        action: "delete_user",
        id: userId,
        disabled: false,
      });
    }
  };

  const onClickAddGrup = async (grupId, userId) => {
    try {
      await addGrupToUser({
        grupId: grupId,
        userId: userId,
      });
    } catch (e) {
      console.log(e);
    }

    fetchUserData();
    fetchEdditableGrupsForUser();
  };

  const onHideConfirmDialog = () => {
    setConfirmDialogInfo({
      open: false,
    });
  };

  const onDialogConfirm = async () => {
    try {
      if (confirmDialogInfo.action === "remove_grup") {
        await removeGrupFromUser(confirmDialogInfo.id);
        fetchUserData();
        fetchEdditableGrupsForUser();
        setConfirmDialogInfo({
          open: false,
        });
      } else if (confirmDialogInfo.action === "delete_user") {
        await deleteUser(confirmDialogInfo.id);
        history.push("/users");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onClickRemoveUser = (grupId, userId) => {
    setConfirmDialogInfo({
      open: true,
      text: "Are you sure to remove this ?",
      action: "remove_grup",
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
          {user &&
            user.grups &&
            user.grups.map((grups) => (
              <tr key={grups._id}>
                <td>{grups.name}</td>
                <td>{grups.surname}</td>
                <td>{moment(grups.createdAt).format("MMMM D YYYY")}</td>
                <td>
                  {grups._id && (
                    <>
                      <Button
                        variant="danger"
                        onClick={(e) => {
                          e.preventDefault();
                          onClickRemoveUser(grups._id, user.id);
                        }}
                      >
                        Remove from user
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
          {user && (
            <div>
              <div className="card">
                <div className="card-body">
                  <h2 className="mb-0">{user.name}</h2>
                  <p className="pt-2 mb-3">{user.surname}</p>
                </div>
              </div>
              <div className="card mt-5">
                <div className="card-body">
                  <Row>
                    <Col>
                      {" "}
                      <DropdownButton
                        id="dropdown-basic-button"
                        title="Add Another Grup "
                      >
                        {edditableGrups &&
                          edditableGrups.map((grup) => (
                            <Dropdown.Item
                              key={grup._id}
                              className="pb-2"
                              onClick={(e) => {
                                e.preventDefault();
                                onClickAddGrup(grup._id, user.id);
                              }}
                            >
                              {grup.name} {grup.surname}
                            </Dropdown.Item>
                          ))}
                      </DropdownButton>
                    </Col>
                    <Col xs lg="2">
                      {" "}
                      <Button
                        variant="success"
                        onClick={(e) => {
                          e.preventDefault();
                          history.push(`/users/${user.id}/edit`);
                        }}
                      >
                        Edit User
                      </Button>
                    </Col>
                    <Col xs lg="2">
                      {" "}
                      <Button
                        variant="danger"
                        onClick={(e) => {
                          e.preventDefault();
                          onClickDeleteUser(user.id);
                        }}
                      >
                        Delete User
                      </Button>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className="card mt-5">
                <div className="card-body">
                  <h5>Grups list of {user.name}</h5>
                </div>
              </div>
            </div>
          )}
          <div className="">{renderTable()}</div>
          {user && user.grups && user.grups.length === 0 && (
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
