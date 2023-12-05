import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import "./index.css";
import "./TodoList.css";
import searchIcon from './search-icon.png';

function Todolist() {
  const [itemText, setItemText] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');
  const MAX_TASK_LENGTH = 40;
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');

  const displayMessage = (message) => {
    setMessage(message);
    setTimeout(() => setMessage(''), 1000); // Clear the message after 3 seconds
  };
  
  //add new todo item to database
  const addItem = async (e) => {
    e.preventDefault();
    // Disable form submission and the add button
    setItemText('');
    setIsAdding(true); // Add a state variable `isAdding` to track the loading state
    
    // Check if itemText is empty or only contains whitespace
    if (!itemText.trim() || !/[a-zA-Z]/.test(itemText)) {
      alert("Please enter a task that contains at least one letter");
      setIsAdding(false); // Enable the add button and form submission
      return;
    }
  
    if (itemText.length > MAX_TASK_LENGTH) {
      alert(`Task cannot exceed ${MAX_TASK_LENGTH} characters.`);
      setIsAdding(false); // Enable the add button and form submission
      return;
    }
  
    try {
      const res = await axios.post('https://tasktracc.onrender.com/api/item', { item: itemText });
      setListItems((prev) => [...prev, res.data]); // Update the listItems state with the new item from the server response
      displayMessage('Task added! 🌟'); // Display a cute message when a task is added
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false); // Enable the add button and form submission after the API call is complete
    }
  };

  //Create function to fetch all todo items from database -- we will use useEffect hook
  useEffect(()=>{
    const getItemsList = async () => {
      try{
        const res = await axios.get('https://tasktracc.onrender.com/api/items')
        setListItems(res.data);
        console.log('render')
      }catch(err){
        console.log(err);
      }
    }
    getItemsList()
  },[]);

  // Delete item when click on delete
  const deleteItem = (id) => {
    try {
      // Optimistically update the UI by removing the item immediately
      const newListItems = listItems.filter(item => item._id !== id);
      setListItems(newListItems);
      displayMessage('Task deleted! 😢'); // Display a cute message when a task is deleted
      
      // Send API request to delete the item
      axios.delete(`https://tasktracc.onrender.com/api/item/${id}`)
        .catch((err) => {
          console.error(err);
          // If there is an error, revert the UI to the previous state
          setListItems([...newListItems]);
        });
    } catch (err) {
      console.error(err);
    }
  }
 
  //Update item
  const updateItem = async (e) => {
    e.preventDefault();
    
      // Check if updateItemText is empty or only contains whitespace
      if (!updateItemText.trim() || !/[a-zA-Z]/.test(updateItemText)) {
        alert("Please enter a task that contains at least one letter");
        return;
      }
    
      if (updateItemText.length > MAX_TASK_LENGTH) {
        alert(`Task cannot exceed ${MAX_TASK_LENGTH} characters.`);
        return;
      }
    
      try {
        const res = await axios.put(`https://tasktracc.onrender.com/api/item/${isUpdating}`, { item: updateItemText });
        console.log(res.data);
        const updatedItemIndex = listItems.findIndex(item => item._id === isUpdating);
        const updatedItems = [...listItems];
        updatedItems[updatedItemIndex].item = updateItemText;
        setListItems(updatedItems);
        setUpdateItemText('');
        setIsUpdating('');
        displayMessage('Task updated! 🌟'); // Display a cute message when a task is updated
      } catch (err) {
        console.log(err);
      }
    }
    
  //before updating item we need to show input field where we will create our updated item
  const renderUpdateForm = () => (
    <form className="update-form" onSubmit={(e)=>{updateItem(e)}} >
      <input className="update-new-input" type="text" placeholder="New Item" onChange={e=>{setUpdateItemText(e.target.value)}} value={updateItemText} />
      <button className="update-new-btn" type="submit">Update</button>
    </form>
  )

  // Filter the list based on the search query
  const filteredListItems = listItems ? listItems.filter(item =>
    item.item.toLowerCase().includes(searchQuery.toLowerCase())
  ) : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://tasktracc.onrender.com/api/items');
        setListItems(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleComplete = async (id) => {
    try {
      const updatedItems = listItems ? listItems.map((item) =>
        item._id === id ? { ...item, isCompleted: !item.isCompleted } : item
      ) : null;
      setListItems(updatedItems);
  
      // Make API call to update the completed status on the server (if needed)
      await axios.put(`https://tasktracc.onrender.com/api/item/${id}`, {
        isCompleted: !updatedItems.find((item) => item._id === id).isCompleted,
      });
  
      // Display the message only when a task is marked as complete
      if (updatedItems.find((item) => item._id === id).isCompleted) {
        displayMessage('Great job! Task completed! 🎉');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    // Clear user token from local storage or wherever it's stored
    localStorage.removeItem('userToken');
    // Redirect to your login page
    window.location.href = '/'; // Change '/login' to the actual path of your login page
  };

  return(
    <>
    <div className="logout-button-container">
        <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
    <div className="Todolist">
      <img src='logo192.png' className='book' alt='logo'></img>
      <h1>TASKTRACK TO-DO LIST</h1>
      <form className="form-page-2" onSubmit={e => addItem(e)}>
        <input type="text" placeholder='Add Item...' onChange={e => {setItemText(e.target.value)} } value={itemText} />
        <button type="submit">Add</button>
      </form>
      <div className='hut'>
          <input type="text" placeholder="Search tasks..." className="set" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <button className="search-button"><img src={searchIcon} alt="Search" className="search-icon-img"/></button>
      </div>
      <div className="todo-listItems">
        {filteredListItems ? filteredListItems.map((item) => (
          <div className={`todo-item ${item.isCompleted ? 'completed' : ''}`} key={item._id}>
            <p className={`item-content ${item.isCompleted ? 'completed-task' : ''}`}>{item.item}</p>
            {item.isCompleted ? (
              <button className="undo-complete-button" onClick={() => handleComplete(item._id)}>Undo Complete</button>
            ) : (
              <button className="complete-button" onClick={() => handleComplete(item._id)}>Complete</button>
            )}
            {
              isUpdating === item._id
              ? renderUpdateForm()
              : <>
                  <button className="update-item" onClick={() => { setIsUpdating(item._id) }}>Update</button>
                  <button className="delete-item" onClick={() => { deleteItem(item._id) }}>Delete</button>
                </>
            }
          </div>
          ))
          : <h3>You have no tasks yet</h3>
        }
      {message && <div className="message">{message}</div>}

      </div>
      <ToastContainer/>
    </div>
      </>
  );
}

export default Todolist;
