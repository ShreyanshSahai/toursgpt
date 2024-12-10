import TourInfo from "@/components/TourInfo";
import { getSingleTour } from "@/utils/actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import Image from "next/image";
import axios from "axios";
const url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_API_KEY}&query=`;

const SignleTourPage = async ({ params }) => {
    const tour = await getSingleTour(params.id);
    if (!tour) {
        redirect("/tours");
    }
    // const { data } = await axios(`${url}${tour.city},${tour.country}`);
    // const tourImage = data?.results[0]?.urls?.raw;

    return (
        <div>
            <Link className="bg-base-200" href="/tours">
                <IoArrowBackCircleSharp className="w-10 h-10 text-primary" />
            </Link>
            {/* {tourImage ? (
                <Image
                    src={tourImage}
                    className="rounded-xl shadow-xl mb-6 mt-8 h-96 w-96 object-cover"
                    alt={tour.title}
                    height={300}
                    width={300}
                    priority
                />
            ) : null} */}
            <TourInfo tour={tour}></TourInfo>
        </div>
    );
};

export default SignleTourPage;
