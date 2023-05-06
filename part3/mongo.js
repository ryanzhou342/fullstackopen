const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url =
  `mongodb+srv://ryanzhou342:${password}@cluster0.oy2x7if.mongodb.net/testNoteApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery",false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const note = new Note({
  content: "what da fack",
  date: new Date(),
  important: true,
});

note.save().then(() => {
  console.log("note saved!");
  mongoose.connection.close();
});

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note);
  });
  mongoose.connection.close();
});