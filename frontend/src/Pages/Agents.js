import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addAgents } from "../Redux/Slices/AgentSlice";

const Agents = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    countryCode: "+91"
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const agents = useSelector((state) => state.agents.agents);
  const dispatch = useDispatch();
  const apiurl = useSelector((state) => state.api.url);
  console.log(apiurl)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(
          apiurl + "/user/get-agents",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        dispatch(addAgents(response?.data?.data?.agents));
      } catch (err) {
        console.log(err);
        toast.error(
          err.response?.data?.data?.message || "Failed to fetch agents"
        );
      } finally {
        setFetchLoading(false);
      }
    };
    if (!agents || agents?.length === 0) {
      fetchAgents();
    } else {
      setFetchLoading(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    formData.phone = formData.countryCode + formData.phone;
    try {
      await axios.post(apiurl + "/user/add-agent", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFormData({ name: "", email: "", phone: "", password: "" });
      const response = await axios.get(
        apiurl + "/user/get-agents",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(addAgents(response?.data?.data?.agents));
      toast.success("Agent added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto min-h-[88vh] pt-[100px] p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Manage Agents</h2>

      {/* Add Agent Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 p-6 bg-white rounded-lg shadow-lg"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Add New Agent
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-700 transition-colors duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-700 transition-colors duration-200"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Mobile (with country code)
            </label>
            <div className="flex space-x-2">
              {/* Country Code Dropdown */}
              <select
                value={formData.countryCode || "+91"} // Default to +91 if not set
                onChange={(e) =>
                  setFormData({ ...formData, countryCode: e.target.value })
                }
                className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-700 w-32"
                required
              >
                <option value="+91">In +91</option>
                <option value="+1">US +1</option>
                <option value="+1">CA +1</option>
                <option value="+44">GB +44</option>
                <option value="+61">AU +61</option>
                <option value="+49">DE +49</option>
                <option value="+33">FR +33</option>
                <option value="+81">JP +81</option>
                <option value="+86">CN +86</option>
                <option value="+55">BR +55</option>
              </select>

              {/* Phone Input */}
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="flex-1 border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-700"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-700 transition-colors duration-200"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-[#002f34] text-white p-3 rounded transition-colors duration-200 flex items-center"
          disabled={loading}
        >
          {loading && (
            <div
              className="w-7 h-7 border-4 border-white-300 mx-auto text-center border-t-[#002f34] rounded-full animate-spin"
              role="status"
              aria-live="polite"
              aria-label="Please wait"
            ></div>
          )}
          {loading ? "" : "Add Agent"}
        </button>
      </form>

      {/* Agent List */}
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Agent List</h3>
      {fetchLoading && (
        <div
          className="w-10 h-10 border-4 border-white-300 mx-auto text-center border-t-[#002f34] rounded-full animate-spin"
          role="status"
          aria-live="polite"
          aria-label="Please wait"
        ></div>
      )}
      {!fetchLoading && agents?.length === 0 && (
        <p className="text-gray-500">No agents found.</p>
      )}
      {!fetchLoading && agents?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left text-gray-700">Name</th>
                <th className="border p-3 text-left text-gray-700">Email</th>
                <th className="border p-3 text-left text-gray-700">Mobile</th>
              </tr>
            </thead>
            <tbody>
              {agents?.map((agent) => (
                <tr
                  key={agent._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="border p-3">{agent.name}</td>
                  <td className="border p-3">{agent.email}</td>
                  <td className="border p-3">{agent.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Agents;
