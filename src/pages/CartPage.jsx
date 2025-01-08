import React from 'react'
import Header from '../components/Layout/Header'
import Cart from '../components/cart/Cart';
import Footer from '../components/Layout/Footer';
import PreFooter from '../components/Layout/prefooter';

const CartPage = () => {
    return (
        <div>
            <Header />
            <br />
            <br />
            <Cart />
            <br />
            <br />
            <PreFooter />
            <br />
            <Footer />
        </div>
    )
}

export default CartPage