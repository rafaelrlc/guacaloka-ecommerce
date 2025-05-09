import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export function Settings() {
  const { settings, setSettings, saveSettings } = useAuth();

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    // Atualiza o estado com base no ID correspondente
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
    }
    catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações');
      return;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 mt-5">
      <h1 className="text-3xl font-bold text-yellow-900 mb-6">Configurações de Funcionalidades</h1>

      {/* Catálogo Section */}
      <div className="bg-green-50 p-6 rounded-lg shadow-lg border border-green-200 mb-6">
        <h2 className="text-xl font-semibold text-green-800 mb-4">Catálogo</h2>
        <div className="space-y-4">
          {settings
            .filter((setting) =>
              ['mostrar_recomendacoes', 'mostrar_popup_carrinho', 'mostrar_descricao_produto'].includes(setting.id)
            )
            .map((setting) => (
              <label key={setting.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={setting.id}
                  name={setting.id}
                  checked={setting.status}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                {setting.id === 'mostrar_recomendacoes' && 'Mostrar recomendações feitas para você'}
                {setting.id === 'mostrar_popup_carrinho' && 'Mostrar popup de adição ao carrinho'}
                {setting.id === 'mostrar_descricao_produto' && 'Mostrar descrição do produto'}
              </label>
            ))}
        </div>
      </div>

      {/* Pagamento Section */}
      <div className="bg-green-50 p-6 rounded-lg shadow-lg border border-green-200 mb-6">
        <h2 className="text-xl font-semibold text-green-800 mb-4">Pagamento</h2>
        <div className="space-y-4">
          {settings
            .filter((setting) =>
              ['permitir_pagamento_pix', 'permitir_pagamento_cartao_credito', 'permitir_pagamento_boleto'].includes(setting.id)
            )
            .map((setting) => (
              <label key={setting.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={setting.id}
                  name={setting.id}
                  checked={setting.status}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                {setting.id === 'permitir_pagamento_pix' && 'Permitir pagamento por pix'}
                {setting.id === 'permitir_pagamento_cartao_credito' && 'Permitir pagamento por cartão de crédito'}
                {setting.id === 'permitir_pagamento_boleto' && 'Permitir pagamento por boleto'}
              </label>
            ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="text-right">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold shadow"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}