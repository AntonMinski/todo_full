import React, {useEffect, useState, useContext, useCallback} from "react";

import AuthContext from '../../store/auth-context'; 
import { GetTasks, addTask, completeTask, deleteTask } from "../../api/task.api";

import TaskItem from '../Task/TaskItem'
import AddTask from '../Task/AddTask'
import FilterTask from "../Task/FilterTask";

import classes from './StartingPageContent'


const StartingPageContent = () => {
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  
  const [tasks, setTasks] = useState([]);
  const [searchResults, setSearchResults] = React.useState([]);  // for filter, sending it in props later
  
  useEffect(() => {
    getTasks()
  }, []);

  const getTasks = useCallback(() => {
    GetTasks(token)
    .then(response => { 
      setTasks(response.data);
    })
    .catch(err => console.log(err));
  }, []); 

 
  const handleSaveTodo = (e, formData) => {
    e.preventDefault()
    addTask(formData, token)
    .then(({ status, data }) => {
     if (status !== 201) {
       throw new Error('Error! Task not saved')
     }
     getTasks();
   })
   .catch((err) => console.log(err))
 }

 const hadleComplteteTask = (id) => {
  completeTask(id, token)
  .then(({ status, data }) => {
      if (status !== 200) {
        throw new Error('Error! Todo not updated')
      }
      getTasks();
    })
    .catch((err) => console.log(err))
}

const handleDeleteTask = (id) => {
  deleteTask(id, token)
  .then(({ status, data }) => {
      if (status !== 200) {
        throw new Error('Error! Todo not deleted')
      }
      getTasks();
    })
    .catch((err) => console.log(err))
}

  // if search input are empty, not filter anything:
  let filtered_tasks;
  if (searchResults.length > 0) {
     filtered_tasks = searchResults;
     }
  else { filtered_tasks = tasks }

  return (
    <div className='App'>
        <FilterTask tasks={tasks} searchResults={searchResults} setSearchResults={setSearchResults} />
      <AddTask saveTodo={handleSaveTodo} />
      {filtered_tasks.map((task) => (
        <TaskItem
          key={task.id}
          updateTodo={hadleComplteteTask}
          deleteTodo={handleDeleteTask}
          todo={task}
        />
      ))}
    </div>
  )

};

export default StartingPageContent;





