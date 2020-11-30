import React, { useState } from 'react';
import { useDataLayerValue } from '../context/DataLayer';

const ProductList = () => {
    const [ { products, searchResult }, dispatch ] = useDataLayerValue();
    const [ draggedItem, setDraggeditem ] = useState('');

    function reorderProductsArray(products){
        dispatch({
            type: 'SET_PRODUCT',
            payload: products
        })
    }

    function changeValueFormat(number){
        number = number.toFixed(2).split('.');
        number[0] = number[0].split(/(?=(?:...)*$)/).join('.');
        
        return number.join(',');
    }

    function onDragStart(event, index){
        setDraggeditem(products[index]);

        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData('text/html', event.target);
        event.dataTransfer.setDragImage(event.target, 20, 20);
    }

    function onDragOver(index){
        const draggedOverItem = products[index];

        if(draggedItem === draggedOverItem){
            return;
        }

        let items = products.filter(item => item !== draggedItem);

        items.splice(index, 0, draggedItem);

        localStorage.setItem('products', JSON.stringify(items));
        dispatch({
            type: 'SET_PRODUCT',
            payload: items
        });
    }

    return (
        <div className="product">
            {products[0] && <h1>CONFIRA SEU ESTOQUE</h1>}
            <table>
                <thead>
                    {products[0] && <tr className="product__header">
                        <th 
                            className="product__header-id" 
                            onClick={() => {
                                const sorted = products.sort((a,b) => 
                                (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));

                                reorderProductsArray(sorted)}}
                        >ID</th>
                        <th 
                            className="product__header-name" 
                            onClick={() => {
                                const sorted = products.sort((a,b) => 
                                (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0));

                                reorderProductsArray(sorted)}}
                        >Name</th>
                        <th 
                            className="product__header-stock" 
                            onClick={() => {
                                const sorted = products.sort((a,b) => 
                                (a.stockQuantity > b.stockQuantity) ? 1 : ((b.stockQuantity > a.stockQuantity) ? -1 : 0));

                                reorderProductsArray(sorted)}}
                        >Quantidade</th>
                        <th 
                            className="product__header-unitary" 
                            onClick={() => {
                                const sorted = products.sort((a,b) => 
                                (a.unitaryPrice > b.unitaryPrice) ? 1 : ((b.unitaryPrice > a.unitaryPrice) ? -1 : 0));

                                reorderProductsArray(sorted)}}
                        >Valor Unitário</th>
                        <th 
                            className="product__header-total" 
                            onClick={() => {
                                const sorted = products.sort((a,b) => 
                                (a.fullPrice > b.fullPrice) ? 1 : ((b.fullPrice > a.fullPrice) ? -1 : 0));

                                reorderProductsArray(sorted)}}
                        >Valor Total</th>
                    </tr>}
                </thead>
                <tbody>
                { products && products.filter((product) => {
                    const regex = new RegExp(`${searchResult}`, 'gi');

                    if(searchResult === '')
                        return product;
                    
                    if(product.name.match(regex)) 
                        return product;

                }).map((product, index) => (
                    <tr 
                        className="product__container" 
                        onDragStart={(event) => onDragStart(event, index)}
                        onDragOver={() => onDragOver(index)}
                        draggable
                    >
                        <td className="product__id">
                            <h2>{product.id}</h2>
                        </td>
                        <td className="product__name">
                            <h3>{product.name}</h3>
                        </td>
                        <td className="product__stock">
                            <button className="product__decrement" onClick={() => {
                                const arr = products;

                                arr[index].stockQuantity = arr[index].stockQuantity - 1;  
                                arr[index].fullPrice = arr[index].stockQuantity * arr[index].unitaryPrice;

                                if(arr[index].stockQuantity == 0){
                                    dispatch({
                                        type: 'REMOVE_PRODUCT',
                                        payload: product
                                    })
                                    return;
                                }
                        
                                localStorage.setItem('products', JSON.stringify(arr));
                                
                                dispatch({
                                    type: 'SET_PRODUCT',
                                    payload: arr
                                });
                            }}>-</button>
                            <h3>{product.stockQuantity}</h3>
                            <button 
                                className="product__increment" 
                                onClick={() => {
                                const arr = products;

                                arr[index].stockQuantity = arr[index].stockQuantity + 1;
                                arr[index].fullPrice = arr[index].stockQuantity * arr[index].unitaryPrice;

                                localStorage.setItem('products', JSON.stringify(arr));

                                dispatch({
                                    type: 'SET_PRODUCT',
                                    payload: arr
                                });
                            }}>+</button>
                        </td>
                        <td className="product__unprice">
                          <h4>{changeValueFormat(product.unitaryPrice)}</h4>
                        </td>
                        <td className="product__fullprice">
                            <h4>{changeValueFormat(product.fullPrice)}</h4>
                            <button 
                                className="product__delete"
                                onClick={() => {                                    

                                    dispatch({
                                        type: 'REMOVE_PRODUCT',
                                        payload: product
                                    })
                                }}
                            >X</button>
                        </td>
                    </tr>
            ))}
            </tbody>
            </table>

        </div>
    )
}

export default ProductList;