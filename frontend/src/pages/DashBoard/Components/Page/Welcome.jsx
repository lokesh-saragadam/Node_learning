function Welcome({ username }) {
  return (
    <div className="welcome">
      <h1>Hello, welcome back {username} 👋</h1>
      <p> Here's your progress so far. Keep going and stay consistent!</p>
    </div>
  );
}

export default Welcome;