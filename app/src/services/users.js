// Dans src/services/users.js
import API from "./api";

const userService = {
  async create(values) {
    console.log({ values });
    try {
      const { data, ok } = await API.post("/user", values);

      if (!ok || !data) {
        throw new Error("Failed to create user");
      }

      return data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { data, ok } = await API.get(`/user/${id}`);

      if (!ok || !data) {
        throw new Error("User not found");
      }

      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  async update(id, values) {
    try {
      const { data, ok } = await API.put(`/user/${id}`, values);

      if (!ok) {
        throw new Error("Failed to update user");
      }

      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ok } = await API.remove(`/user/${id}`);

      if (!ok) {
        throw new Error("Failed to delete user");
      }

      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
};

export default userService;
