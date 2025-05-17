import { useState, useEffect, use } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi'; // Updated imports
import { useDispatch, useSelector } from 'react-redux';
import { addTasks } from '../Redux/Slices/TaskSlice';

const Tasks = () => {
  const [file, setFile] = useState(null);
  // const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'firstName', direction: 'asc' });
  const [fetchLoading, setFetchLoading] = useState(true);
  const tasks = useSelector(state => state.tasks.tasks);
  const dispatch = useDispatch();
  const apiurl = useSelector((state) => state.api.url);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(apiurl + '/user/get-tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        // setTasks(response?.data?.data);
        dispatch(addTasks(response?.data?.data));
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to fetch tasks');
      }
      finally{
        setFetchLoading(false);
        setFile(null);
      }
    };
    if(!tasks || tasks?.length===0)
      {
        fetchTasks();
      }
      else{
        setFetchLoading(false);
      }
  }, []);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await axios.post(apiurl + '/user/upload', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const response = await axios.get(apiurl + '/user/get-tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // setTasks(response?.data?.data);
      dispatch(addTasks(response?.data?.data));
      setFile(null);
      toast.success('Tasks distributed successfully!');
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || 'Failed to upload file');
    } finally {
      e.target.reset();
      setLoading(false);
      setFile(null);
    }
  };

  // Sorting function
  const sortTasks = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    const sortedTasks = [...tasks].sort((a, b) => {
      if (key === 'agent') {
        const aValue = a.agentId?.name || 'Unknown';
        const bValue = b.agentId?.name || 'Unknown';
        return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      const aValue = a[key];
      const bValue = b[key];
      return direction === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });
    // setTasks(sortedTasks);
    dispatch(addTasks(sortedTasks));
  };

  // Group tasks by agent
  const tasksByAgent = tasks?.reduce((acc, task) => {
    const agentName = task.agentId?.name || 'Unknown Agent';
    if (!acc[agentName]) acc[agentName] = [];
    acc[agentName].push(task);
    return acc;
  }, {});
  

  return (
    <div className="max-w-5xl mx-auto min-h-[88vh] pt-[100px] p-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Distribute Tasks</h2>

      {/* Upload CSV Form */}
      <form onSubmit={handleFileUpload} className="mb-8 p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Upload CSV/XLSX File</h3>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full sm:w-auto"
          />
          <button
            type="submit"
            className="bg-[#002f34] text-white p-3 min-w-[150px] rounded  transition-colors duration-200 flex items-center"
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
            {loading ? '' : 'Upload & Distribute'}
          </button>
        </div>
      </form>

      {/* Distributed Tasks */}
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Distributed Tasks</h3>
      {
        fetchLoading && <div
                className="w-10 h-10 border-4 border-white-300 mx-auto text-center border-t-[#002f34] rounded-full animate-spin"
                role="status"
                aria-live="polite"
                aria-label="Please wait"
              ></div>
      }
      {(!fetchLoading) && Object.keys(tasksByAgent).length === 0 ? (
        <p className="text-gray-500">No tasks distributed yet.</p>
      ) : (
        Object.keys(tasksByAgent).map(agentName => (
          <div key={agentName} className="mb-8">
            <div className='flex justify-between text-blue-500'>
                <h4 className="text-lg font-semibold  mb-2">{agentName}</h4>
            <h4 className="text-lg font-medium">No.of Tasks - {tasksByAgent[agentName]?.length}</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-3 text-left text-gray-700">
                      <button onClick={() => sortTasks('firstName')} className="flex items-center hover:text-blue-700 transition-colors duration-200">
                        First Name
                        {sortConfig.key === 'firstName' && (
                          sortConfig.direction === 'asc' ? <FiArrowDown className="ml-1" /> : <FiArrowUp className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="border p-3 text-left text-gray-700">
                      <button onClick={() => sortTasks('phone')} className="flex items-center hover:text-blue-700 transition-colors duration-200">
                        Phone
                        {sortConfig.key === 'phone' && (
                          sortConfig.direction === 'asc' ? <FiArrowUp className="ml-1" /> : <FiArrowDown className="ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="border p-3 text-left text-gray-700">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {tasksByAgent[agentName].map(task => (
                    <tr key={task._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="border p-3">{task.firstName}</td>
                      <td className="border p-3">{task.phone}</td>
                      <td className="border p-3">{task.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Tasks;