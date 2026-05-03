import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'; // Added Authenticator here

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { signOut, user } = useAuthenticator(); // You can also grab 'user' to show their name

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
    return () => subscription.unsubscribe();
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      client.models.Todo.create({ content });
    }
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    /* The Authenticator component handles the login state for you */
    <Authenticator>
      {({ signOut, user }) => (
        <main style={{ padding: '2rem' }}>
          <h1>{user?.signInDetails?.loginId}'s Todos</h1>
          <button onClick={createTodo}>+ New Task</button>
          
          <ul>
            {todos.map((todo) => (
              <li 
                onClick={() => deleteTodo(todo.id)} 
                key={todo.id} 
                style={{ cursor: 'pointer', margin: '10px 0' }}
              >
                {todo.content} (click to delete)
              </li>
            ))}
          </ul>

          <button 
            onClick={signOut} 
            style={{ marginTop: '20px', backgroundColor: '#f44336', color: 'white', border: 'none', padding: '10px' }}
          >
            Sign Out
          </button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;