import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export function Settings() {
  const { settings, setSettings, saveSettings } = useAuth();

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === name ? { ...setting, status: checked } : setting
      )
    );
  };

  const handleSave = () => {
    console.log('Configurações salvas:', settings);
    try {
      const res = saveSettings(settings);
      console.log("res", res);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações');
      return;
    }
  };

  return (
    <div className="mx-auto px-6 py-8 mt-6 bg-gradient-to-br from-yellow-100 via-orange-100 to-green-100 rounded-2xl">
      <h1 className="text-3xl font-extrabold text-yellow-900 mb-4 text-center">Configurações</h1>

      {/* Catálogo Section */}
      <div className="mb-8">
        <h2 className="text-1xl font-semibold text-green-800 mb-4">Catálogo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settings
            .filter((setting) =>
              ['mostrar_recomendacoes', 'mostrar_popup_carrinho', 'mostrar_descricao_produto'].includes(setting.id)
            )
            .map((setting) => (
              <label
                key={setting.id}
                className="flex items-center bg-yellow-50 p-4 rounded-lg shadow-md border-2 border-yellow-400"
              >
                <input
                  type="checkbox"
                  id={setting.id}
                  name={setting.id}
                  checked={setting.status}
                  onChange={handleCheckboxChange}
                  className="mr-3 h-5 w-5 text-green-600 focus:ring-green-500"
                />
                <span className="text-yellow-900 font-medium">
                  {setting.id === 'mostrar_recomendacoes' && 'Mostrar recomendações de produtos'}
                  {setting.id === 'mostrar_popup_carrinho' && 'Mostrar popup de adição de produto no carrinho'}
                  {setting.id === 'mostrar_descricao_produto' && 'Mostrar descrição do produto'}
                </span>
              </label>
            ))}
        </div>
      </div>

      {/* Pagamento Section */}
      <div className="mb-6">
        <h2 className="text-1xl font-semibold text-green-800 mb-4">Pagamento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settings
            .filter((setting) =>
              ['permitir_pagamento_pix', 'permitir_pagamento_cartao_credito', 'permitir_pagamento_boleto'].includes(setting.id)
            )
            .map((setting) => (
              <label
                key={setting.id}
                className="flex items-center bg-yellow-50 p-4 rounded-lg shadow-md border-2 border-yellow-400"
              >
                <input
                  type="checkbox"
                  id={setting.id}
                  name={setting.id}
                  checked={setting.status}
                  onChange={handleCheckboxChange}
                  className="mr-3 h-5 w-5 text-green-600 focus:ring-green-500"
                />
                <span className="text-yellow-900 font-medium">
                  {setting.id === 'permitir_pagamento_pix' && 'Permitir pagamento por pix'}
                  {setting.id === 'permitir_pagamento_cartao_credito' && 'Permitir pagamento por cartão de crédito'}
                  {setting.id === 'permitir_pagamento_boleto' && 'Permitir pagamento por boleto'}
                </span>
              </label>
            ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="text-center">
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold shadow-md border-2 border-yellow-400"
        >
          Salvar Configurações
        </button>
      </div>
    </div>
  );
}