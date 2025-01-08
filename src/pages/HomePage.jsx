import React from 'react'
import Header from "../components/Layout/Header";
import Hero from '../components/Route/Hero/Hero';
import Categories from "../components/Route/Categories/Categories";
import BestDeals from "../components/Route/BestDeals/BestDeals";
import Events from "../components/Events/Events";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
import Sponsored from "../components/Route/Sponsored";
import Footer from "../components/Layout/Footer";
import PreFooter from '../components/Layout/prefooter';
import PromoGrid from '../components/Promotions/Promotions';

const HomePage = () => {
    return (
        <div>
            <Header activeHeading={1} />
            <Hero />
            {/* <Categories /> */}
            <BestDeals />
            <Events />
            <PromoGrid />
            <FeaturedProduct />
            <Sponsored />
            <PreFooter />
            <Footer />
        </div>
    )
}

export default HomePage