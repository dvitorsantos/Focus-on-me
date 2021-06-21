import { useEffect, useState } from "react";

import "./index.css";

import NavBar from "../../components/NavBar";

function App() {
  const [newTask, setnewTask] = useState({
    title: "",
    pomoQuantity: 1,
    done: false,
  });

  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );

  const store = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  useEffect(() => {
    store("tasks", tasks);
  });

  return (
    <>
      <div className="container">
        <NavBar />
      </div>
      <h1>newTask</h1>
      <h2>{JSON.stringify(tasks)}</h2>
      <h3>{}</h3>
      <h3>{typeof tasks}</h3>
      <input
        type="text"
        value={newTask.title}
        onChange={(e) => setnewTask({ ...newTask, title: e.target.value })}
      ></input>
      <button
        onClick={() => {
          setTasks([...tasks, newTask]);
        }}
      >
        ADD
      </button>
      <button onClick={() => setTasks([])}>DELETE</button>
    </>
  );
}

export default App;
