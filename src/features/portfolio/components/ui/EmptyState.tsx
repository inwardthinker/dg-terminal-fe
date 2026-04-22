type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="bg-bg-1 border border-line-c rounded-r7 p-sp5 text-support text-center">
      {message}
    </div>
  );
}
