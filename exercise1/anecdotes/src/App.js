import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  let randomInt = Math.floor(Math.random() * anecdotes.length)
  const [selected, setSelected] = useState(randomInt)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  const handleRandom = () => {
    randomInt = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomInt);
  }

  const votesCopy = [...votes];
  const handleVote = () => {
    votesCopy[selected] += 1;
    setVotes(votesCopy);
  }

  const mostVotes = () => {
    return anecdotes[votes.indexOf(Math.max(...voteslog))];
  }

  return (
    <div>
      <h1>
        Anecdote of the day
      </h1>
      <p>
        {anecdotes[selected]}
      </p>
      <p>
        {votesCopy[selected]}
      </p>
      <div>
        <button onClick={handleRandom}>next anecdote</button>
        <button onClick={handleVote}>vote</button>
      </div>
      <h1>
        Anecdote with most votes
      </h1>
      <p>
        {mostVotes()}
      </p>
    </div>
  );
}

export default App