import Link from "next/link";
import React from "react";

const HomePage = () => {
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-lg">
                    <h1 className="text-6xl font-bold text-accent">ToursGPT</h1>
                    <p className="py-8 text-lg leading-loose">
                        Tours GPT: Discover top attractions and hidden gems in
                        any city. Simply enter a city name to receive
                        personalized recommendations, user reviews, and
                        essential information to enhance your travel experience.
                        Plan your next adventure effortlessly with City
                        Explorer!
                    </p>
                    <Link href="/chat" className="btn btn-secondary">
                        {" "}
                        Get Started{" "}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
