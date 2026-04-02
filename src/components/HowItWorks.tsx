export default async function HowItWorks() {
  return (
    <div className="max-w-5xl mx-auto text-center">
      <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl p-8 border border-gray-700">
        <h3 className="text-2xl font-bold mb-4">Como Funciona</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div>
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-2xl mb-3 mx-auto">
              1
            </div>

            <h4 className="text-lg font-semibold mb-2 text-center">Escanear QR Code</h4>

            <p className="text-gray-400 text-center">
              Escaneie o código QR na sua camisa Oto Race com o celular
            </p>
          </div>

          <div>
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-2xl mb-3 mx-auto">
              2
            </div>

            <h4 className="text-lg font-semibold mb-2 text-center">Desbloquear</h4>

            <p className="text-gray-400 text-center">
              Desbloqueie conteúdos personalizados, feitos especialmente para você
            </p>
          </div>

          <div>
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-2xl mb-3 mx-auto">
              3
            </div>

            <h4 className="text-lg font-semibold mb-2 text-center">Desfrutar</h4>

            <p className="text-gray-400 text-center">
              Veja dados em tempo real para os pilotos e seus carros na palma da sua mão
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}