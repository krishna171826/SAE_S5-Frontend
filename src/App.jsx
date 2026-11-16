
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RecommendationsPage from './pages/RecommendationsPage';
import Questionnaire from './pages/Questionnaire';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Questionnaire />} />
        <Route path="/recommendations/:id" element={<RecommendationsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
