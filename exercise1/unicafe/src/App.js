import { useState } from 'react';

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const increaseGood = () => {
    setGood(good + 1);
  }

  const increaseNeutral = () => {
    setNeutral(neutral + 1);
  }

  const increaseBad = () => {
    setBad(bad + 1);
  }

  return (
    <div>
      <Header text="give feedback" />
      <Button handleClick={increaseGood} text="good" />
      <Button handleClick={increaseNeutral} text="neutral" />
      <Button handleClick={increaseBad} text="bad"/>

      <Header text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
}

const Header = ({ text }) => {
  return (
    <div>
      <h1>{text}</h1>
    </div>
  );
}

const Button = ({ handleClick, text }) => {
  return (
    <span>
      <button onClick={handleClick}>{text}</button>
    </span>
  );
}

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;

  if (good + neutral + bad > 0) {
    return (
      <table>
        <tr>
          <td>good</td>
          <td>{good}</td>
        </tr>
        <tr>
          <td>neutral</td>
          <td>{neutral}</td>
        </tr>
        <tr>
          <td>bad</td>
          <td>{bad}</td>
        </tr>
        <tr>
          <td>all</td>
          <td>{all}</td>
        </tr>
        <tr>
          <td>average</td>
          <td>{Number((good - bad) / all).toFixed(1)}</td>
        </tr>
        <tr>
          <td>positive</td>
          <td>{Number(good / all * 100).toFixed(1) + " %"}</td>
        </tr>
      </table>
    )
  }

  return (
    <div>
      <p>No feedback given.</p>
    </div>
  )
}

const StatisticLine = ({ text, value }) => {
  return (
    <div>
      <p>{text}: {value}</p>
    </div>
  )
}

export default App;