import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi"; // Icons for expand/collapse
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addTasks } from "../Redux/Slices/TaskSlice";

const Dashboard = () => {
  const [agentTasks, setAgentTasks] = useState({});
  const [expandedAgents, setExpandedAgents] = useState({});
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();
  const [fetchLoading, setFetchLoading] = useState(true);
  const apiurl = useSelector((state) => state.api.url);

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(apiurl + "/user/get-tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const tasks = response?.data?.data;
        dispatch(addTasks(tasks));

        // Group tasks by agent
        const groupedTasks = tasks.reduce((acc, task) => {
          const agentName = task.agentId.name;
          if (!acc[agentName]) {
            acc[agentName] = {
              agentId: task.agentId._id,
              tasks: [],
            };
          }
          acc[agentName].tasks.push(task);
          return acc;
        }, {});

        setAgentTasks(groupedTasks);

        // Initialize expanded state for each agent
        const initialExpanded = Object.keys(groupedTasks).reduce(
          (acc, agentName) => {
            acc[agentName] = false;
            return acc;
          },
          {}
        );
        setExpandedAgents(initialExpanded);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setFetchLoading(false);
      }
    };

    if (!tasks || tasks?.length === 0) fetchTasks();
    else {
      setFetchLoading(false);
      const groupedTasks = tasks.reduce((acc, task) => {
        const agentName = task.agentId.name;
        if (!acc[agentName]) {
          acc[agentName] = {
            agentId: task.agentId._id,
            tasks: [],
          };
        }
        acc[agentName].tasks.push(task);
        return acc;
      }, {});
      setAgentTasks(groupedTasks);
    }
  }, []);

  // Toggle expand/collapse for an agent
  const toggleAgentTasks = (agentName) => {
    setExpandedAgents((prev) => ({
      ...prev,
      [agentName]: !prev[agentName],
    }));
  };

  return (
    <div className="max-w-6xl min-h-[88vh] mx-auto pt-[100px] p-6">
      {/* Header Section */}
      <h2 className="text-3xl font-bold text-black mb-6">Admin Dashboard</h2>
      <div className="bg-white p-6 border border-gray-300 mb-8">
        <p className="text-lg text-gray-700">
          Welcome to TaskDistributor! Manage your agents and distribute tasks
          efficiently.
        </p>
        <div className="mt-4 flex space-x-4">
          <Link
            to="/agents"
            className="bg-yellow-500 text-white px-4 py-2 rounded text-center"
          >
            Manage Agents
          </Link>
          <Link
            to="/tasks"
            className="bg-green-500 text-white px-4 py-2 rounded text-center"
          >
            Distribute Tasks
          </Link>
        </div>
      </div>

      {/* Agents with Tasks Section */}
      <h3 className="text-2xl font-semibold text-black mb-4">
        Task Distribution Overview
      </h3>
      {fetchLoading && (
        <div
          className="w-7 h-7 border-4 border-white-300 mx-auto text-center border-t-[#002f34] rounded-full animate-spin"
          role="status"
          aria-live="polite"
          aria-label="Please wait"
        ></div>
      )}
      {!fetchLoading && Object.keys(agentTasks).length === 0 ? (
        <p className="text-gray-700">
          No tasks assigned yet. Upload a file to distribute tasks!
        </p>
      ) : (
        <div className="space-y-4">
          {Object.entries(agentTasks).map(([agentName, { agentId, tasks }]) => (
            <div
              key={agentName}
              className="border border-gray-300 p-4 bg-white"
            >
              {/* Agent Header */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleAgentTasks(agentName)}
              >
                <h4 className="text-lg font-medium text-black">{agentName}</h4>

                <div className="text-black flex items-center space-x-5">
                  <h4 className="text-lg font-medium text-black">
                    No.of Tasks - {tasks?.length}
                  </h4>
                  {expandedAgents[agentName] ? (
                    <FiChevronUp size={20} />
                  ) : (
                    <FiChevronDown size={20} />
                  )}
                </div>
              </div>

              {/* Task Table */}
              {expandedAgents[agentName] && (
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full border border-gray-300 text-left">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border-b border-gray-300 p-2 text-sm text-gray-700">
                          First Name
                        </th>
                        <th className="border-b border-gray-300 p-2 text-sm text-gray-700">
                          Phone
                        </th>
                        <th className="border-b border-gray-300 p-2 text-sm text-gray-700">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task._id} className="border-b border-gray-200">
                          <td className="p-2 text-sm text-gray-700">
                            {task.firstName}
                          </td>
                          <td className="p-2 text-sm text-gray-700">
                            {task.phone}
                          </td>
                          <td className="p-2 text-sm text-gray-700">
                            {task.notes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
