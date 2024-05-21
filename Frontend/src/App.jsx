/* eslint-disable no-unused-vars */
// import { useState } from 'react'
import CreateUser from "./home/CreateUser.jsx";
import Loading from "./home/Loading.jsx";
import Container from "./container/ContainerComponent.jsx";
import KeyPanel from "./home/KeyPanel.jsx";
import SharingPanel from "./home/SharingPanel.jsx";
import { Routes , Route } from "react-router-dom";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Container>
      <Routes>
          <Route path="/" element={<CreateUser />} />
          <Route path="/waiting" element={<Loading />} />
          <Route path="/reciver" element={<KeyPanel />} />
          <Route path="/sender" element={<SharingPanel />} />
        </Routes>
    </Container>
  );
}

export default App;
