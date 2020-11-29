import React, { useEffect, useState } from 'react';
import { useDataLayerValue } from '../context/DataLayer';

const Form = () => {
  const [{ products }, dispatch ] = useDataLayerValue();
  const [ name, setName ] = useState('');
  const [ stockQuantity, setStockQuantity ] = useState();
  const [ unitaryPrice, setUnitaryPrice ] = useState();

  useEffect(() => {
    dispatch({
      type: 'SET_PRODUCT',
      payload: JSON.parse(localStorage.getItem('products')),
    });
  }, []);

  useEffect(() => {
    if(products === []){
      return;
    }

    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  function getID(){
    let result = 1;

    const idArray = products.map(product => product.id).sort((a, b) => a - b);

    if(idArray.length > 0){
      for ( let i = 0;  i < idArray.length; i++ ) {
        if (idArray[i] !== i + 1) {
          result = i + 1;
          break;
        }
        result = idArray.length + 1;
      }
    }

    return result;
  };

  function handleSubmit(event){
    event.preventDefault();

    const id = getID();   

    if(name === '' || !stockQuantity || !unitaryPrice){
      alert('Por favor preencha todos os campos');
      return;
    }

    if(Number(stockQuantity) === 0){
      alert('Valor de estoque deve ser maior que 0');
      setStockQuantity('');
      return;
    }

    const newProduct = {
      id: id,
      name: name,
      stockQuantity: Number(stockQuantity),
      unitaryPrice: Number(unitaryPrice),
      fullPrice: Number(stockQuantity * unitaryPrice),
    };
    
    localStorage.setItem('products', JSON.stringify([...products, newProduct]));
    dispatch({
      type: 'ADD_PRODUCT',
      payload: newProduct,
    });

    setStockQuantity('');
    setUnitaryPrice('');
    setName('');
  }

  function handleNameChange(event){
    setName(event.target.value);
  }

  function handleUnitaryPrice(event){
    if(event.target.value.match(/\d+[,,.]*\d*/g === false)){
      setUnitaryPrice('');
      alert('Insira um número válido');
      return;
    }

    if(event.target.value.match(/\d+,?\d+/g)){
      return setUnitaryPrice(event.target.value.replace(',', '.'));
    }

    if(Number(event.target.value) || event.target.value === ''){
      return setUnitaryPrice(Number(event.target.value));
    }

    setUnitaryPrice('');
    alert('Por favor, indique a quantidade com números');
  }

  function handleStockQuantity(event){
    if(event.target.value.match(/\d+[,,.]*\d*/g) === false){
      setStockQuantity('');
      alert('Insira um número válido');
      return;
    }

    if(event.target.value.match(/\d+,?\d+/g)){
      return setStockQuantity(event.target.value.replace(',', '.'));
    }

    if(Number(event.target.value) || event.target.value === ''){
      return setStockQuantity(Number(event.target.value));
    }

    setStockQuantity('');
    alert('Por favor, indique a quantidade com números');
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1 className="form__title">CADASTRE UM NOVO PRODUTO</h1>
      <div className="form__field">
          <label forHtml="Nome">Nome</label>
          <input name="Nome" value={name} onChange={handleNameChange}/>
      </div>
      <div className="form__field">
          <label forHtml="Estoque">Quantidade em estoque</label>
          <input name="Estoque" value={stockQuantity} onChange={handleStockQuantity}/>
      </div>
      <div className="form__field">
          <label forHtml="Valor Unitário">Valor Unitário</label>
          <input name="Valor Unitário" value={unitaryPrice} onChange={handleUnitaryPrice} />
      </div>
      <button type="submit">Adicionar</button>
    </form>
  )
}

export default Form;