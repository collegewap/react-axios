import {
  Card,
  Button,
  EditableText,
  Toaster,
  Position,
  InputGroup,
  Spinner,
} from "@blueprintjs/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const AppToaster = Toaster.create({
  position: Position.TOP,
});

function App() {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState();
  const [loading, setLoading] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState();
  useEffect(() => {
    setLoading(true);
    axios
      // .get("http://localhost:8001/persons")
      .get("https://mock.codes/500")
      .then((response) => {
        setPersons(response.data);
      })
      .catch((error) => {
        console.log({ error });
        AppToaster.show({
          message: "Unable to load data, Something went wrong!",
          intent: "danger",
          timeout: 3000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onChangeHandler = (id, key, value) => {
    setPersons((values) => {
      return values.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      );
    });
  };

  const updateData = (id) => {
    const data = persons.find((item) => item.id === id);
    axios.put(`http://localhost:8001/persons/${id}`, data).then((response) => {
      AppToaster.show({
        message: "Data updated successfully",
        intent: "success",
        timeout: 3000,
      });
    });
  };

  const deleteData = (id) => {
    axios.delete(`http://localhost:8001/persons/${id}`).then((response) => {
      setPersons((values) => {
        return values.filter((item) => item.id !== id);
      });

      AppToaster.show({
        message: "Data deleted successfully",
        intent: "success",
        timeout: 3000,
      });
    });
  };

  const addPerson = () => {
    if (newName?.trim() && newJobTitle?.trim()) {
      axios
        .post("http://localhost:8001/persons", {
          id: uuidv4(),
          name: newName.trim(),
          jobTitle: newJobTitle.trim(),
        })
        .then((response) => {
          setPersons([...persons, response.data]);
          setNewName("");
          setNewJobTitle("");
        });
    }
  };

  return (
    <div className="App">
      {loading ? (
        <div className="spinner">
          <Spinner />
        </div>
      ) : (
        <Card>
          <table className="bp3-html-table .modifier">
            <thead>
              <tr>
                <th>Name</th>
                <th>Job Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {persons.map((person) => {
                return (
                  <tr key={person.id}>
                    <td>
                      <EditableText
                        value={person.name}
                        onChange={(value) =>
                          onChangeHandler(person.id, "name", value)
                        }
                      />
                    </td>
                    <td>
                      <EditableText
                        value={person.jobTitle}
                        onChange={(value) =>
                          onChangeHandler(person.id, "jobTitle", value)
                        }
                      />
                    </td>
                    <td>
                      <Button
                        intent="primary"
                        onClick={() => updateData(person.id)}
                      >
                        Update
                      </Button>
                      &nbsp;
                      <Button
                        intent="danger"
                        onClick={() => deleteData(person.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <InputGroup
                    placeholder="Add name here..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </td>
                <td>
                  <InputGroup
                    placeholder="Add job title here..."
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                  />
                </td>
                <td>
                  <Button intent="success" onClick={() => addPerson()}>
                    Add Person
                  </Button>
                </td>
              </tr>
            </tfoot>
          </table>
        </Card>
      )}
    </div>
  );
}

export default App;
