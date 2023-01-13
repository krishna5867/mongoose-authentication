import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

import { Container, Card, Input, Button } from "reactstrap";

const TodoList = () => {
  const [todo, setTodo] = useState([]);
  const [page, setPage] = useState(0);
  const [isCompleted, setIscompleted] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('New');


  // getTodos
  const fetchTodosData = async () => {
    const res = await axios.get(`/getTodos?page=${page}`);
    if (res.status === 200) {
      setTodo(res.data.todo);
    } else {
      console.log("something went wrong");
    }
  };

  useEffect(() => {
    fetchTodosData();
  }, [page,todo]);

  const handleEdit = async (todo) => {
    const todoTitle = prompt("Enter new Title");
    const todoTask = prompt("Enter new Task");

    if (!todoTitle || !todoTask) {
      alert("Please enter both field");
    } else {
      const res = await axios.put(`/editTodo/${todo._id}`, {
        ...todo,
        title: todoTitle,
        tasks: todoTask,
      });
      console.log(res);
      fetchTodosData();
    }
  };

  const handleDelete = async (todoId) => {
    const canDelete = window.confirm("Are your Sure?");
    if (canDelete) {
      const res = await axios.delete(`/deleteTodo/${todoId}`);
      console.log(res);
      fetchTodosData();
    }
  };

  const handleSearch = async ()=>{
    const res = await axios.get(`/searchTodo?search=${search}`)
    if(res.status === 200){
      setTodo(res.data.todo)
    }else{
      console.log("Searching Fail");
    }
  }

  const handleIscompleted =  async () => {
    setIscompleted(!isCompleted);

  };

  const handleSort = (curr)=>{
  if (sort === "New"){
    const sorted = todo.sort((a,b)=>a[curr]?.title > b[curr]?.title ? 1 : -1);
    console.log(sorted);
    setTodo(sorted);
    setSort("New")
  }
  };

  return (
    <>
    <p>Hello{isCompleted}</p>
    <div className="d-flex justify-content-between mt-3 mx-3">
    <div className="d-flex">
      <Input type="text" placeholder='Search Todo' value={search} name={search} style={{width:'30rem'}} onChange={(e)=>setSearch(e.target.value)} />
      <Button className="btn btn-success mx-3" onClick={handleSearch}>Search</Button>
    </div>
      <div className="dropdown mx-2">
        <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <b>  Sort Todos </b>
        </button>
        <ul className="dropdown-menu">
          <li><a className="dropdown-item" href="#" onClick={()=>handleSort("New")}>New</a></li>
          <li><a className="dropdown-item" href="#" onClick={()=>handleSort("Old")}>Old</a></li>
        </ul>
      </div>
    </div>
      <Container className="mt-3">
        <Card className="border border-2 border-warning">
          {/* <CardBody> */}
          <div className="d-flex justify-content-between px-2 mb-4 mt-2">
            <div>
              <h3>Status</h3>
            </div>
            <div>
              <h3>Title</h3>
            </div>
            <div>
              <h3>Task</h3>
            </div>
            <div>
              <h3>Action</h3>
            </div>
          </div>
          {/* </CardBody> */}
        </Card>

      </Container>
      {
        todo && todo.length > 0 ? (
          todo
          // .filter((item)=>{ return item.title.toLowerCase().includes(search.toLowerCase())
          //   || item.tasks.toLowerCase().includes(search.toLowerCase())})
          .map((todo) => (
            <>
              <Container key={todo._id}>
                <Card className="border border-2 border-warning mt-1">
                  {/* <CardBody> */}
                  <div className="d-flex justify-content-between px-2 mt-2" key={todo._id}>
                    <div>
                      <input className="form-check-input" type="checkbox" id="flexCheckChecked" onChange={handleIscompleted} />
                    </div>
                    <div className="mt-2">
                      <h4>{todo.title}</h4>
                    </div>
                    <div className="mt-2">
                      <h4>{todo.tasks}</h4>
                    </div>
                    <div>
                    {/* <button
                        className="btn btn-success sm:col-12 mx-1">
                        {isCompleted}
                      </button> */}
                      <button
                        className="btn btn-secondary sm:col-12 mx-1"
                        onClick={() => handleEdit(todo)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger sm:col-12"
                        onClick={() => handleDelete(todo._id)}
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                  {/* </CardBody> */}
                </Card>
              </Container>
            </>
          ))
        ) : (
          <Container style={{ width: "18rem" }}>
            <Card className="border border-2 border-warning mt-2 text-center">No data to todos, add one!</Card>
          </Container>
        )
      }
      <div className='border border-danger fixed-bottom'>
        <nav aria-label="..." className="d-flex justify-content-end fixed-bottom mx-5">
          <ul className="pagination">
            <li className="page-item">
              <btn className="page-link btn" onClick={() => setPage(page - 1)}>Previous</btn>
            </li>
            <li className="page-item">
              <btn className="page-link btn" onClick={() => setPage(page + 1)}>Next</btn>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default TodoList;
