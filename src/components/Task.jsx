import React, { useEffect, useState } from "react";
import "./Task.css";
import Sidebar from "./Sidebar";
import Header from "./Header.jsx";
import {
  createTodo,
  deleteTodoById,
  getAllTodosApi,
  getAllUsers,
  toggleTodoCompleted,
  updateTodoDb,
} from "../services/taskService.js";
import { formatDate } from "../utils/dateformat.js";

const Task = () => {
  const [getAllTodos, setGetAllTodos] = useState([]);
  const [toUpdateTodo, setToUpdateTodo] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    completed: false,
    dueDate: "",
    personId: 0,
    attachments: [],
  });

  useEffect(() => {
    loadUsers();
    loadTodos();
  }, []);

  const loadUsers = async () => {
    const users = await getAllUsers();
    console.log(users);
    setAllUsers(users);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      attachments: Array.from(e.target.files),
    });
  };

  const updateTodo = (todoItem) => {
    setToUpdateTodo(todoItem);

    setFormData({
      title: todoItem.title,
      description: todoItem.description,
      completed: todoItem.completed,
      dueDate: todoItem.dueDate,
      personId: todoItem.personId,
      attachments: [],
    });
  };

  const loadTodos = async () => {
    const todos = await getAllTodosApi();
    const normalized = todos.map((t) => ({
      ...t,
      dueDate: t.dueDate ? t.dueDate.slice(0, 16) : "",
    }));
    setGetAllTodos(normalized);
  };

  const deleteTodo = async (todoId) => {
    await deleteTodoById(todoId);
    resetForm();
    loadTodos();
  };

  const markAsDone = async (todo) => {
    try {
      await toggleTodoCompleted(todo);
      loadTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // create a function to call get persons
  // display and render people in the form and when you selected a person pass person id to todo object

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (toUpdateTodo) {
        await updateTodoDb(toUpdateTodo.id, formData);
      } else {
        await createTodo(formData);
      }

      loadTodos();
      setToUpdateTodo(null);
      resetForm();
    } catch (error) {
      console.error("Error posting:", error.response?.data || error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      completed: false,
      dueDate: "",
      personId: 0,
      attachments: [],
    });
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={false} onClose={() => {}} />
      <main className="dashboard-main">
        <Header
          title="Tasks"
          subtitle="Manage and organize your tasks"
          onToggleSidebar={() => {}}
        />

        <div className="dashboard-content">
          <div className="row">
            <div className="col-md-8 mx-auto">
              <div className="card shadow-sm task-form-section">
                <div className="card-body">
                  <h2 className="card-title mb-4">
                    {toUpdateTodo ? "Edit Task" : "Add New Task"}
                  </h2>

                  <form onSubmit={handleSubmit} id="todoForm">
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        id="title"
                        required
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        Description
                      </label>
                      <textarea
                        name="description"
                        className="form-control"
                        id="description"
                        rows="3"
                        required
                        value={formData.description}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="dueDate" className="form-label">
                          Due Date
                        </label>
                        <input
                          name="dueDate"
                          type="datetime-local"
                          className="form-control"
                          id="dueDate"
                          required
                          value={formData.dueDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      </div>

                      {/* Person  */}
                      <div className="col-md-6 mb-3">
                        <label htmlFor="todoPerson" className="form-label">
                          Assign to Person
                        </label>
                        <select
                          className="form-select"
                          id="todoPerson"
                          name="personId"
                          value={formData.personId}
                          onChange={handleInputChange}
                        >
                          <option value="">
                            -- Select Person (Optional) --
                          </option>
                          {allUsers.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Attachments</label>
                      <div className="input-group mb-3">
                        <input
                          name="attachments"
                          type="file"
                          className="form-control"
                          id="attachments"
                          multiple
                          onChange={handleFileChange}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, attachments: [] })
                          }
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                      <div className="file-list" id="attachmentPreview">
                        {formData.attachments.map((file, idx) => (
                          <div key={idx}>{file.name}</div>
                        ))}
                      </div>
                    </div>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-plus-lg me-2"></i>
                        {toUpdateTodo ? "Update Task" : "Add Task"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Tasks */}
              <div className="card shadow-sm tasks-list mt-4">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Tasks</h5>
                  <div className="btn-group">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      title="Filter"
                    >
                      <i className="bi bi-funnel"></i>
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      title="Sort"
                    >
                      <i className="bi bi-sort-down"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="list-group">
                    {getAllTodos.map((todo) => (
                      <div
                        key={todo.id}
                        className="list-group-item list-group-item-action"
                      >
                        <div className="d-flex w-100 justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between">
                              <h6 className="mb-1">{todo.title}</h6>
                              <small className="text-muted ms-2">
                                {formatDate(todo.createdAt)}
                              </small>
                            </div>
                            <p className="mb-1 text-muted small">
                              {todo.description}
                            </p>
                            <div className="d-flex align-items-center flex-wrap">
                              <small className="text-muted me-2">
                                <i className="bi bi-calendar-event"></i>
                                {formatDate(todo.dueDate)}
                              </small>
                              <span className="badge bg-info me-2">
                                <i className="bi bi-person"></i> {todo.personId}
                              </span>
                              <span
                                className={
                                  todo.completed
                                    ? "badge bg-success me-2"
                                    : "badge bg-warning text-dark me-2"
                                }
                              >
                                {todo.completed ? "Done" : "Pending"}
                              </span>
                            </div>
                          </div>
                          <div className="btn-group ms-3">
                            <button
                              className="btn btn-outline-success btn-sm"
                              title="Complete"
                              onClick={() => markAsDone(todo)}
                            >
                              <i className="bi bi-check-lg"></i>
                            </button>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              title="Edit"
                              onClick={() => updateTodo(todo)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              title="Delete"
                              onClick={() => deleteTodo(todo.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Task;
