export const useCargandoPagina = () => {
  const paginaCargando = useState('paginaEstaCargando', () => false);

  return { paginaCargando }
};
