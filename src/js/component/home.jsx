import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from "react";

//create your first component
const Home = () => {
  const [InputValue, setInputValue] = useState('');
  const [user, setUser] = useState();

  const createUser = async () => {
    await fetch('https://playground.4geeks.com/todo/users/rikrdoleal', {
      headers: { 'Content-Type': 'application/json' },
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
      return createUser();
      }
      return resp.json()
    }).then(user => setUser(user))
  };

  useEffect(() => {
    getUser();
  }, []);
  console.log(user)
  const createTask = async (task) => {
    await fetch('https://playground.4geeks.com/todo/todos/rikrdoleal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label: task,
        is_done: false
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

  const validateTask = (task) => {
    if (!task || !task.trim()) {
      setInputValue('');
       return alert("You can't add an empty task!")
    }
    createTask(task);
    setInputValue('');
  }

  const deleteTask = async (task) => {
    const id = task.id;
    await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
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

  return (
    <div className="container">
      <h1>
        To-Do List After 4Geeks
      </h1>
      <div>
        <input type="text" placeholder="Add your task..."
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && validateTask(InputValue)}
          value={InputValue} />
        <ul>
          {
            user && user.todos.map((item) =>
              <li key={item.id}>
                {item.label}
                <FontAwesomeIcon className="deleteIcon" icon={faX}
                  onClick={() => deleteTask(item)} />
              </li>)
          }
        </ul>
      </div>
      <div className="tasks pt-2"> {user && user.todos.length ?
        <span>Have <b className="number">{user && user.todos.length}</b> {user.todos.length > 1 ? "tasks" : "task"}</span> :
        <span>Don't have any tasks</span>}
      </div>
    </div>
  );
};
export default Home;
