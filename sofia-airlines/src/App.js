import './App.css';
import AnimatedRoutes from './Components/AnimatedRoutes';
import { MemoryRouter as Router } from 'react-router-dom';

import ScrollToTop from './Components/ScrollToTop';

function App() {
  return (
    <div className='App'>
      <Router basename={window.location.pathname}>
        <ScrollToTop />
        <AnimatedRoutes/>
      </Router>
    </div>
  )
}

export default App;
