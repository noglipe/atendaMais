export default function Loading() {
  return (
    <div className="flex-1 items-center justify-center w-full">
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">Carregando clientes...</p>
      </div>
    </div>
  );
}
