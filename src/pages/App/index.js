import { useEffect, useState } from "react";
import useSound from "use-sound";

import "./index.css";

import Replay from "../../assets/replay.svg";
import MoreTime from "../../assets/more_time.svg";
import Menu from "../../assets/ellipsis-v-solid.svg";
import Add from "../../assets/add_circle_outline_black.svg";
import Brain from "../../assets/brain-solid.svg";
import Send from "../../assets/paper-plane-solid.svg";
import Close from "../../assets/times-circle-regular.svg";
import Check from "../../assets/check-circle-regular.svg";
import Incomplete from "../../assets/clock-regular.svg";
import CheckSolid from "../../assets/check-solid.svg";
import Trash from "../../assets/trash-solid.svg";

import Click from "../../assets/audios/click.mp3";
import Alarm from "../../assets/audios/alarm.mp3";

import NavBar from "../../components/NavBar";

function App() {
  const [newTask, setnewTask] = useState({
    title: "",
    done: false,
  });

  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );

  const [selectedTask, setSelectedTask] = useState(
    JSON.parse(localStorage.getItem("selectedTask")) || ""
  );

  const [clock, setClock] = useState({
    minutes: 25,
    seconds: 0,
  });

  const [progress, setProgress] = useState({
    current: "pomodoro",
    pomodoros: 0,
    breaks: 0,
    longBreaks: 0,
  });

  const [showTaskForm, setShowTaskForm] = useState(false);

  const [start, setStart] = useState(false);

  const [clickSound] = useSound(Click);
  const [alarmSound] = useSound(Alarm);

  const startTimer = () => {
    if (clock.minutes === 0 && clock.seconds === 0) {
      alarmSound();
      if (progress.current === "pomodoro") {
        setProgress({ ...progress, pomodoros: progress.pomodoros++ });
        if (progress.pomodoros !== 0 && progress.pomodoros % 3 === 0) {
          changeTimer(15, "longBreak");
        } else {
          changeTimer(5, "break");
        }
      }
      if (progress.current === "break") {
        setProgress({ ...progress, breaks: progress.breaks++ });
        changeTimer(25, "pomodoro");
      }
      if (progress.current === "longBreak") {
        setProgress({ ...progress, longBreaks: progress.longBreaks++ });
        changeTimer(25, "pomodoro");
      }
      setStart(!start);
    } else if (clock.seconds === 0) {
      setClock({ minutes: clock.minutes - 1, seconds: 59 });
    } else {
      setClock({ ...clock, seconds: clock.seconds - 1 });
    }
  };

  const restartTimer = () => {
    if (start) {
      setStart(!start);
    }
    setClock({ minutes: 25, seconds: 0 });
  };

  const changeTimer = (minutes, type) => {
    if (start) {
      setStart(!start);
    }
    setClock({ minutes, seconds: 0 });
    setProgress({ ...progress, current: type });
  };

  useEffect(() => {
    document.title = `${
      clock.minutes < 10 ? "0" + clock.minutes : clock.minutes
    }:${
      clock.seconds < 10 ? "0" + clock.seconds : clock.seconds
    } - ${selectedTask}`;

    store("tasks", tasks);
    store("selectedTask", selectedTask);
    if (start) {
      const timerId = setInterval(() => startTimer(), 1000);
      return () => clearInterval(timerId);
    }
  });

  const store = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  function TaskList(props) {
    const tasks = props.tasks;
    const listItems = tasks.map((task) => (
      <div className="task" key={task.title}>
        <div />
        <div onClick={() => setSelectedTask(task.title)}>
          <img src={task.done ? Check : Incomplete} alt="check" />
          <span>{task.title}</span>
        </div>
        <div></div>
      </div>
    ));
    return <ul>{listItems}</ul>;
  }

  function deleteTask(title) {
    let taskList = [];
    for (let index = 0; index < tasks.length; index++) {
      if (tasks[index].title !== title) {
        taskList.push(tasks[index]);
      }
    }
    setTasks(taskList);
    setSelectedTask(taskList.length !== 0 ? taskList[0].title : "");
  }

  function completeTask(title) {
    let taskList = tasks;
    for (let index = 0; index < taskList.length; index++) {
      if (taskList[index].title === title) {
        taskList[index] = { ...tasks[index], done: true };
      }
    }
    setTasks(taskList);
    setSelectedTask("");
  }

  return (
    <>
      <div className="container">
        <NavBar />
        <div className="pomodoro">
          <section className="timer">
            <div className="timer-options">
              <div>
                <h3 onClick={() => changeTimer(25, "pomodoro")}>Pomodoro</h3>
                <h6>{progress.pomodoros}</h6>
                <h3 onClick={() => changeTimer(5, "break")}>Break</h3>
                <h6>{progress.breaks}</h6>
                <h3 onClick={() => changeTimer(15, "longBreak")}>Long Break</h3>
                <h6>{progress.longBreaks}</h6>
              </div>
              <div>
                <img src={Replay} alt="replay" onClick={restartTimer}></img>
                <img src={MoreTime} alt="more time"></img>
                <img src={Menu} alt="menu"></img>
              </div>
            </div>
            <div className="stopwatch">
              <h1>
                {clock.minutes < 10 ? "0" + clock.minutes : clock.minutes}:
                {clock.seconds < 10 ? "0" + clock.seconds : clock.seconds}
              </h1>
              <button
                onClick={() => {
                  setStart(!start);
                  clickSound();
                }}
                className={
                  start ? "stopwatch-button-stop" : "stopwatch-button-focus"
                }
              >
                <h2>{start ? "Stop" : "Focus"}</h2>
              </button>
            </div>
          </section>
          <section className="task-panel">
            <div onClick={() => setShowTaskForm(!showTaskForm)}>
              <img src={Add} alt="add"></img>
              <h3>Add new task</h3>
            </div>
            <div>
              <img src={Brain} alt="brain"></img>
              <h3>Focusing on: </h3>
              <span>{selectedTask}</span>
              <section>
                <img
                  onClick={() => completeTask(selectedTask)}
                  src={CheckSolid}
                  alt="check"
                ></img>
                <img
                  onClick={() => deleteTask(selectedTask)}
                  src={Trash}
                  alt="trash"
                ></img>
              </section>
            </div>
          </section>
          {showTaskForm ? (
            <section className="task-form">
              <input
                type="text"
                placeholder="My task..."
                value={newTask.title}
                onChange={(e) =>
                  setnewTask({ ...newTask, title: e.target.value })
                }
              />
              <div>
                <img
                  src={Send}
                  alt="send"
                  onClick={() => {
                    setTasks([...tasks, newTask]);
                    setShowTaskForm(!showTaskForm);
                    setnewTask({ ...newTask, title: "" });
                  }}
                />

                <img
                  src={Close}
                  draggable="false"
                  alt="close"
                  onClick={() => setShowTaskForm(!showTaskForm)}
                />
              </div>
            </section>
          ) : null}
          <section>
            <TaskList tasks={tasks} />
          </section>
        </div>
      </div>
    </>
  );
}

export default App;
