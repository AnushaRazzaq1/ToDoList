import React, { useState, useEffect } from 'react';
import { Button, message, Input, Modal, Table } from 'antd';

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
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [sorting, setSorting] = useState({ field: 'title', order: 'descend' });

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record)}>Delete</Button>
        </span>
      ),
    },
  ];

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://api.freeapi.app/api/v1/todos');
      if (!response.ok) {
        throw new Error(`Failed to fetch todos. Status: ${response.status}, ${response.statusText}`);
      }
      const responseJSON = await response.json();
      console.log('Fetched data:', responseJSON);
      setTodos(responseJSON.data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      message.error('Failed to fetch todos');
      setTodos([]);
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
      console.log('Added todo:', responseJSON);
      setTodos([...todos, responseJSON?.data]);
      message.success('Todo added successfully');

      setNewTodoTitle('');
      setNewTodoDescription('');
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error adding todo:', error);
      message.error('Failed to add todo');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTodo = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://api.freeapi.app/api/v1/todos?todoId=${editTodoId}`, {
        method: 'PATCH',
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
      setIsModalVisible(false);
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

  const handleEdit = (todo) => {
    setEditTodoId(todo._id);
    setEditedTodoTitle(todo.title);
    setEditedTodoDescription(todo.description);
    setIsModalVisible(true);
  };

  const handleDelete = (todo) => {
    setTodoToDelete(todo);
    setDeleteConfirmationVisible(true);
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

      <Table
        columns={columns}
        dataSource={todos}
        loading={isLoading}
        pagination={pagination}
        onChange={(pagination, filters, sorter) => {
          setPagination(pagination);
          if (sorter.field) {
            const sortedData = todos.slice().sort((a, b) => {
              const isAscend = sorter.order === 'ascend';
              if (a[sorter.field] < b[sorter.field]) {
                return isAscend ? -1 : 1;
              }
              if (a[sorter.field] > b[sorter.field]) {
                return isAscend ? 1 : -1;
              }
              return 0;
            });
            setTodos(sortedData);
          } else {
            setSorting({ field: "title", order: "descend" });
          }
        }}
        sortDirections={['ascend', 'descend']}
      />

    </div>
  );
};

export default TodoList;
