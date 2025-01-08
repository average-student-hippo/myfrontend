import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    AiFillHeart,
    AiOutlineEye,
    AiOutlineHeart,
    AiOutlineShoppingCart,
} from "react-icons/ai";
import { backend_url } from "../../../server.js";
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist";
import { addTocart } from "../../../redux/actions/cart";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard.jsx";
import Ratings from "../../Products/Ratings";

const ProductCard = ({ data, isEvent }) => {
    const { wishlist } = useSelector((state) => state.wishlist);
    const { cart } = useSelector((state) => state.cart);
    const [click, setClick] = useState(false);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (wishlist && wishlist.find((i) => i._id === data._id)) {
            setClick(true);
        } else {
            setClick(false);
        }
    }, [wishlist]);

    const removeFromWishlistHandler = (data) => {
        setClick(!click);
        dispatch(removeFromWishlist(data));
    };

    const addToWishlistHandler = (data) => {
        setClick(!click);
        dispatch(addToWishlist(data));
    };

    const addToCartHandler = (id) => {
        const isItemExists = cart && cart.find((i) => i._id === id);
        if (isItemExists) {
            toast.error("Item already in cart!");
        } else {
            if (data.stock < 1) {
                toast.error("Product stock limited!");
            } else {
                const cartData = { ...data, qty: 1 };
                dispatch(addTocart(cartData));
                toast.success("Item added to cart successfully!");
            }
        }
    };

    const discountPercentage = data.originalPrice
        ? Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)
        : 0;

    return (
        <div className="w-72 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Link
                to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}
                className="block relative h-48"
            >
                <img
                    src={`${backend_url}${data.images && data.images[0]}`}
                    alt={data.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                />

                {discountPercentage > 0 && (
                    <div className="absolute top-2 left-2 bg-red-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{discountPercentage}%
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-t-lg">
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                        {click ? (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    removeFromWishlistHandler(data);
                                }}
                                className="p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors backdrop-blur-sm"
                                title="Remove from wishlist"
                            >
                                <AiFillHeart size={22} className="text-red-500" />
                            </button>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    addToWishlistHandler(data);
                                }}
                                className="p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors backdrop-blur-sm"
                                title="Add to wishlist"
                            >
                                <AiOutlineHeart size={22} className="text-gray-600" />
                            </button>
                        )}

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setOpen(!open);
                            }}
                            className="p-2 rounded-full bg-white/90 shadow-md hover:bg-white transition-colors backdrop-blur-sm"
                            title="Quick view"
                        >
                            <AiOutlineEye size={22} className="text-gray-600" />
                        </button>
                    </div>
                </div>
            </Link>

            <div className="p-4">
                <Link
                    to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}
                >
                    <p className="text-sm text-blue-500 font-medium">{data.shop.name}</p>
                </Link>

                <Link to={`/product/${data._id}`}>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
                    </h3>

                    <div className="mb-2">
                        <Ratings rating={data?.ratings} />
                    </div>

                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">
                                {data.discountPrice.toLocaleString()} Ugx
                            </span>
                            {data.originalPrice ? (
                                <span className="text-xs text-gray-500 line-through">
                                    {data.originalPrice.toLocaleString()} Ugx
                                </span>
                            ) : null}
                        </div>
                        <span className="text-sm text-green-500">
                            {data?.stock} in stock
                        </span>
                    </div>
                </Link>

                <button
                    onClick={() => addToCartHandler(data._id)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-300 active:scale-95 transform"
                >
                    <AiOutlineShoppingCart size={20} />
                    Add to Cart
                </button>
            </div>

            {open && <ProductDetailsCard setOpen={setOpen} data={data} />}
        </div>
    );
};

export default ProductCard;