const EmptyStateCard = ({
  icon: Icon,
  title,
  description,
  action,
  className = '',
  iconClassName = '',
  contentClassName = '',
}) => {
  return (
    <div className={`flex h-full w-full items-center justify-center rounded-base border border-dashed border-neutral-200 bg-white px-5 py-10 text-center shadow-[0_12px_30px_rgba(17,25,43,0.04)] dark:border-neutral-700 dark:bg-neutral-800 sm:px-8 sm:py-12 ${className}`}>
      <div className={`mx-auto flex max-w-lg flex-col items-center gap-4 ${contentClassName}`}>
        {Icon && (
          <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-200 ${iconClassName}`}>
            <Icon size={26} />
          </div>
        )}

        <div className="space-y-2">
          <p className="text-lg font-semibold text-neutral-950 dark:text-neutral-100">{title}</p>
          <p className="text-sm leading-6 text-neutral-500 dark:text-neutral-400">{description}</p>
        </div>

        {action}
      </div>
    </div>
  );
};

export default EmptyStateCard;