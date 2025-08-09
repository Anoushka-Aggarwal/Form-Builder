import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateForm from "./pages/CreateForm";
import PreviewForm from "./pages/PreviewForm";
import MyForms from "./pages/MyForms";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/create" element={<CreateForm />} />
        <Route path="/preview" element={<PreviewForm />} />
        <Route path="/myforms" element={<MyForms />} />
        <Route path="*" element={<CreateForm />} /> {/* fallback */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
