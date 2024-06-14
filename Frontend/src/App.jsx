/* eslint-disable no-unused-vars */
import {
    SharingPanel,
    KeyPanel,
    CreateUser,
    Loading,
    FileReceiver,
} from "./home/index.js";
import Container from "./container/ContainerComponent.jsx";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/Store.js";

function App() {
    return (
        <Provider store={store}>
            <Container>
                <Routes>
                    <Route path="/" element={<CreateUser />} />
                    <Route path="/waiting" element={<Loading />} />
                    <Route path="/reciver" element={<KeyPanel />} />
                    <Route path="/sender" element={<SharingPanel />} />
                    <Route path="/sharedFile" element={<FileReceiver />} />
                </Routes>
            </Container>
        </Provider>
    );
}

export default App;
