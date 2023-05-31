import "./styles/styles.css";
import HomeScreen from "./Components/HomeScreen";
import Header from "./Components/Header";
import { HelpdeskProvider } from "./ChatContext";

function App() {
  return (
    <div className="app">
      <HelpdeskProvider>
        <Header />
        <HomeScreen />
      </HelpdeskProvider>
    </div>
  );
}

export default App;
