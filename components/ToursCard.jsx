import Link from "next/link";
import React from "react";

const ToursCard = ({ tour }) => {
    const { id, city, country, jsonData } = tour;
    const { title, description, stops } = JSON.parse(jsonData);

    return (
        <Link href={`/tours/${id}`}>
            <div className="card w-full bg-base-100 shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl h-full">
                <div className="card-body p-6 text-center flex flex-col justify-between">
                    <span className="text-xl font-semibold text-warning">
                        {city}, {country}
                    </span>
                    <p className="mt-2 text-sm text-accent">{title}</p>
                </div>
            </div>
        </Link>
    );
};

export default ToursCard;
