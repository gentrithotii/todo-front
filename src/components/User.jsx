import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { getAllUsers } from "../services/userService";

const User = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    loadAllUsers();
  });

  const loadAllUsers = async () => {
    try {
      setUsers(await getAllUsers());
    } catch (error) {
      console.error("Could not get users: ", error);
      throw error;
    }
  };

  const handleUpdate = (id) => {
    alert(`Update user with ID: ${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
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
            <h3>Manage Users</h3>
            <div className="input-group" style={{ maxWidth: "300px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-outline-secondary" type="button">
                <i className="bi bi-search"></i> Search
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
                          onClick={() => handleUpdate(user.id)}
                        >
                          <i className="bi bi-pencil"></i> Update
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          <i className="bi bi-trash"></i> Delete
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
    </div>
  );
};

export default User;
