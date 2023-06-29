import { useState, useEffect } from 'react';
import api from './api';

import Modal from 'react-modal';


function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newTaskDescription, setNewTaskDescription] = useState('');

    const [selectedTaskId, setSelectedTaskId] = useState('');


    const handleAddTask = async () => {
        const userId = localStorage.getItem('userId');
        try {
    
          const response = await api.post('/tasks', { userId: userId, description: newTaskDescription });
          const addedTask = response.data;
          setTasks([...tasks, addedTask]);
    
          // Close the modal
          setModalIsOpen(false);
    
          // Clear the new task input
          setNewTaskDescription('');
        } catch (error) {
          console.error('Error adding task:', error);
        }
      };

    const renderTasks = () => {
        if (tasks.length === 0) {
          return <p>No tasks available</p>;
        }
    
        return tasks.map((task) => (
          <div style={{marginTop:20, border:"10px solid black;", borderTopColor:"black"}} className="list-group-item d-flex justify-content-between"  key={task._id}>
            <p style={{width:"50%"}}>{task.description}</p>
            <button  style={{"width":"10%", float: "right" }} className="btn btn-primary btn-sm" onClick={() => handleEditTask(task._id)}>Edit</button>
            <button  style={{"width":"10%" }} className="btn btn-danger btn-sm" onClick={() => handleDelete(task._id)}>Delete</button>
          </div>
        ));
      };

    return (
        <div className="container">
          <h2  className="mt-4">My task List</h2>
          {renderTasks()}
    
          {selectedTaskId && (
            <TaskEditForm taskId={selectedTaskId} onSave={handleSaveTask} />
          )}
    
          <button   className="btn btn-primary btn-sm" onClick={() => setModalIsOpen(true)}>Add Task</button>
    
          <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
            <h3>Add Task</h3>
            <input
              type="text"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
            <button style={{margin:"10px"}}  className="btn btn-success btn-sm" onClick={handleAddTask}>Add</button>
            <button style={{margin:"10px"}}  className="btn btn-primary btn-sm" onClick={() => setModalIsOpen(false)}>Cancel</button>
          </Modal>
        </div>
      );
}