import React from "react";

const TourInfo = ({ tour }) => {
    const { city, country, title, description, stops } = tour;
    console.log(city, country, title, description, stops);

    return (
        <div className="max-w-full p-6 bg-base-200 rounded-lg">
            <h1 className="font-bold text-5xl mb-6 text-primary">
                {`${city}, ${country}`}
            </h1>
            <h2 className="font-semibold text-2xl mb-4 text-primary">
                {`${title}`}
            </h2>
            <p className="leading-relaxed mb-6">{description}</p>

            <ol className="space-y-4">
                {stops.map((stop) => (
                    <li
                        key={stop}
                        className="p-4 border border-primary bg-base-100 rounded-xl shadow-md transition duration-300 transform hover:scale-105 hover:bg-primary hover:text-primary-content"
                        dangerouslySetInnerHTML={{
                            __html: stop.replace(
                                /\*\*(.*?)\*\*/g,
                                "<strong>$1</strong>"
                            ),
                        }}
                    />
                ))}
            </ol>
        </div>
    );
};

export default TourInfo;
