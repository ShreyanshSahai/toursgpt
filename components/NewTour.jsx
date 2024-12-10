"use client";

import {
    generateTourResponse,
    getExistingTour,
    createNewTour,
} from "@/utils/actions";
import TourInfo from "./TourInfo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const NewTour = () => {
    const queryClient = useQueryClient();
    const {
        mutate,
        isPending,
        data: tour,
    } = useMutation({
        mutationFn: async function (destination) {
            try {
                const existingTour = await getExistingTour(destination);
                if (existingTour) return existingTour;
                const newTour = await generateTourResponse(destination);
                if (!newTour) {
                    toast.error("City Not Found In The Country...");
                    return null;
                }
                const response = await createNewTour(newTour);
                queryClient.invalidateQueries({ queryKey: ["tours"] });
                return newTour;
            } catch (e) {
                console.log(e);
            }
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const destination = Object.fromEntries(formData.entries());
        mutate(destination);
    };
    if (isPending) {
        return (
            <div className="flex justify-items-center justify-center align-middle">
                <span className="loading loading-ball"></span>
                <span className="loading loading-ball loading-lg"></span>
                <span className="loading loading-ball"></span>
            </div>
        );
    }
    return (
        <>
            <form onSubmit={handleSubmit} className="max-w-full">
                <h2 className="mb-9">Choose your dream destination...</h2>
                <div className="join w-full max-w-3xl">
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
                <div className="mt-8">
                    {tour ? <TourInfo tour={tour} /> : null}
                </div>
            </form>
        </>
    );
};

export default NewTour;
