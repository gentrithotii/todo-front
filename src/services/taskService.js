import axios from "axios";
import { API_URL, authConfig } from "../utils/apiUrlToken";

export const toggleTodoCompleted = async (todo) => {
  try {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
      attachments: todo.attachments || [],
      dueDate: todo.dueDate,
    };
    return await updateTodoDb(todo.id, updatedTodo);
  } catch (error) {
    console.error("Error toggling todo:", error);
    throw error;
  }
};

const buildFormData = (data) => {
  const fd = new FormData();

  fd.append(
    "todo",
    new Blob(
      [
        JSON.stringify({
          title: data.title,
          description: data.description,
          completed: data.completed,
          dueDate: data.dueDate,
          personId: data.personId || null,
        }),
      ],
      { type: "application/json" }
    )
  );

  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((file) => fd.append("files", file));
  }

  return fd;
};

export const getAllTodosApi = async () => {
  try {
    const response = await axios.get(`${API_URL}/todo`, authConfig());
    return response.data;
  } catch (error) {
    console.error("Could not fetch todos:", error);
    throw error;
  }
};

export const createTodo = async (data) => {
  try {
    const fd = buildFormData(data);
    const response = await axios.post(`${API_URL}/todo`, fd, authConfig());
    return response.data;
  } catch (error) {
    console.error("Error creating todo:", error.response?.data || error);
    throw error;
  }
};

export const updateTodoDb = async (id, data) => {
  try {
    const fd = buildFormData(data);
    const response = await axios.put(`${API_URL}/todo/${id}`, fd, authConfig());
    return response.data;
  } catch (error) {
    console.error("Error updating todo:", error.response?.data || error);
    throw error;
  }
};

export const deleteTodoById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/todo/${id}`, authConfig());
    return response.data;
  } catch (error) {
    console.error("Error deleting todo:", error.response?.data || error);
    throw error;
  }
};
