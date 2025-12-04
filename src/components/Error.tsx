interface ErrorMessageProps {
  error: string | null;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-100 text-sm font-normal rounded-sm">
      <p className="text-sm text-red-500">{error}</p>
    </div>
  );
}
