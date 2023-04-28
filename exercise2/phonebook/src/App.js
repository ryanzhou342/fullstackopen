import axios from 'axios';
import { useState, useEffect } from 'react'
import Filter from "./components/Filter";
import Person from "./components/Person";
import PersonForm from "./components/PersonForm";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [addedMessage, setAddedMessage] = useState(null);

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      });
  }, [])
  
  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber
    };

    for (const person of persons) {
      if (person.name === personObject.name) {
        if (window.confirm(`${person.name} is already added to phonebook, replace the old number with the new one?`)) {
          axios
            .put(`http://localhost:3001/api/persons/${person.id}`, { ...person, number: newNumber })
            .then(response => {
              setPersons(persons.map(p => p.name !== newName ? p : response.data));
            })
        }
        
        setNewName("");
        setNewNumber("");
        return;
      }
    }

    personService
      .create(personObject)
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson));
        setAddedMessage(`Added ${createdPerson.name}`);
        setTimeout(() => {
          setAddedMessage(null)
        }, 5000)
        setNewName("");
        setNewNumber("");
      })
  }

  const deletePerson = (id) => {
    if (window.confirm()) {
      axios.delete(`http://localhost:3001/api/persons/${id}`);
      setPersons(persons.filter(person => person.id !== id));
    }
  }
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  }

  let personsToShow = persons;
  if (searchTerm) {
    personsToShow = persons.filter(person => person.name.toLowerCase().includes(searchTerm));
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={addedMessage} />
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm newName={newName} newNumber={newNumber} addPerson={addPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      {personsToShow.map(person => 
        <Person key={person.id} number={person.number} name={person.name} deletePerson={() => deletePerson(person.id)}/>
      )}
    </div>
  )
}

export default App