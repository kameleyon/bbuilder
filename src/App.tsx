import { ThemeProvider } from './components/ThemeProvider';
import { AppRoutes } from './components/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;