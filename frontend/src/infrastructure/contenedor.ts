import { CasosAutenticacion } from "@/application/casos-de-uso/autenticacion";
import { CasosCarrito } from "@/application/casos-de-uso/carrito";
import { CasosCatalogo } from "@/application/casos-de-uso/catalogo";
import { CasosPedidos } from "@/application/casos-de-uso/pedidos";
import { CarritoNavegador } from "./almacenamiento/carrito-navegador";
import { SesionNavegador } from "./almacenamiento/sesion-navegador";
import { AutenticacionHttp } from "./http/autenticacion-http";
import { CatalogoHttp } from "./http/catalogo-http";
import { ClienteHttp } from "./http/cliente-http";
import { PedidosHttp } from "./http/pedidos-http";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const sesion = new SesionNavegador();
const http = new ClienteHttp(API_URL, sesion);

export const autenticacion = new CasosAutenticacion(
  new AutenticacionHttp(http),
  sesion,
);
export const catalogo = new CasosCatalogo(new CatalogoHttp(http));
export const pedidos = new CasosPedidos(new PedidosHttp(http));
export const carrito = new CasosCarrito(new CarritoNavegador());
