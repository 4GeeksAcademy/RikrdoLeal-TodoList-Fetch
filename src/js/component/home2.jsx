import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX, faCheck } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from "react";

const Home = () => {
  const [InputValue, setInputValue] = useState('');
  const [user, setUser] = useState({ todos: [], completed: [] });

  const createUser = async () => {
    await fetch('https://playground.4geeks.com/todo/users/rikrdoleal', {
      method: 'POST'
    }).then(resp => {
      if (resp.ok) {
        alert('Your account has been successfully created!')
        getUser();
      }
    })
  };

  // obtenemos los datos
  const getUser = async () => {
    await fetch('https://playground.4geeks.com/todo/users/rikrdoleal')
      .then(resp => {
        if (!resp.ok) {
          createUser();
        }
        return resp.json()
      })
      .then(user => {
        // Asigna los datos del usuario a estado, inicializando las listas como arreglos vacíos si no existen
        setUser(prevUser => ({
          ...prevUser,
          todos: user.todos || [],
          completed: user.completed || []
        }));
      });
  };

  // función para crear una tarea nueva
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
        getUser(); // Actualiza la lista de tareas
      }
    });
  }

  useEffect(() => {
    getUser(); // datos del usuario al cargar el componente
  }, []);

  // Validamos y creamos una nueva tarea
  const validateTask = (task) => {
    if (!task || !task.trim()) {
      alert("You can't add an empty task")
    } else {
      createTask(task);
    }
    setInputValue('');
  }

  // Función para eliminar tarea
  const deleteTask = async (taskId) => {
    await fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
      method: 'DELETE',
    }).then(resp => {
      if (resp.ok) {
        getUser(); // Actualiza las tareas después de eliminar una
      }
    });
  }

  // Función para marcar tarea completada
  const completeTask = async (task) => {
    const taskId = task.id;
    await fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "is_done": true
      })
    }).then(async resp => {
      if (resp.ok) {
        const updatedTodos = user.todos.filter(item => item.id !== taskId);
        const completedTask = user.todos.find(item => item.id === taskId);
        if (completedTask) {
          // Actualiza el estado con la tarea marcada "completada"
          setUser(prevUser => ({
            ...prevUser,
            todos: updatedTodos,
            completed: [...prevUser.completed, completedTask]
          }));
        } else {
          // Si no se encuentra la tarea, vuelve a obtener el usuario para actualizar los datos
          await getUser();
        }
      }
    });
  }

  return (
    <div className="container">
      <div className='todo'>
        <h1>
          <input type="text" placeholder="Add List Title" />
        </h1>
        <div>
          <input type="text" placeholder="Add your tasks"
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && validateTask(e.target.value)}
            value={InputValue} />
        </div>
        <ul>
          {
            user.todos && user.todos.map((item) =>
              <li key={item.id}>{item.label}
                <FontAwesomeIcon className="deleteIcon" icon={faX}
                  onClick={() => deleteTask(item.id)} />
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
            user.completed && user.completed.map((item) =>
              <li key={item.id}>{item.label}
                <FontAwesomeIcon className="deleteIcon" icon={faX}
                  onClick={() => deleteTask(item.id)} />
              </li>)
          }
        </ul>
      </div>
      <div className="tasks pt-2"> {user.todos.length ?
        <b> Have {user.todos.length} tasks</b> :
        <b>Don't have any task</b>}
      </div>
    </div>
  );
};
export default Home;