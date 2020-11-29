import Form from './components/Form';
import SearchBar from './components/Searchbar';
import ProductList from './components/ProductList';
import './style/App.css';

function App() {
  return (
    <div className="App">
      <SearchBar />
      <Form />
      <ProductList />
    </div>
  );
}

export default App;
