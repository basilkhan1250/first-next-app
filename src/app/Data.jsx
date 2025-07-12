'use client';

import { useEffect, useState } from "react";
import { db, auth } from "../../firebaseConfig";
import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
    deleteDoc,
    updateDoc,
    doc,
    where
} from "firebase/firestore";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "firebase/auth";

const Data = () => {
    const [input, setInput] = useState("");
    const [todos, setTodos] = useState([]);
    const [editId, setEditId] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchTodos(currentUser.uid);
            } else {
                setUser(null);
                setTodos([]);
            }
        });

        return () => unSubscribe();
    }, []);

    const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleTodo = async (e) => {
        e.preventDefault();

        if (!input.trim()) {
            alert("Please enter something or make sure you are logged in");
            return;
        }

        try {
            if (editId) {
                await updateDoc(doc(db, "todos", editId), {
                    task: input,
                    timestamp: new Date()
                });
                setTodos((prevData) =>
                    prevData.map((data) =>
                        data.id === editId
                            ? { ...data, task: input, timestamp: new Date() }
                            : data
                    )
                );
                setEditId(null);
            } else {
                const docRef = await addDoc(collection(db, "todos"), {
                    task: input,
                    timestamp: new Date(),
                    userId: user.uid
                });

                setTodos((prev) => [
                    { id: docRef.id, task: input, timestamp: new Date(), userId: user.uid },
                    ...prev
                ]);
            }

            setInput("");
        } catch (error) {
            console.error("Error adding/updating todo:", error);
        }
    };

    const fetchTodos = async (uid) => {
        try {
            const userTodoQuery = query(
                collection(db, "todos"),
                where("userId", "==", uid),
                orderBy("timestamp", "desc")
            );
            const snapshot = await getDocs(userTodoQuery);
            const todoList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setTodos(todoList);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "todos", id));
            setTodos((prev) => prev.filter((todo) => todo.id !== id));
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
            <h2>📝 Firebase Todo App (Per User)</h2>

            {!user ? (
                <>
                    <p>Please login to view and manage your todos.</p>
                    <button onClick={handleLogin}>Sign in with Google</button>
                </>
            ) : (
                <>
                    <p>Yokoso, {user.displayName} <button onClick={handleLogout}>Logout</button></p>

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
                </>
            )}
        </div>
    );
};

export default Data;
