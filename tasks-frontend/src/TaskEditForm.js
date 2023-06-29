import React, { useState, useEffect } from 'react';
import api from './api';


const TaskEditForm = ({ taskId, onSave }) => {
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await api.get(`/task/${taskId}`);
            setDescription(response.data.description);
        };
    
        fetchTasks();
      }, [taskId]);

    const  handleSave = async () => {
        const response = await api.put(`/tasks/${taskId}`, { description });
    
          onSave(response);
      };

    return (
        <div>
          <h2>Edit Task</h2>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button style={{margin:"10px"}}  className="btn btn-primary btn-sm" onClick={handleSave}>Save</button>
        </div>
      );
}


export default TaskEditForm;