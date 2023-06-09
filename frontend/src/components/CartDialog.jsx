import React, {useState, useContext, useEffect} from "react";
import axios from "axios";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {UserContext} from "../context/UserContext";

import CartItem from "./CartItem";
import OrderInfo from "./OrderInfo";

function CartDialog(props) {

 
    const emptyOrder = {
        customer: "",
        contact: "",
        createDate: new Date(),
        deliveryDate: new Date(),
        deliveryAddress: "",
        purchasedItems: []
    }
    
    //const {userContext, setUserContext, cartItems, emptyCart, updateCart} = useContext(UserContext); 
    const {userContext, cartItems, emptyCart, updateCart} = useContext(UserContext); 
    const [order, setOrder] = useState(emptyOrder);

    const updateOrder = (e) => {
        const {name, value} = e.target;
        setOrder( (previous) => {
            return {...previous, [name]: value};
        })
    }


    // this processOrder function is copied from processor.js
    // async function processOrder(order) {
    //     try {
    //          const res = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}product/amends`, order);
    //          //if no purchased records are processed, refund the order
    //          console.log(res.data)
    //          if (res.data.products.length === 0) {
    //             console.log("call refund");
    //             await axios.post(`${process.env.REACT_APP_API_ENDPOINT}order/status/refund`, order);
    //          } else {
    //             console.log("call confirm");
    //             await axios.post(`${process.env.REACT_APP_API_ENDPOINT}order/status/confirm`, order);
    //          }
             
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    const confirmOrder = async() => {
        try {
            const transactions = [];
            cartItems.forEach( (item) => {
                const {product, count} = item;
                transactions.push({productId: product.id, quantity: count, purchaseDate: new Date(), createDate: new Date()})
            })
            order.purchasedItems = transactions;
            
            //put inventory update and order creation all together
            await axios.post(`${process.env.REACT_APP_API_ENDPOINT}order/submitorder`, order);

            //create new order with status pending
            //const res = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}order/new`, order);
            
            // submit the pending order to rabbitmq for processing
            //await axios.post(`${process.env.REACT_APP_API_ENDPOINT}msg/sendOrder`, res.data.order);
            
            //direct process the database change without MQ, update inventory, if valid, update order status
            //await processOrder(res.data.order);
            

            
        } catch (err) {
            console.log(err)
        }
        setOrder(emptyOrder);
        emptyCart();
        props.hideCart()
    }

    useEffect( () => {
        let userInfo = {name:"", mobile:"", address:""};
        if (userContext.details !== undefined && userContext.details.userInfo !== undefined) {
            userInfo = userContext.details.userInfo;
        }        
        setOrder( (prev) => {
                return {...prev, customer: userInfo.name, contact: userInfo.mobile, address: userInfo.address};
        })
        
    }, [userContext.details])

    const CartFooter = (
        <div>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={props.hideCart} />
            <Button label="Checkout" icon="pi pi-check" className="p-button-text" onClick={confirmOrder}/>
        </div>
    );

    return (
        <Dialog visible={props.shwCart} style={{ width: '640px'}} header="Shopping Cart"  
        footer={CartFooter} modal onHide={props.hideCart}>
            <div className="cart-grid">
            {
                cartItems.map( (item) => {
                    const {product, count} = item;
                    return <CartItem cartItem={product} quantity={count} key={product.id} handleCartItemChange={updateCart}/>
             })
            }
            </div>
            <OrderInfo order={order} updateOrder={updateOrder}/>
        </Dialog>
    )
}

export default CartDialog;