import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, toggleUserBlock } from "../../store/userSlice";
import { Card, CardBody, CardTitle, CardSubtitle, Button, Table } from "reactstrap";
import PageHeader from "../../components/dashboard/PageHeader";
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";

const Users = () => {
  const token = Cookies.get("token");
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);

  const refreshUsers = useCallback(() => {
    if (user?.type === "admin") {
      dispatch(fetchUsers(token));
    }
  }, [dispatch, token, user]);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  const handleToggleBlock = (userId) => {
    dispatch(toggleUserBlock({ userId, token })).then(() => {
      refreshUsers(); // Refresh after block/unblock
    });
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div className="custom-view-wrapper">
      <PageHeader
        title="User Management"
        description="Here you can block/unblock users as an admin."
      />

      {users.length === 0 ? (
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <CardTitle tag="h5">User Listing</CardTitle>
                <CardSubtitle className="mb-2 text-muted" tag="h6">
                  There are no users in the system
                </CardSubtitle>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody>
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <CardTitle tag="h5">User Listing</CardTitle>
                    <CardSubtitle className="mb-2 text-muted" tag="h6">
                    Overview of users
                    </CardSubtitle>
                </div>
            </div>
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Type</th>
                  <th>Wallet Balance</th>
                  <th>Action</th>
                </tr>
              </thead>
             <tbody>
                {users
                  .filter((u) => u.type !== "admin") // Exclude admins
                  .map((u) => (
                    <tr key={u._id}>
                      <td>{u.fullName}</td>
                      <td>{u.username}</td>
                      <td>{u.type}</td>
                      <td>{u.wallet?.balance?.toFixed(2)}$</td>
                      <td>
                        <Button
                          color={u.type === "blocked" ? "success" : "danger"}
                          onClick={() => handleToggleBlock(u._id)}
                        >
                          <FontAwesomeIcon
                            icon={u.type === "blocked" ? faUnlock : faBan}
                          />{" "}
                          {u.type === "blocked" ? "Unblock" : "Block"}
                        </Button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default Users;
