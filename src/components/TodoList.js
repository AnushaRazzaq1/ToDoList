import React, { useState, useEffect } from "react";
import { Button, message, Input, Modal, Table, Layout } from "antd";
import "./TodoList.scss";

const { Header } = Layout;
const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState({
    isVisible: false,
    isEditing: false,
    todo: {
      id: "",
      title: "",
      description: "",
    },
  });
  const [deleteData, setDeleteData] = useState({
    isVisible: false,
    todo: null,
  });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [ setSorting] = useState({ field: "title", order: "descend" });

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
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
      const response = await fetch("https://api.freeapi.app/api/v1/todos");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch todos. Status: ${response.status}, ${response.statusText}`
        );
      }
      const responseJSON = await response.json();
      console.log("Fetched data:", responseJSON);
      setTodos(responseJSON.data || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
      message.error("Failed to fetch todos");
      setTodos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalData({
      ...modalData,
      todo: {
        ...modalData.todo,
        [name]: value,
      },
    });
  };

  const addTodo = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://api.freeapi.app/api/v1/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: modalData.todo.description,
          title: modalData.todo.title,
        }),
      });
      if (!response.ok) {
        throw new Error(
          `Failed to add todo. Status: ${response.status}, ${response.statusText}`
        );
      }
      const responseJSON = await response.json();
      console.log("Added todo:", responseJSON);
      setTodos([...todos, responseJSON?.data]);
      message.success("Todo added successfully");

      setModalData({
        isVisible: false,
        isEditing: false,
        todo: {
          id: "",
          title: "",
          description: "",
        },
      });
    } catch (error) {
      console.error("Error adding todo:", error);
      message.error("Failed to add todo");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTodo = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.freeapi.app/api/v1/todos?todoId=${modalData.todo.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: modalData.todo.description,
            title: modalData.todo.title,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to update todo. Status: ${response.status}, ${response.statusText}`
        );
      }
      const updatedTodoIndex = todos.findIndex(
        (todo) => todo._id === modalData.todo.id
      );
      const updatedTodos = [...todos];
      updatedTodos[updatedTodoIndex] = {
        ...updatedTodos[updatedTodoIndex],
        title: modalData.todo.title,
        description: modalData.todo.description,
      };
      setTodos(updatedTodos);
      message.success("Todo updated successfully");
      setModalData({
        isVisible: false,
        isEditing: false,
        todo: {
          id: "",
          title: "",
          description: "",
        },
      });
    } catch (error) {
      console.error("Error updating todo:", error);
      message.error("Failed to update todo");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodo = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.freeapi.app/api/v1/todos/${deleteData.todo._id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to delete todo. Status: ${response.status}, ${response.statusText}`
        );
      }
      const filteredTodos = todos.filter(
        (todo) => todo._id !== deleteData.todo._id
      );
      setTodos(filteredTodos);
      message.success("Todo deleted successfully");
      setDeleteData({ isVisible: false, todo: null });
    } catch (error) {
      console.error("Error deleting todo:", error);
      message.error("Failed to delete todo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (todo) => {
    setModalData({
      isVisible: true,
      isEditing: true,
      todo: {
        id: todo._id,
        title: todo.title,
        description: todo.description,
      },
    });
  };

  const handleDelete = (todo) => {
    setDeleteData({ isVisible: true, todo });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      <Header className="header">
        <h1 className="header-title">Todo List</h1>
        <Button
          type="primary"
          onClick={() =>
            setModalData({
              isVisible: true,
              isEditing: false,
              todo: { id: "", title: "", description: "" },
            })
          }
          loading={isLoading}
          style={{ backgroundColor: "blue", borderColor: "#1890ff" }}
        >
          Add Todo
        </Button>
      </Header>
      <div className="todo-list-container">
      <Modal
  title={modalData.isEditing ? "Edit Todo" : "Add Todo"}
  visible={modalData.isVisible}
  onOk={modalData.isEditing ? updateTodo : addTodo}
  onCancel={() =>
    setModalData({
      isVisible: false,
      isEditing: false,
      todo: { id: "", title: "", description: "" },
    })
  }
  okButtonProps={{
    style: {
      backgroundColor: '#1677ff', 
      borderColor: '#1677ff',
      boxShadow: '0 2px 0 rgba(5, 145, 255, 0.1)' 
    }
  }}
>
  <Input
    className="todo-form-input"
    placeholder="Enter todo title"
    name="title"
    value={modalData.todo.title}
    onChange={handleInputChange}
  />
  <Input.TextArea
    className="todo-form-input"
    placeholder="Enter todo description"
    name="description"
    value={modalData.todo.description}
    onChange={handleInputChange}
  />
</Modal>
        {deleteData.isVisible && (
          <Modal
            title="Delete Todo"
            visible={deleteData.isVisible}
            onOk={deleteTodo}
            onCancel={() => setDeleteData({ isVisible: false, todo: null })}
            okButtonProps={{
              style: {
                backgroundColor: '#1677ff', 
                borderColor: '#1677ff', 
                boxShadow: '0 2px 0 rgba(5, 145, 255, 0.1)'
              }
            }}
          >
            <p>Are you sure you want to delete this todo?</p>
          </Modal>
        )}
        

        <Table
          className="todo-list-table"
          columns={columns}
          dataSource={todos}
          loading={isLoading}
          pagination={pagination}
          onChange={(pagination, filters, sorter) => {
            setPagination(pagination);
            if (sorter.field) {
              const sortedData = todos.slice().sort((a, b) => {
                const isAscend = sorter.order === "ascend";
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
          sortDirections={["ascend", "descend"]}
        />
      </div>
    </>
  );
};

export default TodoList;
