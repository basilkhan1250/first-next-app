'use client';

import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { addDoc, collection, getDocs, orderBy, query } from "firebase/firestore";

const Data = () => {
    const [input, setInput] = useState("");
    const [todos, setTodos] = useState([])

    const handleTodo = async (e) => {
        e.preventDefault();

        if (!input.trim()) {
            alert("Please enter something");
            return;
        }

        try {
            await addDoc(collection(db, "todos"), {
                task: input,
                timestamp: new Date(),
            });
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


    const handleDelete = () => {
        console.log("delete")
    }

    const handleUpdate = () => {
        console.log("update")
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
