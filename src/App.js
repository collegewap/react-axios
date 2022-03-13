import { Card } from "@blueprintjs/core";
import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [persons, setPersons] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  return (
    <div className="App">
      <Card>
        <table class="bp3-html-table .modifier">
          <thead>
            <tr>
              <th>Name</th>
              <th>Job Title</th>
            </tr>
          </thead>
          <tbody>
            {persons.map((person) => {
              return (
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td>{person.jobTitle}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default App;
