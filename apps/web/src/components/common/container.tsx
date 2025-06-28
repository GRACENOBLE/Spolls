const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`w-full max-w-[1280px] mx-auto ${className}`}>
      {children}
    </div>
  );
};

export default Container;
