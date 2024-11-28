import API from "./api";

const projectService = {
  async create(values) {
    try {
      const { data, ok } = await API.post("/project", values);

      if (!ok || !data) {
        throw new Error("Failed to create project");
      }

      return data;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { data, ok } = await API.get(`/project/${id}`);

      if (!ok || !data) {
        throw new Error("Project not found");
      }

      return data;
    } catch (error) {
      console.error("Error fetching project:", error);
      throw error;
    }
  },

  async update(id, values) {
    try {
      const { data, ok } = await API.put(`/project/${id}`, values);

      if (!ok) {
        throw new Error("Failed to update project");
      }

      return data;
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ok } = await API.remove(`/project/${id}`);

      if (!ok) {
        throw new Error("Failed to delete project");
      }

      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  },
};

export default projectService;
