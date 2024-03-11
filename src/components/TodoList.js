import React, { useState, useEffect } from 'react';
import { Button, message, List, Input, Modal } from 'antd';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editTodoId, setEditTodoId] = useState('');
  const [editedTodoTitle, setEditedTodoTitle] = useState('');
  const [editedTodoDescription, setEditedTodoDescription] = useState('');
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://api.freeapi.app/api/v1/todos');
      if (!response.ok) {
        throw new Error(`Failed to fetch todos. Status: ${response.status}, ${response.statusText}`);
      }
      const responseJSON = await response.json();
      console.log('Fetched data:', responseJSON); // Log the fetched data
      setTodos(responseJSON.data || []); // Set todos to an empty array if responseJSON.data is undefined
    } catch (error) { 
      console.error('Error fetching todos:', error);
      message.error('Failed to fetch todos');
      setTodos([]); // Set todos to an empty array in case of error
    } finally {
      setIsLoading(false);
    }
  };
  

  const addTodo = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://api.freeapi.app/api/v1/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: newTodoDescription,
          title: newTodoTitle,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to add todo. Status: ${response.status}, ${response.statusText}`);
      }
      const responseJSON = await response.json();
      console.log('Added todo:', responseJSON); // Log the added todo
      setTodos([...todos, responseJSON?.data]); // Append the new todo to the existing todos list
      message.success('Todo added successfully');
      // Clear input fields after adding todo
      setNewTodoTitle('');
      setNewTodoDescription('');
      setIsModalVisible(false); // Close the modal after adding todo
    } catch (error) {
      console.error('Error adding todo:', error);
      message.error('Failed to add todo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{    //it will log the todos to console whenever it gets changed.
    console.log(todos,"todos")
  },[todos])
  const updateTodo = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://api.freeapi.app/api/v1/todos?todoId=${editTodoId}`, {
        method: 'PATCH',  //to apply partial updates to a resource. PUT method is used to update or replace resource entirely.
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: editedTodoDescription,
          title: editedTodoTitle,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update todo. Status: ${response.status}, ${response.statusText}`);
      }
      const updatedTodoIndex = todos.findIndex(todo => todo._id === editTodoId);
      const updatedTodos = [...todos];
      updatedTodos[updatedTodoIndex] = { ...updatedTodos[updatedTodoIndex], title: editedTodoTitle, description: editedTodoDescription };
      setTodos(updatedTodos);
      message.success('Todo updated successfully');
      setIsModalVisible(false); // Close the modal after updating todo
    } catch (error) {
      console.error('Error updating todo:', error);
      message.error('Failed to update todo');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodo = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://api.freeapi.app/api/v1/todos/${todoToDelete._id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete todo. Status: ${response.status}, ${response.statusText}`);
      }
      const filteredTodos = todos.filter(todo => todo._id !== todoToDelete._id);
      setTodos(filteredTodos);
      message.success('Todo deleted successfully');
      setDeleteConfirmationVisible(false);
    } catch (error) {
      console.error('Error deleting todo:', error);
      message.error('Failed to delete todo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div>
      <h1>Todo List</h1>
      <Button type="primary" onClick={() => setIsModalVisible(true)} loading={isLoading}>
        Add Todo
      </Button>

      <Modal
        title={editTodoId ? "Edit Todo" : "Add Todo"}
        visible={isModalVisible}
        onOk={editTodoId ? updateTodo : addTodo}
        onCancel={() => {
          setIsModalVisible(false);
          setEditTodoId('');
          setEditedTodoTitle('');
          setEditedTodoDescription('');
        }}
      >
        <Input
          placeholder="Enter todo title"
          value={editTodoId ? editedTodoTitle : newTodoTitle}
          onChange={(e) => editTodoId ? setEditedTodoTitle(e.target.value) : setNewTodoTitle(e.target.value)}
        />
        <Input.TextArea
          placeholder="Enter todo description"
          value={editTodoId ? editedTodoDescription : newTodoDescription}
          onChange={(e) => editTodoId ? setEditedTodoDescription(e.target.value) : setNewTodoDescription(e.target.value)}
        />
      </Modal>

      {deleteConfirmationVisible && (
        <Modal
          title="Delete Todo"
          visible={deleteConfirmationVisible}
          onOk={deleteTodo}
          onCancel={() => setDeleteConfirmationVisible(false)}
        >
          <p>Are you sure you want to delete this todo?</p>
        </Modal>
      )}

      {Array.isArray(todos) && todos.length > 0 ? (
        <List
          dataSource={todos}
          loading={isLoading}
          renderItem={(todo) => (
            <List.Item actions={[
              <Button
                key="edit"
                onClick={() => {
                  setEditTodoId(todo._id);
                  setEditedTodoTitle(todo.title);
                  setEditedTodoDescription(todo.description);
                  setIsModalVisible(true);
                }}
              >
                Edit
              </Button>,
              <Button
                key="delete"
                onClick={() => {
                  setTodoToDelete(todo);
                  setDeleteConfirmationVisible(true);
                }}
              >
                Delete
              </Button>,
            ]}>
              {todo.title} - {todo.description}
            </List.Item>
          )}
        />
      ) : (
        <p>No todos available.</p>
      )}
    </div>
  );
};

export default TodoList;
