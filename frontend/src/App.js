import './App.css';
import {Route} from 'react-router-dom'
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage';
import { useColorMode } from '@chakra-ui/react';

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <div className={`App ${colorMode !== 'light' ? 'bg-light' : 'bg-dark'}`}>
      <Route path='/' component={Homepage} exact/>
      <Route path='/chats' component={ChatPage}/>
    </div>
  );
}

export default App;
