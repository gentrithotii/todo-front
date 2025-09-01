import React, { useEffect, useState } from "react";
import "./Task.css";
import Sidebar from "./Sidebar";
import Header from "./Header.jsx";
import {
  createTodo,
  deleteTodoById,
  getAllTodosApi,
  updateTodoDb,
} from "../services/taskService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { formatDate } from "../utils/dateformat.js";

const Task = () => {
  const [getAllTodos, setGetAllTodos] = useState([]);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    todoTitle: "",
    todoDescription: "",
    todoCompleted: false,
    todoDueDate: "",
    todoPersonId: user.id,
    todoNumberOfAttachments: [],
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      todoNumberOfAttachments: Array.from(e.target.files),
    });
  };

  const loadTodos = () => {
    getAllTodosApi().then(setGetAllTodos);
  };

  const deleteTodo = async (todoId) => {
    await deleteTodoById(todoId);

    loadTodos();
  };

  const markAsDone = async (todo) => {
    try {
      await updateTodoDb(todo.id, { ...todo, completed: !todo.completed });

      loadTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleSubmit = async (e) => {
    console.log(e);
    e.preventDefault();

    try {
      await createTodo(formData);
      loadTodos();
    } catch {
      console.error("Error posting");
    }
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
                  <h2 className="card-title mb-4">Add New Task</h2>

                  <form onSubmit={handleSubmit} id="todoForm">
                    <div className="mb-3">
                      <label htmlFor="todoTitle" className="form-label">
                        Title
                      </label>
                      <input
                        type="text"
                        name="todoTitle"
                        className="form-control"
                        id="todoTitle"
                        required
                        value={formData.todoTitle}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="todoDescription" className="form-label">
                        Description
                      </label>
                      <textarea
                        name="todoDescription"
                        className="form-control"
                        id="todoDescription"
                        rows="3"
                        value={formData.todoDescription}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="todoDueDate" className="form-label">
                          Due Date
                        </label>
                        <input
                          name="todoDueDate"
                          type="datetime-local"
                          className="form-control"
                          id="todoDueDate"
                          value={formData.todoDueDate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Attachments</label>
                      <div className="input-group mb-3">
                        <input
                          name="todoAttachments"
                          type="file"
                          className="form-control"
                          id="todoAttachments"
                          multiple
                          onChange={handleFileChange}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                      <div className="file-list" id="attachmentPreview"></div>
                    </div>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-plus-lg me-2"></i>
                        Add Task
                      </button>
                    </div>
                  </form>
                </div>
              </div>

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
                    {/* Task */}

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
                                <i className="bi bi-person"></i> {user.name}
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
