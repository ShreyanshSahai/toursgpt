"use client";

import { getAllTours } from "@/utils/actions";
import { useQuery } from "@tanstack/react-query";
import ToursList from "./ToursList";
import { useState } from "react";

const ToursPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { data, isPending } = useQuery({
        queryKey: ["tour", searchTerm],
        queryFn: () => getAllTours(searchTerm),
    });
    return (
        <>
            <form className="mb-16 mt-3 max-w-2xl">
                <div className="join w-full rounded-2xl">
                    <input
                        name="searchTerm"
                        placeholder="City / Country"
                        className="join-item w-full bg-base-100 px-4 py-2 input input-bordered"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                    />
                    <button type="submit" className="btn join-item btn-primary">
                        {isPending ? "Searching..." : "Search"}
                    </button>
                </div>
            </form>
            {isPending ? (
                <div className=" flex justify-center align-middle h-full">
                    <span className="loading loading-spinner loading-lg mt-8">
                        Loading
                    </span>
                </div>
            ) : (
                <ToursList data={data}></ToursList>
            )}
        </>
    );
};

export default ToursPage;
