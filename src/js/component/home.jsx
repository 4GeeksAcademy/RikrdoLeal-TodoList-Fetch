import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faCheck } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from "react";

//create your first component
const Home = () => {
  const [InputValue, setInputValue] = useState('');
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState();

  const createUser = async () => {
    await fetch('https://playground.4geeks.com/todo/users/rikrdoleal', {
      method: 'POST'
    }).then(resp => {
      if (resp.ok) {
        alert('Your account have been successfully created!')
        getUser();
      }
    })
  };

  const getUser = async () => {
    await fetch('https://playground.4geeks.com/todo/users/rikrdoleal').then(resp => {
      if (!resp.ok) {
        createUser();
      }
      return resp.json()
    }).then(user => setUser(user))
  };

  const createTask = async (task) => {
    await fetch('https://playground.4geeks.com/todo/todos/rikrdoleal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "label": task,
        "is_done": false
      })
    }).then(resp => {
      if (resp.ok) {
        return resp.json()
      }
    }).then(respJson => {
      const userTasks = user.todos;
      const newUser = {
        ...user,
        todos: [...userTasks, respJson]
      };
      setUser(newUser);
    })
  }



  useEffect(() => {
    getUser();
  }, []);

  const validateTask = (task) => {
    if (!task || !task.trim()) {
      alert("You can't add an empty task")
    }
    createTask(task);
    setInputValue('');
  }

  const deleteTask = async (task) => {
    const id = task.id;
    await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: 'DELETE',
    }).then(resp => {
      if (resp.ok) {
        const userTasks = user.todos.filter(item => item.id !== task.id);
        const newUser = {
          ...user,
          todos: [...userTasks]
        };
        setUser(newUser)
      }
    })
  }

  const completeTask = (task) => {
    const newTask = {
      ...task,
      status: 'done'
    }
    const newTasks = tasks.filter((item) => item.id !== task.id);
    setTasks([...newTasks, newTask])
  }

  return (
    <div className="container">
      <div className='todo'>
        <h1>
          <input type="text" placeholder="Add List Tittle" />
        </h1>
        <div>
          <input type="text" placeholder="Add your tasks"
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && validateTask(e.target.value)}
            value={InputValue} />
        </div>
        <ul>
          {
            user && user.todos.map((item) =>
              <li key={item.id}>{item.label}
                <FontAwesomeIcon className="deleteIcon" icon={faX}
                  onClick={() => deleteTask(item)} />
                <FontAwesomeIcon className="checkIcon" icon={faCheck}
                  onClick={() => completeTask(item)} />
              </li>)
          }
        </ul>
      </div>
      <div className='done'>
        <h1 className='completeTask'>
          Completed Tasks
        </h1>
        <ul>
          {
            user && user.todos.map((item) =>
              <li key={item.id}>{item.label}
                <FontAwesomeIcon className="deleteIcon" icon={faX}
                  onClick={() => deleteTask(item)} /></li>)
          }
        </ul>
      </div>
      <div className="tasks pt-2"> {user && user.todos.length ?
        <b> Have {user && user.todos.length} tasks</b> :
        <b>Don't have any tasks</b>}
      </div>
    </div>
  );
};
export default Home;
