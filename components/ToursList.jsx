import ToursCard from "./ToursCard";

const ToursList = ({ data }) => {
    if (data && data.length === 0)
        return (
            <h4 className="text-lg">
                No Tours found, Please create a new Tour from New Tours Page...
            </h4>
        );
    return (
        <div className="grid mt-8 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.map((tour) => {
                return <ToursCard key={tour.id} tour={tour}></ToursCard>;
            })}
        </div>
    );
};

export default ToursList;
