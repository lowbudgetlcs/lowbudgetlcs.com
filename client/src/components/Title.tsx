const Title = ({ title }: { title: string }) => {
  return (
    <div className="mb-12">
      <h1 className="text-5xl font-bold tracking-tight mb-4 text-text-primary">{title}</h1>
      <div className="h-1 w-24 bg-primary-light rounded-full" />
    </div>
  );
};

export default Title;