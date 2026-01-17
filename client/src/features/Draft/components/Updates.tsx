import { useQuery } from "@tanstack/react-query";
import getUpdates, { Update } from "../api/getUpdates";
import { useMemo } from "react";

const localUpdates: Update[] = [
  {
    id: 3,
    date: "Jan 12, 2026",
    title: "Fearless Draft Beta",
    description: "Added support for Fearless Draft mode. Try it out and report bugs to @thyduckylord.",
  },
  {
    id: 2,
    date: "July 2024",
    title: "Draft Tool Launch",
    description: "The official LBLCS Draft Tool is live! Create standard tournament drafts easily.",
  },
];

const Updates = () => {
  const { data: remoteUpdates = [] } = useQuery({
    queryKey: ["draftUpdates"],
    queryFn: getUpdates,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const sortedUpdates = useMemo(() => {
    const combined = [...remoteUpdates];
    localUpdates.forEach((local) => {
      if (!combined.some((remote) => remote.id === local.id)) {
        combined.push(local);
      }
    });
    return combined.sort((a, b) => b.id - a.id);
  }, [remoteUpdates]);

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
        {sortedUpdates.map((update) => {
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
