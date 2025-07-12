export function Input({ ...props }) {
  return (
    <input
      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
      {...props}
    />
  );
}
