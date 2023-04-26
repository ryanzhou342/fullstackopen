const Course = ({ course }) => {
    let sum = course.parts.reduce(
      (accumulator, currentValue) => {
        return accumulator + currentValue.exercises;
      }, 0
    );
    
    return (
      <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total sum={sum} />
      </div>
    )
  }

const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p>Number of exercises {sum}</p>

const Part = ({ part }) => 
    <p>
        {part.name} {part.exercises}
    </p>

const Content = ({ parts }) => 
    <>
        {parts.map(part => <Part key={part.id} part={part} />)}
    </>

export default Course;