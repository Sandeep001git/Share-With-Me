// import { useState } from 'react'
import CreateUser from "./home/CreateUser.jsx";
import Loading from "./home/Loading.jsx";
import Container from "./container/ContainerComponent.jsx";
import KeyPanel from "./home/KeyPanel.jsx";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Container>
      <CreateUser />
      <Loading />
      <KeyPanel/>
    </Container>
  );
}

export default App;
