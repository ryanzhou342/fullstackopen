const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body)
});

app.use(express.static("build"));
app.use(cors());
app.use(express.json());
app.use(morgan("tiny", {
  skip: function (req, res) {
    return req.method === "POST"
  }
}));

app.use(morgan(":method :url :status :res[content-length] - response-time ms :body", {
  skip: function (req, res) {
    return req.method !== "POST"
  }
}));

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
})

app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date().toString()}</p>`);
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);
  
  if (person) {
    response.json(person);
  } else {
    response.statusMessage = `Cannot find person with id ${id}`;
    response.status(404).end();
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
})

app.post("/api/persons", (request, response) => {
  const body = request.body;
  
  if (!body.name) {
    return response.status(400).json({
      "error": "name missing"
    })
  }
  if (!body.number) {
    return response.status(400).json({
      "error": "number missing"
    })
  }

  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({
      "error": "name must be unique"
    })
  }

  person = {
    "id":  Math.floor(Math.random() * Number.MAX_SAFE_INTEGER + 1),
    "name": body.name,
    "number": body.number
  }

  persons = persons.concat(person);
  response.json(person);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});