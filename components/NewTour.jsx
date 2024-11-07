"use client";

import { generateTourResponse } from "@/utils/actions";
import TourInfo from "./TourInfo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const NewTour = () => {
    const {
        mutate,
        isPending,
        data: tour,
    } = useMutation({
        mutationFn: async function (destination) {
            const newTour = await generateTourResponse(destination);
            if (newTour) {
                return newTour;
            }
            toast.error("City not found in that country. Please try again..");
            return null;
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const destination = Object.fromEntries(formData.entries());
        console.log(destination);
        mutate(destination);
    };
    if (isPending) {
        return <span className="loading loading-ball loading-lg"></span>;
    }
    return (
        <>
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <h2 className="mb-9">Choose your dream destination...</h2>
                <div className="join w-full">
                    <input
                        type="text"
                        placeholder="City..."
                        name="city"
                        className="input input-bordered join-item w-full rounded-xl"
                    />
                    <input
                        type="text"
                        placeholder="Country..."
                        name="country"
                        className="input input-bordered join-item w-full rounded-xl"
                    />
                    <button
                        className="btn btn-primary join-item capitalize rounded-xl"
                        type="submit"
                    >
                        Let's go
                    </button>
                </div>
                <div className="mt-16">
                    {tour ? <TourInfo tour={tour} /> : null}
                </div>
            </form>
        </>
    );
};

export default NewTour;
