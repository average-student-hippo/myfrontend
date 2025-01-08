import React from 'react'
import Header from "../components/Layout/Header";
import SearchResults from '../components/Products/SearchResults';
import Footer from "../components/Layout/Footer";
import PreFooter from '../components/Layout/prefooter';


const HomePage = () => {
    return (
        <div>
            <Header activeHeading={1} />
            <SearchResults />
            <PreFooter />
            <Footer />
        </div>
    )
}

export default HomePage