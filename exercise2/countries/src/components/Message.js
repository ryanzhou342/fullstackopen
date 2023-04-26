const Message = ({ message }) => {
  if (message == null) {
    return null;
  }

  return (
    <div>
      {message}
    </div>
  )
}

export default Message;