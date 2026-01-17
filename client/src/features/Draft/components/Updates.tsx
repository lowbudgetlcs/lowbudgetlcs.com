import { useQuery } from "@tanstack/react-query";
import getUpdates, { Update } from "../api/getUpdates";

const Updates = () => {
  const { data: updates = [] } = useQuery({
    queryKey: ["draftUpdates"],
    queryFn: getUpdates,
    staleTime: Infinity
  });

  return (
    <div className="bg-bg rounded-xl p-6 border border-border h-full shadow-lg lg:bg-transparent lg:border-none lg:shadow-none lg:p-0 lg:h-auto">
      {/* Mobile Header */}
      <h2 className="lg:hidden text-2xl font-bold mb-4 border-b border-border pb-2 text-text-primary">
        Updates
      </h2>

      {/* Desktop Header */}
      <div className="hidden lg:block mb-8">
        <h2 className="text-5xl font-bold tracking-tight mb-4 text-text-primary text-left">Updates</h2>
        <div className="h-1 w-24 bg-primary-light rounded-full" />
      </div>

      <div className="flex flex-col gap-6 lg:text-left">
        {updates.map((update) => {
            const formattedDate = new Date(update.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
          return (
            <div key={update.id} className="flex flex-col gap-1">
              <div className="flex justify-between items-baseline flex-wrap lg:justify-start lg:gap-4">
                <h3 className="text-lg font-semibold text-text-primary">{update.title}</h3>
                <span className="text-xs text-text-secondary">{formattedDate}</span>
              </div>
              <p className="text-sm text-text-secondary">{update.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Updates;
