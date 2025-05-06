import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t-2 border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Sobre Nós</h3>
            <p className="text-gray-600">
              Sua loja online de confiança para produtos de qualidade.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Links Úteis</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Carrinho
                </Link>
              </li>
              <li>
                <Link to="/purchase-history" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Histórico de Compras
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Contato</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Email: contato@loja.com</li>
              <li>Telefone: (11) 9999-9999</li>
              <li>Endereço: Rua Exemplo, 123</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} GuacaLoka. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
} 