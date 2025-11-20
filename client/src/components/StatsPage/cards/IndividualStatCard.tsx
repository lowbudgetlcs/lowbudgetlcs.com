const IndividualStatCard = ({
  icon,
  iconBgColor,
  title,
  value,
  valueColor,
}: {
  icon: React.ReactNode;
  iconBgColor: string;
  title: string;
  value: string | number;
  valueColor?: string;
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center px-4 border-gray border-2 bg-gray bg-opacity-20 rounded-md truncate">
      <div className={`${iconBgColor} p-1 rounded-md`}>{icon}</div>
      <div className="text flex flex-col p-2 items-center sm:items-start truncate">
        <h2 className="opacity-55">{title}</h2>
        <p className={`text-2xl ${valueColor}`}>{value}</p>
      </div>
    </div>
  );
};

export default IndividualStatCard;