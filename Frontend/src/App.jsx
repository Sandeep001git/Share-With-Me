import { Provider } from "react-redux";
import { store } from "./store/Store.js";
import { PeerProvider } from "./peer/Peer.jsx";
import {
    SharingPanel,
    KeyPanel,
    CreateUser,
    Loading,
    FileReceiver,
    ErrorPage
} from "./home/index.js";
import Container from "./container/ContainerComponent.jsx";
import { Routes, Route } from "react-router-dom";

function App() {
    return (
        <PeerProvider>
                    <Provider store={store}>
                        <Container>
                            <Routes>
                                <Route path="/" element={<CreateUser />} />
                                <Route path="/waiting" element={<Loading />} />
                                <Route
                                    path="/receiver"
                                    element={<KeyPanel />}
                                />
                                <Route
                                    path="/sender"
                                    element={<SharingPanel />}
                                />
                                <Route
                                    path="/sharedFile"
                                    element={<FileReceiver />}
                                />
                                <Route
                                    path="/error"
                                    element={<ErrorPage />}
                                />
                            </Routes>
                        </Container>
                    </Provider>
        </PeerProvider>
    );
}

export default App;
