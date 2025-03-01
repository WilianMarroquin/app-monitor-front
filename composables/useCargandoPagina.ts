export const useCargandoPagina = () => {
  const paginaEspera = useState('paginaEspera', () => false);

  return { paginaEspera }
};
