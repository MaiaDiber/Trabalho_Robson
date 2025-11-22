import endpoints from "./Controller/pessoasController.js";


export default function Rotas(servidor) {
    servidor.use(endpoints)
}