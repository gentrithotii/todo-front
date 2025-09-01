//*todo: implement taskService and call the API

import axios from "axios";
import { authService } from "./authService";

const API_URL = "http://localhost:9090/api";

export const getAllTodosByPersonId = async (id) => {
  const response = await axios.get(`${API_URL}/todo/person/2`, {
    headers: {
      Authorization: `Bearer ${authService.getToken()}`,
    },
  });

  const payload = response.data;
  console.log(payload);
  return payload;
};

export const updateTodoDb = async (todoId, todoData) => {
  try {
    const response = await axios.put(`${API_URL}/todo/${todoId}`, todoData, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Not updated:", error);
    throw error;
  }
};

export const getAllTodosApi = async () => {
  const response = await axios.get(`${API_URL}/todo`, {
    headers: {
      Authorization: `Bearer ${authService.getToken()}`,
    },
  });

  const payload = response.data;
  console.log(payload);
  return payload;
};

export const deleteTodoById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/todo/${id}`, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Not deleted:", error);
    throw error;
  }
};

export const createTodo = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/todo`, data, {
      headers: {
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating todo:", error);
    throw error;
  }
};
