import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../services/userService";
import RegisterUser from "./RegisterUser";
import ModalWrapper from "./ModalWrapper";

const User = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [toUpdateUser, setToUpdateUser] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    loadAllUsers();
  }, []);

  const loadAllUsers = async () => {
    try {
      setUsers(await getAllUsers());
    } catch (error) {
      console.error("Could not get users: ", error);
    }
  };

  const registerUser = async (data) => {
    await createUser(data);
    loadAllUsers();
    setShowRegisterModal(false);
  };

  const handleUpdate = async (id, data) => {
    await updateUser(id, data);
    loadAllUsers();
    setShowUpdateModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
      loadAllUsers();
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={false} onClose={() => {}} />
      <main className="dashboard-main">
        <Header
          title="Teams"
          subtitle="Manage and organize your Users"
          onToggleSidebar={() => {}}
        />

        <div className="container mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Manage Users</h4>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="btn btn-primary mx-2 btn-sm"
            >
              Register User
            </button>
            <div
              className="input-group input-group-sm flex-nowrap"
              style={{ maxWidth: "250px" }}
            >
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="btn btn-outline-secondary btn-sm"
                type="button"
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>

          <div className="row">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.id} className="col-md-6 col-lg-4 mb-3">
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="card-text text-muted mb-0">
                          Id: {user.id}
                        </h5>
                        <h5 className="card-title mb-1">{user.name}</h5>
                        <p className="card-text text-muted mb-0">
                          Email: {user.email}
                        </p>
                      </div>
                      <div>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => {
                            setToUpdateUser(user);
                            setShowUpdateModal(true);
                          }}
                        >
                          <i className="bi bi-pencil small"></i> Update
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          <i className="bi bi-trash small"></i> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">No users found</p>
            )}
          </div>
        </div>
      </main>

      <ModalWrapper
        title="Register New User"
        show={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      >
        <RegisterUser onRegister={registerUser} />
      </ModalWrapper>

      <ModalWrapper
        title="Update User"
        show={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
      >
        <RegisterUser toUpdateUser={toUpdateUser} update={handleUpdate} />
      </ModalWrapper>
    </div>
  );
};

export default User;
