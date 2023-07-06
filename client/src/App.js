import MenuPage from './MenuPage';
import './App.css';
import UserProvider from './UserProvider';

function App() {
  return (
    <div className="App">

      <UserProvider>
        <MenuPage />
      </UserProvider>

    </div>
  );
}

export default App;
