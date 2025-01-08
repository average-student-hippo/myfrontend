import React from 'react';
import { useNavigate } from 'react-router-dom';

const PopularCategories = ({ categories }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category.title}`);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border">
      <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-3 lg:gap-[20px] xl:grid-cols-6 xl:gap-[30px]">
        {categories &&
          categories.map((category) => (
            <div
              key={category.id}
              className="w-full h-[100px] flex items-center justify-between cursor-pointer overflow-hidden rounded-2xl border p-4 hover:shadow-lg transition-shadow"
              onClick={() => handleCategoryClick(category)}
            >
              <div>
                <h5 className="text-[18px] font-medium leading-[1.3]">{category.title}</h5>
                <p className="text-sm text-gray-500">{category.count}</p>
              </div>
              <img
                src={category.image_Url}
                className="w-[120px] h-[80px] object-cover"
                alt={`${category.title} category`}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default PopularCategories;
