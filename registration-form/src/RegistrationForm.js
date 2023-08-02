import React, { useState, useEffect } from "react";
import axios from "axios";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    state: "",
    city: "",
  });

  const [users, setUsers] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users"); 
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users", formData);
      setFormData({ name: "", email: "", state: "", city: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error saving user data: ", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (user) => {
    setEditModalData(user);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${editModalData._id}`,
        editModalData
      ); 
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user: ", error);
    }
  };

  const handleDeleteClick = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`); 
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form-container">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label htmlFor="state">State:</label>
        <select
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
        >
          <option value="">Select State</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Maharashtra">Maharashtra</option>
        </select>
        <label htmlFor="city">City:</label>
        <select
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        >
          <option value="">Select City</option>
          {formData.state === "Karnataka" &&
            ["Mangaluru", "Bengaluru", "Kolar"].map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          {formData.state === "Maharashtra" &&
            ["Pune", "Mumbai", "Thane"].map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
        </select>
        <button type="submit">Register</button>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>State</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.state}</td>
                <td>{user.city}</td>
                <td>
                  <button onClick={() => handleEditClick(user)} className="edit-btn">
                    Edit
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDeleteClick(user._id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h3>Edit User</h3>
            <form onSubmit={handleEditSubmit}>
              <label htmlFor="edit-name">Name:</label>
              <input
                type="text"
                id="edit-name"
                name="edit-name"
                value={editModalData.name}
                onChange={(e) =>
                  setEditModalData({ ...editModalData, name: e.target.value })
                }
                required
              />
              <label htmlFor="edit-email">Email:</label>
              <input
                type="email"
                id="edit-email"
                name="edit-email"
                value={editModalData.email}
                onChange={(e) =>
                  setEditModalData({ ...editModalData, email: e.target.value })
                }
                required
              />
              <label htmlFor="edit-state">State:</label>
              <select
                id="edit-state"
                name="edit-state"
                value={editModalData.state}
                onChange={(e) =>
                  setEditModalData({ ...editModalData, state: e.target.value })
                }
                required
              >
                <option value="">Select State</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
              <label htmlFor="edit-city">City:</label>
              <select
                id="edit-city"
                name="edit-city"
                value={editModalData.city}
                onChange={(e) =>
                  setEditModalData({ ...editModalData, city: e.target.value })
                }
                required
              >
                <option value="">Select City</option>
                {editModalData.state === "Karnataka" &&
                  ["Mangaluru", "Bengaluru", "Kolar"].map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                {editModalData.state === "Maharashtra" &&
                  ["Pune", "Mumbai", "Thane"].map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
