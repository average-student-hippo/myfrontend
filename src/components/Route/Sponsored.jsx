import React from "react";

const Sponsored = () => {
    const sponsors = [
        {
            name: "MTN Uganda",
            imageUrl: "/MTN-uganda.png",
            alt: "MTN Uganda logo"
        },
        {
            name: "Stanbic Bank Uganda",
            imageUrl: "/stanbic-bank.jpg",
            alt: "Stanbic Bank Uganda logo"
        },
        {
            name: "Nile Breweries Breweries",
            imageUrl: "/nile-logo.jpg",
            alt: "Uganda Breweries logo"
        },
        {
            name: "Airtel Uganda",
            imageUrl: "airtel-logo.png",
            alt: "Airtel Uganda logo"
        },
        {
            name: "NWSC Uganda",
            imageUrl: "/nwsc.png",
            alt: "National Water and Sewerage Corporation logo"
        }
    ];

    return (
        <br />
    );
        {/*  <section className="hidden sm:block bg-white shadow-md rounded-xl p-8 mb-12 hover:shadow-lg transition-shadow duration-300">
           <div className="flex flex-wrap justify-between items-center gap-8">
                {sponsors.map((sponsor) => (
                    <div
                        key={sponsor.name}
                        className="flex items-center justify-center flex-grow basis-40"
                    >
                        <img
                            src={sponsor.imageUrl}
                            alt={sponsor.alt}
                            className="w-[150px] h-auto object-contain opacity-75 hover:opacity-100 transition-opacity duration-300"
                        />
                    </div>
                ))} 
            </div>
        </section>*/}
};

export default Sponsored;