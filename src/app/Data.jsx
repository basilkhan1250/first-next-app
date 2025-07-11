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
    const [todos, setTodos] = useState([]);
    const [editId, setEditId] = useState(null);

    const handleTodo = async (e) => {
        e.preventDefault();

        if (!input.trim()) {
            alert("Please enter something");
            return;
        }

        try {
            if (editId) {
                await updateDoc(doc(db, "todos", editId), {
                    task: input,
                    timestamp: new Date(),
                });
                setTodos((prevData) =>
                    prevData.map((data) =>
                        data.id === editId ? { ...data, task: input, timestamp: new Date() } : data
                    )
                )
                setEditId(null);
            } else {
                // ✅ Add to Firebase
                const docRef = await addDoc(collection(db, "todos"), {
                    task: input,
                    timestamp: new Date(),
                });

                // ✅ Add to local list immediately
                setTodos((prev) => [
                    { id: docRef.id, task: input, timestamp: new Date() },
                    ...prev,
                ]);
            }

            setInput("");
            fetchTodos();

        } catch (error) {
            console.error("Error adding/updating todo:", error);
        }
    };

    const fetchTodos = async () => {
        try {
            const order = query(collection(db, "todos"), orderBy("timestamp", "desc"));
            const snapshot = await getDocs(order);
            const todoList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTodos(todoList);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "todos", id));
            fetchTodos();
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    const handleUpdate = (todo) => {
        setEditId(todo.id);
        setInput(todo.task);
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>📝 Firebase Todo App</h2>

            <form onSubmit={handleTodo}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your task"
                />
                <button type="submit">{editId ? "Update" : "Add"}</button>
            </form>

            <ul style={{ marginTop: 20 }}>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        {todo.task}
                        <button onClick={() => handleDelete(todo.id)} style={{ marginLeft: 10 }}>
                            ❌ Delete
                        </button>
                        <button onClick={() => handleUpdate(todo)} style={{ marginLeft: 5 }}>
                            ✏️ Edit
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Data;
