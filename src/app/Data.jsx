'use client';

import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
    deleteDoc,
    updateDoc,
    doc
} from "firebase/firestore";


const Data = () => {
    const [input, setInput] = useState("");
    const [todos, setTodos] = useState([])
    const [editId, setEditId] = useState(null)

    const handleTodo = async (e) => {
        e.preventDefault();

        if (!input.trim()) {
            alert("Please enter something");
            return;
        }

        try {
            if (editId) {

                await addDoc(collection(db, "todos", editId), {
                    task: input,
                    timestamp: new Date(),
                });
                setEditId(null)
            }
            else {
                await addDoc(collection(db, "todos"), {
                    task: input,
                    timestamp: new Date()
                })
            }

            console.log("Todo added!");
            setInput("");
            fetchTodos()
        } catch (error) {
            console.error("Error adding todo:", error);
            alert("Error: " + error.message);
        }
    };

    const fetchTodos = async () => {
        try {
            const order = query(collection(db, "todos"), orderBy("timestamp", "desc"))
            const snapShot = await getDocs(order)
            const todoList = snapShot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }))
            setTodos(todoList)
        } catch (error) {
            console.error("Error fetching Todo", error)
        }
    }

    useEffect(() => {
        fetchTodos()
    }, [])


    const handleDelete = async (id) => {
        console.log("delete")
        try {
            const del = deleteDoc(doc(db, "todos", id))
            fetchTodos()
        } catch (error) {
            console.error("Error removing document:", error)
        }
    }

    const handleUpdate = () => {
        console.log("update")
        setEditId(todos.id)
        setTodos(todos.task)
    }



    return (
        <>
            <div style={{ padding: 20 }}>
                <h2>📝 Firebase Todo App</h2>

                <form onSubmit={handleTodo}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter your task"
                    />
                    <button type="submit">Submit</button>
                </form>

                <ul style={{ marginTop: 20 }}>
                    {todos.map((todo) => (
                        <li key={todo.id}>{todo.task}
                            <button onClick={handleDelete}>delete</button>
                            <button onClick={handleUpdate}>Update</button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Data;
