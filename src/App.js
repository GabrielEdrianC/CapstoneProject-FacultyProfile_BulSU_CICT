import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Admin from './Components/Admin/Login'
import Add from './Components/Add/Add';
import SignIn from './Components/SignIn/SignIn';
import Flip from './Components/Flip/Flip';
import Flipp from './Components/Flipp/Flipp';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path ="/" element={<Flip/>}/>
          <Route path ="/FlipAdmin" element={<Flipp/>}/>
          <Route path ="/add" element={<Add/>}/>
         <Route path ="/signin" element={<SignIn/>}/>
         <Route path ="/Login" element={<Admin/>}/>
         </Routes>
      </Router>
    </div>
  );
}

export default App;
